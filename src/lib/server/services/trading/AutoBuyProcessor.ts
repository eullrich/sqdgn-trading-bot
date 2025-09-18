import { tradingRepo, auditRepo } from '$lib/server/database';
import type {
	AutoBuyQueue,
	UserTradingConfig,
	TradingSignal,
	OrderRequest
} from '$lib/types/trading.types';
import { OrderExecutor } from './OrderExecutor';
import { PositionManager } from './PositionManager';
import { TrailingStopManager } from './TrailingStopManager';

export class AutoBuyProcessor {
	private orderExecutor: OrderExecutor;
	private positionManager: PositionManager;
	private trailingStopManager: TrailingStopManager;

	constructor(
		orderExecutor: OrderExecutor,
		positionManager: PositionManager,
		trailingStopManager?: TrailingStopManager
	) {
		this.orderExecutor = orderExecutor;
		this.positionManager = positionManager;
		this.trailingStopManager = trailingStopManager || new TrailingStopManager();
	}

	async queueOrder(config: UserTradingConfig, signal: TradingSignal): Promise<void> {
		try {
			console.log(`🎯 Queuing auto-buy: ${signal.tokenSymbol} for ${config.user_wallet_address}`);
			
			const queueData = {
				userWalletAddress: config.user_wallet_address,
				tokenAddress: signal.tokenAddress,
				tokenSymbol: signal.tokenSymbol,
				buyAmountSol: config.default_buy_amount_sol || 0.1,
				slippageBps: config.default_slippage_bps || 100,
				status: 'pending',
				...(signal.callId && {
					call: {
						connect: { id: signal.callId }
					}
				})
			};

			const data = await tradingRepo.queueAutoBuy(queueData);

			console.log(`✅ Queued auto-buy for ${config.user_wallet_address.substring(0, 8)}... - ${signal.tokenSymbol} (${queueData.buyAmountSol} SOL)`);

			// Log successful queue to audit logs
			await auditRepo.logEvent('auto_buy_queued', 'auto_buy_queue', {
				signal: signal.tokenSymbol,
				wallet: config.user_wallet_address,
				amount_sol: queueData.buyAmountSol,
				queue_id: data.id
			});
		} catch (error) {
			console.error('💥 Exception in queueOrder:', {
				error: error instanceof Error ? error.message : String(error),
				signal: signal.tokenSymbol,
				wallet: config.user_wallet_address.substring(0, 8) + '...'
			});

			// Log error to audit logs
			await auditRepo.logEvent('auto_buy_queue_error', 'auto_buy_queue', {
				error: error instanceof Error ? error.message : String(error),
				signal: signal.tokenSymbol,
				wallet: config.user_wallet_address,
				queue_data: queueData
			});
		}
	}

	async processQueue(): Promise<void> {
		try {
			// Get pending orders
			const orders = await tradingRepo.findPendingAutoBuyOrders(10);

			if (!orders || orders.length === 0) {
				return;
			}

			console.log(`Processing ${orders.length} pending auto-buy orders`);

			// Process each order
			for (const order of orders) {
				await this.processOrder(order);
			}
		} catch (error) {
			console.error('Error processing auto-buy queue:', error);
		}
	}

	private async processOrder(order: AutoBuyQueue): Promise<void> {
		try {
			// Update status to processing
			await this.updateOrderStatus(order.id, 'processing');

			// Get user config
			const config = await tradingRepo.findUserConfig(order.userWalletAddress);

			if (!config) {
				throw new Error('User config not found');
			}

			// Check position limits
			const canProceed = await this.positionManager.checkPositionLimits(
				order.userWalletAddress,
				order.tokenAddress,
				order.buyAmountSol,
				config.maxPositionSizeSol || 1.0
			);

			if (!canProceed) {
				throw new Error('Position size would exceed maximum');
			}

			// Execute the order
			const orderRequest: OrderRequest = {
				userWalletAddress: order.userWalletAddress,
				tokenAddress: order.tokenAddress,
				tokenSymbol: order.tokenSymbol,
				amountSol: order.buyAmountSol,
				slippageBps: order.slippageBps,
				orderType: 'buy'
			};

			const result = await this.orderExecutor.execute(orderRequest);

			if (!result.success) {
				throw new Error(result.error || 'Order execution failed');
			}

			// Create position
			const position = await this.positionManager.openPosition(orderRequest, result);

			// Create trailing stop if enabled
			if (config.trailingStopEnabled && config.trailingStopPercentage) {
				await this.trailingStopManager.createStop(
					position.id,
					config.trailingStopPercentage
				);
			}

			// Update order status to completed
			await this.updateOrderStatus(order.id, 'completed');

			console.log(`Auto-buy completed for ${order.userWalletAddress} - ${order.tokenSymbol}`);

		} catch (error) {
			console.error(`Error executing auto-buy for order ${order.id}:`, error);

			// Update order status to failed
			await this.updateOrderStatus(
				order.id,
				'failed',
				error instanceof Error ? error.message : 'Unknown error'
			);
		}
	}

	private async updateOrderStatus(
		orderId: string,
		status: string,
		errorMessage?: string
	): Promise<void> {
		try {
			await tradingRepo.updateAutoBuyOrder(orderId, {
				status,
				errorMessage,
				processedAt: new Date()
			});
		} catch (error) {
			console.error(`Failed to update order status:`, error);
		}
	}

	async getPendingOrders(walletAddress?: string): Promise<AutoBuyQueue[]> {
		if (walletAddress) {
			// If wallet address is specified, filter by it
			return tradingRepo.findPendingAutoBuyOrders(100).then(orders =>
				orders.filter(order => order.userWalletAddress === walletAddress)
			);
		}
		return tradingRepo.findPendingAutoBuyOrders(100);
	}

	async cancelOrder(orderId: string, walletAddress: string): Promise<void> {
		// First verify the order belongs to the wallet and is pending
		const orders = await tradingRepo.findPendingAutoBuyOrders(1000);
		const order = orders.find(o => o.id === orderId && o.userWalletAddress === walletAddress);

		if (!order) {
			throw new Error('Order not found or not cancellable');
		}

		await tradingRepo.updateAutoBuyOrder(orderId, {
			status: 'cancelled',
			processedAt: new Date()
		});
	}
}
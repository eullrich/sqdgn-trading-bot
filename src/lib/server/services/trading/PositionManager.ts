import { supabaseAdmin } from '$lib/server/database';
import type {
	TradingPosition,
	OrderRequest,
	OrderResult,
	PositionUpdate,
	IPositionManager
} from '$lib/types/trading.types';

export class PositionManager implements IPositionManager {
	async openPosition(order: OrderRequest, result: OrderResult): Promise<TradingPosition> {
		if (!result.success || !result.executedPrice || !result.tokenAmount) {
			throw new Error('Invalid order result for opening position');
		}

		const positionData = {
			user_wallet_address: order.userWalletAddress,
			token_address: order.tokenAddress,
			token_symbol: order.tokenSymbol,
			entry_price: result.executedPrice,
			entry_amount_sol: order.amountSol,
			entry_amount_tokens: result.tokenAmount,
			current_price: result.executedPrice,
			current_value_sol: order.amountSol,
			highest_price: result.executedPrice,
			status: 'open' as const,
			opened_at: new Date().toISOString()
		};

		const { data, error } = await supabaseAdmin
			.from('trading_positions')
			.insert(positionData as any)
			.select()
			.single();

		if (error) {
			throw new Error(`Failed to create position: ${error.message}`);
		}

		// Log trade history
		await this.logTrade({
			position_id: (data as any).id,
			user_wallet_address: order.userWalletAddress,
			token_address: order.tokenAddress,
			token_symbol: order.tokenSymbol,
			trade_type: 'buy',
			amount_sol: order.amountSol,
			amount_tokens: result.tokenAmount,
			price: result.executedPrice,
			slippage_bps: order.slippageBps,
			tx_signature: result.transactionId,
			tx_status: 'confirmed'
		});

		return data;
	}

	async closePosition(positionId: string, reason: string): Promise<void> {
		// Get position details
		const { data: position } = await supabaseAdmin
			.from('trading_positions')
			.select('*')
			.eq('id', positionId)
			.single() as { data: TradingPosition | null };

		if (!position) {
			throw new Error('Position not found');
		}

		const exitPrice = position.current_price || position.entry_price;
		const exitValueSol = (position.entry_amount_tokens * exitPrice) / 1e9;
		const realizedPnl = exitValueSol - position.entry_amount_sol;

		// Update position
		const { error } = await supabaseAdmin
			.from('trading_positions')
			.update({
				status: 'closed',
				exit_price: exitPrice,
				exit_amount_sol: exitValueSol,
				exit_reason: reason,
				realized_pnl_sol: realizedPnl,
				closed_at: new Date().toISOString()
			} as any)
			.eq('id', positionId);

		if (error) {
			throw new Error(`Failed to close position: ${error.message}`);
		}

		// Log sell trade
		await this.logTrade({
			position_id: positionId,
			user_wallet_address: position.user_wallet_address,
			token_address: position.token_address,
			token_symbol: position.token_symbol,
			trade_type: 'sell',
			amount_sol: exitValueSol,
			amount_tokens: position.entry_amount_tokens,
			price: exitPrice,
			tx_status: 'confirmed'
		});

		console.log(`Position ${positionId} closed: PnL ${realizedPnl.toFixed(4)} SOL`);
	}

	async updatePosition(update: PositionUpdate): Promise<void> {
		const updateData: any = {
			current_price: update.currentPrice,
			current_value_sol: update.currentValueSol,
			last_updated: new Date().toISOString()
		};

		// Update highest price if needed
		const { data: position } = await supabaseAdmin
			.from('trading_positions')
			.select('highest_price')
			.eq('id', update.positionId)
			.single();

		if (position && update.currentPrice > (position.highest_price || 0)) {
			updateData.highest_price = update.currentPrice;
		}

		const { error } = await supabaseAdmin
			.from('trading_positions')
			.update(updateData)
			.eq('id', update.positionId);

		if (error) {
			throw new Error(`Failed to update position: ${error.message}`);
		}

		// Check if position should be closed
		if (update.shouldClose && update.closeReason) {
			await this.closePosition(update.positionId, update.closeReason);
		}
	}

	async getOpenPositions(walletAddress: string): Promise<TradingPosition[]> {
		const { data, error } = await supabaseAdmin
			.from('trading_positions')
			.select('*')
			.eq('user_wallet_address', walletAddress)
			.eq('status', 'open')
			.order('opened_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch positions: ${error.message}`);
		}

		return data || [];
	}

	async getAllPositions(walletAddress: string): Promise<TradingPosition[]> {
		const { data, error } = await supabaseAdmin
			.from('trading_positions')
			.select('*')
			.eq('user_wallet_address', walletAddress)
			.order('opened_at', { ascending: false });

		if (error) {
			throw new Error(`Failed to fetch positions: ${error.message}`);
		}

		return data || [];
	}

	async checkPositionLimits(
		walletAddress: string, 
		tokenAddress: string, 
		additionalAmount: number,
		maxPositionSize: number
	): Promise<boolean> {
		// Check if user already has a position in this token
		const { data: existingPosition } = await supabaseAdmin
			.from('trading_positions')
			.select('entry_amount_sol')
			.eq('user_wallet_address', walletAddress)
			.eq('token_address', tokenAddress)
			.eq('status', 'open')
			.single();

		if (existingPosition) {
			const totalPosition = (existingPosition.entry_amount_sol || 0) + additionalAmount;
			if (totalPosition > maxPositionSize) {
				console.log(`Position size would exceed maximum: ${totalPosition} > ${maxPositionSize}`);
				return false;
			}
		}

		return true;
	}

	private async logTrade(tradeData: any): Promise<void> {
		const { error } = await supabaseAdmin
			.from('trade_history')
			.insert(tradeData);

		if (error) {
			console.error('Failed to log trade:', error);
		}
	}
}
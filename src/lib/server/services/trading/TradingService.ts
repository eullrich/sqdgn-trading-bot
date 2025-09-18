import { tradingRepo } from '$lib/server/database';
import type {
	TradingSignal,
	Call,
	UserTradingConfig,
	ITradingService,
	TradingMetrics
} from '$lib/types/trading.types';
import { TESTING_WALLET_ADDRESS } from '$lib/constants';
import { OrderExecutor } from './OrderExecutor';
import { PositionManager } from './PositionManager';
import { TrailingStopManager } from './TrailingStopManager';
import { AutoBuyProcessor } from './AutoBuyProcessor';

export class TradingService implements ITradingService {
	private orderExecutor: OrderExecutor;
	private positionManager: PositionManager;
	private trailingStopManager: TrailingStopManager;
	private autoBuyProcessor: AutoBuyProcessor;
	private isRunning: boolean = false;
	private processingInterval: NodeJS.Timeout | null = null;

	constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
		this.orderExecutor = new OrderExecutor(rpcUrl);
		this.positionManager = new PositionManager();
		this.trailingStopManager = new TrailingStopManager();
		this.autoBuyProcessor = new AutoBuyProcessor(this.orderExecutor, this.positionManager);
	}

	start(): void {
		if (this.isRunning) {
			console.log('Trading service is already running');
			return;
		}

		this.isRunning = true;
		console.log('Starting trading service...');

		// Process queue every 10 seconds
		this.processingInterval = setInterval(() => {
			this.runProcessingCycle();
		}, 10000);

		// Initial run
		this.runProcessingCycle();
	}

	stop(): void {
		if (!this.isRunning) {
			console.log('Trading service is not running');
			return;
		}

		this.isRunning = false;
		if (this.processingInterval) {
			clearInterval(this.processingInterval);
			this.processingInterval = null;
		}

		console.log('Trading service stopped');
	}

	private async runProcessingCycle(): Promise<void> {
		if (!this.isRunning) return;

		try {
			// Process auto-buy queue
			await this.autoBuyProcessor.processQueue();
			
			// Check trailing stops
			const stopUpdates = await this.trailingStopManager.checkStops();
			
			// Handle triggered stops
			for (const update of stopUpdates) {
				if (update.triggered) {
					await this.handleTriggeredStop(update.stopId);
				}
			}
		} catch (error) {
			console.error('Error in processing cycle:', error);
		}
	}

	async processSignal(signal: TradingSignal): Promise<void> {
		console.log(`Processing signal for token ${signal.tokenSymbol}`);

		// Get all users with auto-buy enabled
		const configs = await tradingRepo.findAutoBuyUsers();

		if (!configs) {
			console.error('Error fetching user configs');
			return;
		}

		console.log(`Found ${configs.length} users with auto-buy enabled`);

		// Queue auto-buy for each user
		for (const config of configs) {
			await this.autoBuyProcessor.queueOrder(config, signal);
		}
	}

	// Helper method to create test positions using the testing wallet
	static async createTestPosition(signal: TradingSignal, amountSol: number = 0.5): Promise<string | null> {
		try {
			const positionData = {
				user_wallet_address: TESTING_WALLET_ADDRESS,
				token_address: signal.tokenAddress,
				token_symbol: signal.tokenSymbol,
				entry_price: 0.0000123400, // Mock entry price
				entry_amount_sol: amountSol,
				entry_amount_tokens: amountSol / 0.0000123400, // Calculate tokens
				current_price: 0.0000123400,
				current_value_sol: amountSol,
				highest_price: 0.0000123400,
				status: 'open' as const,
				opened_at: new Date().toISOString()
			};

			const data = await tradingRepo.createPosition({
				userWalletAddress: TESTING_WALLET_ADDRESS,
				tokenAddress: signal.tokenAddress,
				tokenSymbol: signal.tokenSymbol,
				entryPrice: 0.0000123400,
				entryAmountSol: amountSol,
				entryAmountTokens: amountSol / 0.0000123400,
				currentPrice: 0.0000123400,
				currentValueSol: amountSol,
				highestPrice: 0.0000123400,
				status: 'open',
				openedAt: new Date()
			});

			console.log(`✅ Created test position for ${signal.tokenSymbol} with testing wallet`);
			return data.id;
		} catch (error) {
			console.error('Error creating test position:', error);
			return null;
		}
	}

	async executeOrder(request: any): Promise<any> {
		return this.orderExecutor.execute(request);
	}

	async getMetrics(walletAddress: string): Promise<TradingMetrics> {
		const positions = await this.positionManager.getAllPositions(walletAddress);
		const openPositions = positions.filter(p => p.status === 'open');
		const closedPositions = positions.filter(p => p.status === 'closed');

		const totalPnL = closedPositions.reduce((sum, p) => sum + (p.realizedPnlSol?.toNumber() || 0), 0);
		const winningTrades = closedPositions.filter(p => (p.realizedPnlSol?.toNumber() || 0) > 0);
		const winRate = closedPositions.length > 0
			? (winningTrades.length / closedPositions.length) * 100
			: 0;

		// Calculate average hold time in hours
		const holdTimes = closedPositions.map(p => {
			if (!p.openedAt || !p.closedAt) return 0;
			const opened = new Date(p.openedAt).getTime();
			const closed = new Date(p.closedAt).getTime();
			return (closed - opened) / (1000 * 60 * 60); // Convert to hours
		});
		const averageHoldTime = holdTimes.length > 0
			? holdTimes.reduce((sum, time) => sum + time, 0) / holdTimes.length
			: 0;

		return {
			totalPositions: positions.length,
			openPositions: openPositions.length,
			totalPnL,
			winRate,
			averageHoldTime
		};
	}

	private async handleTriggeredStop(stopId: string): Promise<void> {
		try {
			// Get stop details from trailing stop manager
			const stops = await tradingRepo.findActiveTrailingStops();
			const stop = stops.find(s => s.id === stopId);

			if (!stop || !stop.position) return;

			const position = stop.position;
			console.log(`Trailing stop triggered for position ${position.id}`);

			// Close the position
			await this.positionManager.closePosition(position.id, 'trailing_stop');

			// Deactivate the stop
			await this.trailingStopManager.deactivateStop(stopId);
		} catch (error) {
			console.error(`Error handling triggered stop ${stopId}:`, error);
		}
	}

	// Helper method to extract token info from call
	static extractTokenFromCall(call: Call): TradingSignal | null {
		const text = call.rawMessage || '';
		const match = text.match(/\$([A-Z]+)/);
		const tokenSymbol = match ? match[1] : null;

		if (!tokenSymbol || !call.contractAddress) return null;

		return {
			callId: call.id,
			tokenAddress: call.contractAddress,
			tokenSymbol,
			signalType: 'buy', // Default to buy for now
			confidence: 0.5,
			metadata: call.metadata
		};
	}
}

// Singleton instance management
let tradingServiceInstance: TradingService | null = null;

export function getTradingService(rpcUrl?: string): TradingService {
	if (!tradingServiceInstance) {
		tradingServiceInstance = new TradingService(rpcUrl);
	}
	return tradingServiceInstance;
}
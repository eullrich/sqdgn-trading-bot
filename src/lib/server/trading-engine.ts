// Legacy wrapper for backward compatibility
// Use TradingService from services/trading/TradingService.ts instead
import { getTradingService, TradingService } from './services/trading/TradingService';
import type { Call } from '$lib/types/trading.types';

export class TradingEngine {
	private tradingService: TradingService;
	
	constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
		this.tradingService = getTradingService(rpcUrl);
	}
	
	/**
	 * Start the trading engine
	 */
	start() {
		this.tradingService.start();
	}
	
	/**
	 * Stop the trading engine
	 */
	stop() {
		this.tradingService.stop();
	}
	
	/**
	 * Process a new signal from Telegram
	 */
	async processSignal(call: Call): Promise<void> {
		const signal = TradingService.extractTokenFromCall(call);
		if (signal) {
			await this.tradingService.processSignal(signal);
		}
	}
}

// Singleton instance
let tradingEngineInstance: TradingEngine | null = null;

export function getTradingEngine(rpcUrl?: string): TradingEngine {
	if (!tradingEngineInstance) {
		tradingEngineInstance = new TradingEngine(rpcUrl);
	}
	return tradingEngineInstance;
}
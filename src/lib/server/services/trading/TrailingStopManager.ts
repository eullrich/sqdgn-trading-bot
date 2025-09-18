import { tradingRepo } from '$lib/server/database';
import type {
	TrailingStop,
	TrailingStopUpdate,
	ITrailingStopManager
} from '$lib/types/trading.types';
import { JupiterClient } from '$lib/server/jupiter-client';

export class TrailingStopManager implements ITrailingStopManager {
	private jupiterClient: JupiterClient;

	constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
		this.jupiterClient = new JupiterClient(rpcUrl);
	}

	async createStop(positionId: string, percentage: number): Promise<void> {
		// Get position details
		const position = await tradingRepo.findPositionById(positionId);

		if (!position) {
			throw new Error('Position not found');
		}

		const initialPrice = position.entryPrice.toNumber();
		const stopPrice = initialPrice * (1 - percentage / 100);

		await tradingRepo.createTrailingStop({
			position: {
				connect: { id: positionId }
			},
			highestPrice: initialPrice,
			currentStopPrice: stopPrice,
			trailingPercentage: percentage,
			isActive: true
		});

		console.log(`Created trailing stop for position ${positionId} at ${stopPrice}`);
	}

	async checkStops(): Promise<TrailingStopUpdate[]> {
		const updates: TrailingStopUpdate[] = [];

		try {
			// Get active trailing stops with position details
			const stops = await tradingRepo.findActiveTrailingStops();

			if (!stops) {
				console.log('No active trailing stops found');
				return updates;
			}

			// Check each stop
			for (const stop of stops) {
				try {
					const update = await this.checkSingleStop(stop);
					if (update) {
						updates.push(update);
						await this.updateStop(update);
					}
				} catch (error) {
					console.error(`Error checking stop ${stop.id}:`, error);
				}
			}
		} catch (error) {
			console.error('Error in checkStops:', error);
		}

		return updates;
	}

	private async checkSingleStop(stop: any): Promise<TrailingStopUpdate | null> {
		const position = stop.position;

		// Get current price from Jupiter
		const currentPrice = await this.jupiterClient.getTokenPrice(position.token_address);

		if (!currentPrice) {
			console.log(`Could not get price for ${position.token_address}`);
			return null;
		}

		// Check if we need to update the trailing stop
		if (currentPrice > stop.highestPrice.toNumber()) {
			// Price went up, update the stop
			const newStopPrice = currentPrice * (1 - stop.trailingPercentage.toNumber() / 100);

			return {
				stopId: stop.id,
				newStopPrice,
				triggered: false
			};
		} else if (currentPrice <= stop.currentStopPrice.toNumber()) {
			// Stop triggered
			console.log(`Trailing stop triggered for position ${position.id}`);

			return {
				stopId: stop.id,
				newStopPrice: stop.currentStopPrice.toNumber(),
				triggered: true
			};
		}

		return null;
	}

	async updateStop(update: TrailingStopUpdate): Promise<void> {
		if (update.triggered) {
			// Deactivate the stop
			await tradingRepo.updateTrailingStop(update.stopId, {
				isActive: false,
				triggeredAt: new Date()
			});
		} else {
			// Update stop price
			await tradingRepo.updateTrailingStop(update.stopId, {
				currentStopPrice: update.newStopPrice,
				lastCheckedAt: new Date()
			});

			console.log(`Updated trailing stop ${update.stopId}: new stop at ${update.newStopPrice}`);
		}
	}

	async deactivateStop(stopId: string): Promise<void> {
		await tradingRepo.deactivateTrailingStop(stopId);
	}

	async getActiveStops(walletAddress: string): Promise<TrailingStop[]> {
		// Get all active stops and filter by wallet
		const allStops = await tradingRepo.findActiveTrailingStops();

		// Filter by wallet address
		const userStops = allStops.filter(stop =>
			stop.position?.userWalletAddress === walletAddress
		);

		return userStops;
	}
}
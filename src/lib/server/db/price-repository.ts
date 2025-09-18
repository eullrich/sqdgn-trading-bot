import type { Prisma } from '@prisma/client';
import { db } from './index';

export class PriceRepository {
	/**
	 * Insert price snapshots in batch
	 */
	async batchInsertSnapshots(
		snapshots: Array<Prisma.TokenPriceSnapshotCreateInput>
	) {
		return db.tokenPriceSnapshot.createMany({
			data: snapshots,
			skipDuplicates: true, // Skip if time + tokenAddress already exists
		});
	}

	/**
	 * Get latest price snapshot for a token
	 */
	async getLatestPrice(tokenAddress: string) {
		return db.tokenPriceSnapshot.findFirst({
			where: { tokenAddress },
			orderBy: { time: 'desc' },
		});
	}

	/**
	 * Get price history for a token
	 */
	async getPriceHistory(
		tokenAddress: string,
		options: {
			startTime?: Date;
			endTime?: Date;
			limit?: number;
		} = {}
	) {
		const { startTime, endTime, limit = 1000 } = options;

		return db.tokenPriceSnapshot.findMany({
			where: {
				tokenAddress,
				...(startTime && { time: { gte: startTime } }),
				...(endTime && { time: { lte: endTime } }),
			},
			orderBy: { time: 'asc' },
			take: limit,
		});
	}

	/**
	 * Get price snapshots after a specific time for a token
	 */
	async getPricesAfter(tokenAddress: string, afterTime: Date) {
		return db.tokenPriceSnapshot.findMany({
			where: {
				tokenAddress,
				time: { gt: afterTime },
			},
			orderBy: { time: 'asc' },
			take: 2016, // 1 week of 5-minute snapshots
		});
	}

	/**
	 * Get latest prices for multiple tokens
	 */
	async getLatestPricesForTokens(tokenAddresses: string[]) {
		const latestPrices = await Promise.all(
			tokenAddresses.map(async (address) => {
				const latest = await db.tokenPriceSnapshot.findFirst({
					where: { tokenAddress: address },
					orderBy: { time: 'desc' },
				});
				return { tokenAddress: address, ...latest };
			})
		);

		return latestPrices.filter((price) => price.priceUsd !== undefined);
	}

	/**
	 * Get tokens with recent price data
	 */
	async getActiveTokens(hoursBack: number = 24) {
		const since = new Date();
		since.setHours(since.getHours() - hoursBack);

		const result = await db.tokenPriceSnapshot.groupBy({
			by: ['tokenAddress'],
			where: {
				time: { gte: since },
			},
			_count: {
				tokenAddress: true,
			},
			orderBy: {
				_count: {
					tokenAddress: 'desc',
				},
			},
		});

		return result.map((item) => ({
			tokenAddress: item.tokenAddress,
			snapshotCount: item._count.tokenAddress,
		}));
	}

	/**
	 * Get price statistics for a token over a time period
	 */
	async getPriceStats(
		tokenAddress: string,
		startTime: Date,
		endTime: Date
	) {
		const snapshots = await db.tokenPriceSnapshot.findMany({
			where: {
				tokenAddress,
				time: {
					gte: startTime,
					lte: endTime,
				},
			},
			select: {
				priceUsd: true,
				volume24h: true,
				liquidityUsd: true,
			},
		});

		if (snapshots.length === 0) {
			return null;
		}

		const prices = snapshots.map((s) => s.priceUsd);
		const volumes = snapshots
			.map((s) => s.volume24h)
			.filter((v): v is number => v !== null);
		const liquidities = snapshots
			.map((s) => s.liquidityUsd)
			.filter((l): l is number => l !== null);

		return {
			count: snapshots.length,
			minPrice: Math.min(...prices),
			maxPrice: Math.max(...prices),
			avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
			avgVolume: volumes.length > 0 ? volumes.reduce((a, b) => a + b, 0) / volumes.length : 0,
			avgLiquidity: liquidities.length > 0 ? liquidities.reduce((a, b) => a + b, 0) / liquidities.length : 0,
		};
	}

	/**
	 * Delete old price snapshots (for cleanup)
	 */
	async deleteOldSnapshots(beforeDate: Date) {
		return db.tokenPriceSnapshot.deleteMany({
			where: {
				time: {
					lt: beforeDate,
				},
			},
		});
	}

	/**
	 * Get price change for a token over a specific period
	 */
	async getPriceChange(
		tokenAddress: string,
		hoursBack: number
	): Promise<{ startPrice: number; endPrice: number; changePercent: number } | null> {
		const endTime = new Date();
		const startTime = new Date();
		startTime.setHours(startTime.getHours() - hoursBack);

		const [startSnapshot, endSnapshot] = await Promise.all([
			db.tokenPriceSnapshot.findFirst({
				where: {
					tokenAddress,
					time: { gte: startTime },
				},
				orderBy: { time: 'asc' },
			}),
			db.tokenPriceSnapshot.findFirst({
				where: {
					tokenAddress,
					time: { lte: endTime },
				},
				orderBy: { time: 'desc' },
			}),
		]);

		if (!startSnapshot || !endSnapshot) {
			return null;
		}

		const changePercent =
			((endSnapshot.priceUsd - startSnapshot.priceUsd) / startSnapshot.priceUsd) * 100;

		return {
			startPrice: startSnapshot.priceUsd,
			endPrice: endSnapshot.priceUsd,
			changePercent,
		};
	}

	/**
	 * Get top movers (biggest price changes) in the last period
	 */
	async getTopMovers(
		hoursBack: number = 24,
		limit: number = 10
	): Promise<Array<{
		tokenAddress: string;
		startPrice: number;
		endPrice: number;
		changePercent: number;
		volume24h: number | null;
	}>> {
		const endTime = new Date();
		const startTime = new Date();
		startTime.setHours(startTime.getHours() - hoursBack);

		// Get all tokens that have data in this period
		const activeTokens = await db.tokenPriceSnapshot.groupBy({
			by: ['tokenAddress'],
			where: {
				time: {
					gte: startTime,
					lte: endTime,
				},
			},
			_count: {
				tokenAddress: true,
			},
			having: {
				tokenAddress: {
					_count: {
						gte: 2, // Must have at least 2 data points
					},
				},
			},
		});

		// Calculate price changes for each token
		const priceChanges = await Promise.all(
			activeTokens.map(async (token) => {
				const [startSnapshot, endSnapshot] = await Promise.all([
					db.tokenPriceSnapshot.findFirst({
						where: {
							tokenAddress: token.tokenAddress,
							time: { gte: startTime },
						},
						orderBy: { time: 'asc' },
					}),
					db.tokenPriceSnapshot.findFirst({
						where: {
							tokenAddress: token.tokenAddress,
							time: { lte: endTime },
						},
						orderBy: { time: 'desc' },
					}),
				]);

				if (!startSnapshot || !endSnapshot) {
					return null;
				}

				const changePercent =
					((endSnapshot.priceUsd - startSnapshot.priceUsd) / startSnapshot.priceUsd) * 100;

				return {
					tokenAddress: token.tokenAddress,
					startPrice: startSnapshot.priceUsd,
					endPrice: endSnapshot.priceUsd,
					changePercent,
					volume24h: endSnapshot.volume24h,
				};
			})
		);

		// Filter out null results and sort by absolute change
		return priceChanges
			.filter((change): change is NonNullable<typeof change> => change !== null)
			.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
			.slice(0, limit);
	}

	/**
	 * Get OHLCV data for charting
	 */
	async getOHLCVData(
		tokenAddress: string,
		startTime: Date,
		endTime: Date,
		intervalMinutes: number = 60 // 1 hour intervals
	) {
		const snapshots = await db.tokenPriceSnapshot.findMany({
			where: {
				tokenAddress,
				time: {
					gte: startTime,
					lte: endTime,
				},
			},
			orderBy: { time: 'asc' },
		});

		if (snapshots.length === 0) {
			return [];
		}

		// Group snapshots into intervals
		const intervals: Array<{
			time: Date;
			open: number;
			high: number;
			low: number;
			close: number;
			volume: number;
		}> = [];

		let currentInterval: typeof snapshots = [];
		let intervalStart = new Date(startTime);

		for (const snapshot of snapshots) {
			const snapshotTime = new Date(snapshot.time);
			const nextIntervalStart = new Date(intervalStart.getTime() + intervalMinutes * 60 * 1000);

			if (snapshotTime >= nextIntervalStart) {
				// Process current interval
				if (currentInterval.length > 0) {
					intervals.push(this.processInterval(intervalStart, currentInterval));
				}

				// Start new interval
				intervalStart = nextIntervalStart;
				currentInterval = [snapshot];
			} else {
				currentInterval.push(snapshot);
			}
		}

		// Process last interval
		if (currentInterval.length > 0) {
			intervals.push(this.processInterval(intervalStart, currentInterval));
		}

		return intervals;
	}

	private processInterval(
		intervalTime: Date,
		snapshots: Array<{ priceUsd: number; volume24h: number | null }>
	) {
		const prices = snapshots.map((s) => s.priceUsd);
		const volumes = snapshots
			.map((s) => s.volume24h || 0)
			.filter((v) => v > 0);

		return {
			time: intervalTime,
			open: prices[0],
			high: Math.max(...prices),
			low: Math.min(...prices),
			close: prices[prices.length - 1],
			volume: volumes.length > 0 ? Math.max(...volumes) : 0, // Use max volume in interval
		};
	}

	/**
	 * Get latest snapshot for a token (alias for analytics service)
	 */
	async getLatestSnapshot(tokenAddress: string) {
		return this.getLatestPrice(tokenAddress);
	}

	/**
	 * Get time series data for analytics
	 */
	async getTimeSeriesData(tokenAddress: string, startTime: Date) {
		return this.getPriceHistory(tokenAddress, { startTime });
	}

	/**
	 * Get latest snapshots (for analytics top movers)
	 */
	async getLatestSnapshots(limit: number = 1000) {
		return db.tokenPriceSnapshot.findMany({
			orderBy: { time: 'desc' },
			take: limit,
		});
	}
}
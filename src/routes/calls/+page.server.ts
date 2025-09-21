import type { PageServerLoad } from './$types';
import { callsRepo, priceRepo } from '$lib/server/database';

export const load: PageServerLoad = async () => {
	try {
		console.log('📞 Server-side load function called for /calls page');

		const limit = 20;
		const offset = 0;

		// Use repository to get calls with filters
		const filters = {};

		console.log('📞 Loading calls server-side with filters:', filters);

		const data = await callsRepo.findManyWithFilters({
			filters,
			orderBy: { messageTimestamp: 'desc' },
			skip: offset,
			take: limit
		});

		console.log('📞 Server-side data loaded:', {
			dataExists: !!data,
			count: data?.length || 0,
			sampleIds: data?.slice(0, 3).map(d => d.id) || []
		});

		if (!data) {
			console.warn('No data returned from server-side query');
			return {
				calls: [],
				pagination: { limit, offset, total: 0 },
				lastPriceRefresh: null
			};
		}

		// Get latest snapshot data for liquidity and volume (simplified for server-side)
		const callsWithSnapshots = await Promise.all((data || []).map(async (call: any) => {
			let currentLiquidity: number | null = null;
			let currentVolume: number | null = null;
			let snapshotUpdatedAt: string | null = null;

			// Fetch latest price snapshot for this token if we have a contract address
			if (call.contractAddress) {
				const latestSnapshot = await priceRepo.getLatestPrice(call.contractAddress);

				if (latestSnapshot) {
					currentLiquidity = latestSnapshot.liquidityUsd;
					currentVolume = latestSnapshot.volume24h;
					snapshotUpdatedAt = latestSnapshot.time.toISOString();
				}
			}

			// Calculate market cap change
			let marketCapChange: number | null = null;
			if (call.marketCap && call.currentMarketCap && call.marketCap > 0) {
				marketCapChange = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
			}

			// Calculate liquidity change
			let liquidityChange: number | null = null;
			if (call.liquidity && currentLiquidity && call.liquidity > 0) {
				liquidityChange = ((currentLiquidity - call.liquidity) / call.liquidity) * 100;
			}

			// Calculate volume change
			let volumeChange: number | null = null;
			if (call.volume24h && currentVolume && call.volume24h > 0) {
				volumeChange = ((currentVolume - call.volume24h) / call.volume24h) * 100;
			}

			// Complete serialization to handle all Prisma types (Decimal, BigInt, etc.)
			const rawCall = JSON.parse(JSON.stringify(call));

			// Explicitly convert any remaining problematic fields
			const serializedCall = {
				...rawCall,
				// Ensure all numeric fields are plain numbers
				marketCap: rawCall.marketCap ? Number(rawCall.marketCap) : null,
				liquidity: rawCall.liquidity ? Number(rawCall.liquidity) : null,
				volume24h: rawCall.volume24h ? Number(rawCall.volume24h) : null,
				currentPriceUsd: rawCall.currentPriceUsd ? Number(rawCall.currentPriceUsd) : null,
				currentMarketCap: rawCall.currentMarketCap ? Number(rawCall.currentMarketCap) : null,
				priceUsd: rawCall.priceUsd ? Number(rawCall.priceUsd) : null,

				// Ensure dates are ISO strings
				messageTimestamp: rawCall.messageTimestamp ? new Date(rawCall.messageTimestamp).toISOString() : null,
				createdAt: rawCall.createdAt ? new Date(rawCall.createdAt).toISOString() : null,
				updatedAt: rawCall.updatedAt ? new Date(rawCall.updatedAt).toISOString() : null,

				// Add computed fields
				market_cap_change: marketCapChange,
				current_liquidity: currentLiquidity,
				current_volume: currentVolume,
				snapshot_updated_at: snapshotUpdatedAt,
				price_change: marketCapChange, // Using market cap as price proxy
				liquidity_change: liquidityChange,
				volume_change: volumeChange
			};

			return serializedCall;
		}));

		// Get the latest price refresh timestamp
		const latestSnapshots = await priceRepo.getActiveTokens(1); // Get tokens with data in last hour
		const latestTime = latestSnapshots.length > 0
			? (await priceRepo.getLatestPrice(latestSnapshots[0].tokenAddress))?.time
			: null;

		// Get total count for pagination
		const totalCount = await callsRepo.countWithFilters(filters);

		console.log('📞 Server-side load completed successfully:', {
			callsCount: callsWithSnapshots.length,
			totalCount
		});

		return {
			calls: callsWithSnapshots,
			pagination: {
				limit,
				offset,
				total: totalCount
			},
			lastPriceRefresh: latestTime?.toISOString() || null
		};

	} catch (error) {
		console.error('📞 Server-side load error:', error);
		return {
			calls: [],
			pagination: { limit: 20, offset: 0, total: 0 },
			lastPriceRefresh: null,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
};
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { callsRepo, priceRepo } from '$lib/server/database';
import { DataPipeline } from '$lib/server/data-pipeline';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
		const offset = parseInt(url.searchParams.get('offset') || '0');
		const tokenSymbol = url.searchParams.get('token');
		const callType = url.searchParams.get('call_type');
		const label = url.searchParams.get('label');
		const isValid = url.searchParams.get('is_valid');
		const sortField = url.searchParams.get('sort_field') || 'messageTimestamp';
		const sortDirection = url.searchParams.get('sort_direction') || 'desc';

		// Use repository to get calls with filters
		const filters = {
			...(tokenSymbol && { tokenSymbol: tokenSymbol.toUpperCase() }),
			...(callType && { callType }),
			...(label && { sqdgnLabel: label }),
			...(isValid !== null && { isValid: isValid === 'true' })
		};

		const data = await callsRepo.findManyWithFilters({
			filters,
			orderBy: { [sortField]: sortDirection === 'asc' ? 'asc' : 'desc' },
			skip: offset,
			take: limit
		});

		if (!data) {
			console.warn('No data returned from query');
			return json({ calls: [], pagination: { limit, offset, total: 0 } });
		}

		// Get latest snapshot data for liquidity and volume
		const callsWithSnapshots = await Promise.all((data || []).map(async (call: Record<string, any>) => {
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
			
			// Calculate deltas
			let priceChange: number | null = null;
			let liquidityChange: number | null = null;
			let volumeChange: number | null = null;
			let marketCapChange: number | null = null;

			// Price change (we don't have initial price, so use market cap as proxy)
			if (call.marketCap && call.currentMarketCap && call.marketCap > 0) {
				marketCapChange = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
			}

			// Liquidity change
			if (call.liquidity && currentLiquidity && call.liquidity > 0) {
				liquidityChange = ((currentLiquidity - call.liquidity) / call.liquidity) * 100;
			}

			// Volume change
			if (call.volume24h && currentVolume && call.volume24h > 0) {
				volumeChange = ((currentVolume - call.volume24h) / call.volume24h) * 100;
			}

			return {
				...call,
				// Removed conflicting field mappings to match frontend expectations
				// Removed: latest_price_usd mapping to avoid field conflicts
				// Removed: latest_market_cap mapping to avoid field conflicts
				market_cap_change: marketCapChange,
				// Removed: price_last_updated mapping to avoid field conflicts
				// Removed: market_cap_last_updated mapping to avoid field conflicts

				// New snapshot data
				current_liquidity: currentLiquidity,
				current_volume: currentVolume,
				snapshot_updated_at: snapshotUpdatedAt,

				// Delta calculations
				price_change: marketCapChange, // Using market cap as price proxy
				liquidity_change: liquidityChange,
				volume_change: volumeChange
			};
		}));

		// Get the latest price refresh timestamp
		const latestSnapshots = await priceRepo.getActiveTokens(1); // Get tokens with data in last hour
		const latestTime = latestSnapshots.length > 0
			? (await priceRepo.getLatestPrice(latestSnapshots[0].tokenAddress))?.time
			: null;

		// Get total count for pagination
		const totalCount = await callsRepo.countWithFilters(filters);

		return json({
			calls: callsWithSnapshots,
			pagination: {
				limit,
				offset,
				total: totalCount
			},
			lastPriceRefresh: latestTime?.toISOString() || null
		});

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { messages } = body;

		if (!Array.isArray(messages)) {
			return json({ error: 'Messages must be an array' }, { status: 400 });
		}

		// Validate message format
		for (const message of messages) {
			if (!message.messageId || !message.text) {
				return json({ 
					error: 'Each message must have messageId and text fields' 
				}, { status: 400 });
			}
		}

		// Process the messages
		const result = await DataPipeline.processMessages(messages);

		return json({
			success: result.success,
			processed: result.processed,
			created: result.created,
			updated: result.updated,
			errors: result.errors
		});

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

export interface PriceSnapshot {
	time: string;
	token_address: string;
	price_usd: number;
	price_native?: number;
	volume_5m?: number;
	volume_1h?: number;
	volume_24h?: number;
	liquidity_usd?: number;
	market_cap?: number;
	price_change_5m?: number;
	price_change_1h?: number;
	price_change_24h?: number;
	txn_buys_5m?: number;
	txn_sells_5m?: number;
}

export interface TimeSeriesAnalytics {
	overview: {
		totalTokens: number;
		activeTokens24h: number;
		totalSnapshots: number;
		avgVolumeChange24h: number;
		avgPriceChange24h: number;
		topVolumeToken: string;
		topPerformerToken: string;
	};
	pricePerformance: Array<{
		token_address: string;
		symbol?: string;
		// Initial call data
		call_created_at?: string;
		initial_price_usd?: number;
		initial_volume_24h?: number;
		initial_liquidity_usd?: number;
		initial_market_cap?: number;
		initial_txn_buys_5m?: number;
		initial_txn_sells_5m?: number;
		initial_snapshot_time?: string;
		// Current data
		current_price: number;
		current_volume_24h: number;
		current_liquidity_usd?: number;
		current_market_cap?: number;
		current_txn_buys_5m?: number;
		current_txn_sells_5m?: number;
		current_snapshot_time: string;
		// Comparisons
		price_change_since_call?: number;
		volume_change_since_call?: number;
		liquidity_change_since_call?: number;
		market_cap_change_since_call?: number;
		buy_sell_ratio_change?: number;
	}>;
	volumeAnalysis: Array<{
		token_address: string;
		symbol?: string;
		volume_24h: number;
		volume_change_24h: number;
		avg_volume_5m: number;
		peak_volume_5m: number;
		total_transactions: number;
		buy_sell_ratio: number;
	}>;
	priceHistory: Array<{
		time: string;
		avg_price_change_5m: number;
		total_volume_5m: number;
		total_transactions: number;
		active_tokens: number;
	}>;
	topMovers: {
		gainers: Array<{
			token_address: string;
			symbol?: string;
			price_change_24h: number;
			volume_24h: number;
			current_price: number;
		}>;
		losers: Array<{
			token_address: string;
			symbol?: string;
			price_change_24h: number;
			volume_24h: number;
			current_price: number;
		}>;
	};
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		const timeframe = url.searchParams.get('timeframe') || '24h'; // 1h, 24h, 7d, 30d
		const tokenAddress = url.searchParams.get('token');
		const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 500);

		// Calculate time boundaries
		const now = new Date();
		let startTime: Date;
		
		switch (timeframe) {
			case '1h':
				startTime = new Date(now.getTime() - 60 * 60 * 1000);
				break;
			case '7d':
				startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				break;
			case '30d':
				startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				break;
			case '24h':
			default:
				startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
				break;
		}

		// Base query for price snapshots
		let snapshotsQuery = supabaseAdmin
			.from('token_price_snapshots_5m')
			.select('*')
			.gte('time', startTime.toISOString())
			.order('time', { ascending: false })
			.limit(limit);

		if (tokenAddress) {
			snapshotsQuery = snapshotsQuery.eq('token_address', tokenAddress);
		}

		const { data: snapshots, error: snapshotsError } = await snapshotsQuery;

		if (snapshotsError) {
			console.error('Error fetching price snapshots:', snapshotsError);
			return json({ error: 'Failed to fetch price data' }, { status: 500 });
		}

		if (!snapshots || snapshots.length === 0) {
			return json({
				overview: {
					totalTokens: 0,
					activeTokens24h: 0,
					totalSnapshots: 0,
					avgVolumeChange24h: 0,
					avgPriceChange24h: 0,
					topVolumeToken: '',
					topPerformerToken: ''
				},
				pricePerformance: [],
				volumeAnalysis: [],
				priceHistory: [],
				topMovers: { gainers: [], losers: [] }
			});
		}

		// Get associated call data for token symbols
		const tokenAddresses = [...new Set(snapshots.map(s => s.token_address))];
		const { data: calls } = await supabaseAdmin
			.from('calls')
			.select('contract_address, token_symbol')
			.in('contract_address', tokenAddresses)
			.not('token_symbol', 'is', null);

		// Create token symbol lookup
		const symbolMap = new Map();
		calls?.forEach(call => {
			if (call.contract_address && call.token_symbol) {
				symbolMap.set(call.contract_address, call.token_symbol);
			}
		});

		// Calculate overview metrics
		const uniqueTokens = new Set(snapshots.map(s => s.token_address));
		const totalTokens = uniqueTokens.size;
		
		// Get latest snapshot per token for current state
		const latestSnapshots = new Map();
		snapshots.forEach(snapshot => {
			const existing = latestSnapshots.get(snapshot.token_address);
			if (!existing || new Date(snapshot.time) > new Date(existing.time)) {
				latestSnapshots.set(snapshot.token_address, snapshot);
			}
		});

		const latest = Array.from(latestSnapshots.values());
		
		const avgPriceChange24h = latest.reduce((sum, s) => sum + (s.price_change_24h || 0), 0) / latest.length;
		const avgVolumeChange24h = latest.reduce((sum, s) => {
			// Calculate volume change (we don't have historical volume, so use current as proxy)
			return sum + ((s.volume_24h || 0) > 0 ? 1 : -1);
		}, 0) / latest.length;

		const topVolumeSnapshot = latest.reduce((max, s) => 
			(s.volume_24h || 0) > (max.volume_24h || 0) ? s : max
		, latest[0]);
		
		const topPerformerSnapshot = latest.reduce((max, s) => 
			(s.price_change_24h || 0) > (max.price_change_24h || 0) ? s : max
		, latest[0]);

		// Get call creation data and initial comprehensive snapshots for price performance
		const { data: callsWithInitialSnapshots } = await supabaseAdmin
			.from('calls')
			.select(`
				contract_address,
				created_at,
				token_symbol
			`)
			.in('contract_address', tokenAddresses)
			.not('contract_address', 'is', null);

		// Get initial snapshots separately and join manually
		const { data: initialSnapshots } = await supabaseAdmin
			.from('token_price_snapshots_5m')
			.select(`
				token_address,
				time,
				price_usd,
				volume_24h,
				liquidity_usd,
				market_cap,
				txn_buys_5m,
				txn_sells_5m
			`)
			.in('token_address', tokenAddresses)
			.eq('source', 'dexscreener_initial')
			.order('time', { ascending: true });

		// Create comprehensive initial data lookup maps
		const initialDataMap = new Map();
		const callCreatedMap = new Map();
		
		// Build call creation date map
		callsWithInitialSnapshots?.forEach(call => {
			if (call.contract_address) {
				callCreatedMap.set(call.contract_address, call.created_at);
			}
		});

		// Build initial data map from snapshots
		initialSnapshots?.forEach(snapshot => {
			if (snapshot.token_address) {
				initialDataMap.set(snapshot.token_address, {
					price_usd: snapshot.price_usd,
					volume_24h: snapshot.volume_24h,
					liquidity_usd: snapshot.liquidity_usd,
					market_cap: snapshot.market_cap,
					txn_buys_5m: snapshot.txn_buys_5m,
					txn_sells_5m: snapshot.txn_sells_5m,
					snapshot_time: snapshot.time
				});
			}
		});

		// Price performance data with comprehensive initial vs current comparison
		const pricePerformance = latest
			.filter(s => s.price_usd > 0)
			.map(s => {
				const initialData = initialDataMap.get(s.token_address);
				const callCreatedAt = callCreatedMap.get(s.token_address);
				
				// Calculate percentage changes
				const priceChangeSinceCall = initialData?.price_usd ? 
					((s.price_usd - initialData.price_usd) / initialData.price_usd) * 100 : null;
				const volumeChangeSinceCall = initialData?.volume_24h ? 
					((s.volume_24h - initialData.volume_24h) / initialData.volume_24h) * 100 : null;
				const liquidityChangeSinceCall = initialData?.liquidity_usd ? 
					((s.liquidity_usd - initialData.liquidity_usd) / initialData.liquidity_usd) * 100 : null;
				const marketCapChangeSinceCall = initialData?.market_cap ? 
					((s.market_cap - initialData.market_cap) / initialData.market_cap) * 100 : null;
				
				// Calculate buy/sell ratio changes
				const initialBuyRatio = initialData?.txn_buys_5m && initialData?.txn_sells_5m ?
					initialData.txn_buys_5m / (initialData.txn_buys_5m + initialData.txn_sells_5m) : null;
				const currentBuyRatio = s.txn_buys_5m && s.txn_sells_5m ?
					s.txn_buys_5m / (s.txn_buys_5m + s.txn_sells_5m) : null;
				const buyRatioChange = initialBuyRatio && currentBuyRatio ?
					(currentBuyRatio - initialBuyRatio) * 100 : null;

				return {
					token_address: s.token_address,
					symbol: symbolMap.get(s.token_address),
					// Initial call data
					call_created_at: callCreatedAt,
					initial_price_usd: initialData?.price_usd,
					initial_volume_24h: initialData?.volume_24h,
					initial_liquidity_usd: initialData?.liquidity_usd,
					initial_market_cap: initialData?.market_cap,
					initial_txn_buys_5m: initialData?.txn_buys_5m,
					initial_txn_sells_5m: initialData?.txn_sells_5m,
					initial_snapshot_time: initialData?.snapshot_time,
					// Current data
					current_price: s.price_usd,
					current_volume_24h: s.volume_24h || 0,
					current_liquidity_usd: s.liquidity_usd,
					current_market_cap: s.market_cap,
					current_txn_buys_5m: s.txn_buys_5m,
					current_txn_sells_5m: s.txn_sells_5m,
					current_snapshot_time: s.time,
					// Comparisons
					price_change_since_call: priceChangeSinceCall,
					volume_change_since_call: volumeChangeSinceCall,
					liquidity_change_since_call: liquidityChangeSinceCall,
					market_cap_change_since_call: marketCapChangeSinceCall,
					buy_sell_ratio_change: buyRatioChange
				};
			})
			.sort((a, b) => (b.price_change_since_call || -999) - (a.price_change_since_call || -999))
			.slice(0, 20);

		// Volume analysis
		const volumeAnalysis = latest
			.filter(s => s.volume_24h && s.volume_24h > 0)
			.map(s => {
				const tokenSnapshots = snapshots.filter(snap => snap.token_address === s.token_address);
				const avgVolume5m = tokenSnapshots.reduce((sum, snap) => sum + (snap.volume_5m || 0), 0) / tokenSnapshots.length;
				const peakVolume5m = Math.max(...tokenSnapshots.map(snap => snap.volume_5m || 0));
				const totalTxns = (s.txn_buys_5m || 0) + (s.txn_sells_5m || 0);
				const buyRatio = totalTxns > 0 ? (s.txn_buys_5m || 0) / totalTxns : 0.5;

				return {
					token_address: s.token_address,
					symbol: symbolMap.get(s.token_address),
					volume_24h: s.volume_24h || 0,
					volume_change_24h: 0, // We don't have historical volume to calculate change
					avg_volume_5m: avgVolume5m,
					peak_volume_5m: peakVolume5m,
					total_transactions: totalTxns,
					buy_sell_ratio: buyRatio
				};
			})
			.sort((a, b) => b.volume_24h - a.volume_24h)
			.slice(0, 15);

		// Price history aggregated by time periods
		const timeGroups = new Map();
		snapshots.forEach(snapshot => {
			const timeKey = snapshot.time.substring(0, 16); // Group by hour:minute (5min intervals)
			if (!timeGroups.has(timeKey)) {
				timeGroups.set(timeKey, []);
			}
			timeGroups.get(timeKey).push(snapshot);
		});

		const priceHistory = Array.from(timeGroups.entries())
			.map(([timeKey, group]) => ({
				time: timeKey + ':00.000Z',
				avg_price_change_5m: group.reduce((sum, s) => sum + (s.price_change_5m || 0), 0) / group.length,
				total_volume_5m: group.reduce((sum, s) => sum + (s.volume_5m || 0), 0),
				total_transactions: group.reduce((sum, s) => sum + ((s.txn_buys_5m || 0) + (s.txn_sells_5m || 0)), 0),
				active_tokens: group.length
			}))
			.sort((a, b) => a.time.localeCompare(b.time))
			.slice(-48); // Last 48 time periods (4 hours if 5min intervals)

		// Top movers
		const sortedByChange = [...latest].sort((a, b) => (b.price_change_24h || 0) - (a.price_change_24h || 0));
		const gainers = sortedByChange
			.filter(s => (s.price_change_24h || 0) > 0)
			.slice(0, 10)
			.map(s => ({
				token_address: s.token_address,
				symbol: symbolMap.get(s.token_address),
				price_change_24h: s.price_change_24h || 0,
				volume_24h: s.volume_24h || 0,
				current_price: s.price_usd
			}));

		const losers = sortedByChange
			.filter(s => (s.price_change_24h || 0) < 0)
			.slice(-10)
			.reverse()
			.map(s => ({
				token_address: s.token_address,
				symbol: symbolMap.get(s.token_address),
				price_change_24h: s.price_change_24h || 0,
				volume_24h: s.volume_24h || 0,
				current_price: s.price_usd
			}));

		const analytics: TimeSeriesAnalytics = {
			overview: {
				totalTokens,
				activeTokens24h: latest.filter(s => (s.volume_24h || 0) > 0).length,
				totalSnapshots: snapshots.length,
				avgVolumeChange24h,
				avgPriceChange24h,
				topVolumeToken: symbolMap.get(topVolumeSnapshot?.token_address) || topVolumeSnapshot?.token_address || '',
				topPerformerToken: symbolMap.get(topPerformerSnapshot?.token_address) || topPerformerSnapshot?.token_address || ''
			},
			pricePerformance,
			volumeAnalysis,
			priceHistory,
			topMovers: { gainers, losers }
		};

		return json(analytics);

	} catch (error) {
		console.error('Time series analytics API error:', error);
		return json({ error: 'Failed to fetch time series analytics' }, { status: 500 });
	}
};
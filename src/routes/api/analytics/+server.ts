import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const startDate = url.searchParams.get('start_date');
		const endDate = url.searchParams.get('end_date');
		const tokenSymbol = url.searchParams.get('token');
		const callType = url.searchParams.get('call_type');
		const label = url.searchParams.get('label');
		const hours = url.searchParams.get('hours');

		// Build query for market cap-based analytics
		let query = supabaseAdmin
			.from('calls')
			.select(`
				id,
				token_symbol,
				call_type,
				sqdgn_label,
				created_at,
				market_cap,
				current_market_cap,
				market_cap_updated_at,
				current_price_usd,
				price_updated_at
			`)
			.eq('is_valid', true)
			.not('token_symbol', 'is', null);

		// Apply filters
		if (startDate) {
			query = query.gte('created_at', startDate);
		}

		if (endDate) {
			query = query.lte('created_at', endDate);
		}

		if (tokenSymbol) {
			query = query.eq('token_symbol', tokenSymbol.toUpperCase());
		}

		if (callType) {
			query = query.eq('call_type', callType);
		}

		if (label) {
			query = query.eq('sqdgn_label', label);
		}

		if (hours) {
			const hoursAgo = new Date(Date.now() - parseInt(hours) * 60 * 60 * 1000);
			query = query.gte('created_at', hoursAgo.toISOString());
		}

		const { data: calls, error } = await query.order('created_at', { ascending: false });

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch calls data' }, { status: 500 });
		}

		if (!calls || calls.length === 0) {
			return json({
				overview: {
					totalCalls: 0,
					callsWithData: 0,
					avgMarketCapROI: 0,
					totalPortfolioROI: 0,
					bestPerformer: 0,
					worstPerformer: 0,
					overallWinRate: 0
				},
				topTokens: [],
				callTypeBreakdown: [],
				labelPerformance: [],
				trends: [],
				recentActivity: []
			});
		}

		// Calculate market cap ROI for each call
		const callsWithROI = calls.map(call => {
			const initialMarketCap = call.market_cap;
			const currentMarketCap = call.current_market_cap;
			
			const marketCapROI = initialMarketCap && currentMarketCap && initialMarketCap > 0
				? ((currentMarketCap - initialMarketCap) / initialMarketCap) * 100
				: null;

			return {
				...call,
				initialMarketCap,
				currentMarketCap,
				marketCapROI,
				hasMarketCapData: !!(initialMarketCap && currentMarketCap)
			};
		});

		const callsWithData = callsWithROI.filter(call => call.hasMarketCapData);

		// Calculate overall metrics
		const totalCalls = calls.length;
		const callsWithMarketCapData = callsWithData.length;
		const avgMarketCapROI = callsWithData.length > 0 
			? callsWithData.reduce((sum, call) => sum + call.marketCapROI!, 0) / callsWithData.length
			: 0;
		
		const hypotheticalInvestment = 100; // $100 per call
		const totalPortfolioROI = callsWithData.length > 0
			? callsWithData.reduce((sum, call) => sum + call.marketCapROI!, 0) / callsWithData.length
			: 0;

		const marketCapROIs = callsWithData.map(c => c.marketCapROI!);
		const bestPerformer = marketCapROIs.length > 0 ? Math.max(...marketCapROIs) : 0;
		const worstPerformer = marketCapROIs.length > 0 ? Math.min(...marketCapROIs) : 0;
		
		const gainsCount = callsWithData.filter(c => c.marketCapROI! > 0).length;
		const overallWinRate = callsWithData.length > 0 ? (gainsCount / callsWithData.length) * 100 : 0;

		// Token performance analysis
		const tokenStats = new Map();
		callsWithData.forEach(call => {
			if (!tokenStats.has(call.token_symbol)) {
				tokenStats.set(call.token_symbol, {
					symbol: call.token_symbol,
					count: 0,
					totalROI: 0,
					bestROI: Number.NEGATIVE_INFINITY,
					worstROI: Number.POSITIVE_INFINITY,
					gains: 0
				});
			}
			
			const stats = tokenStats.get(call.token_symbol);
			stats.count++;
			stats.totalROI += call.marketCapROI!;
			stats.bestROI = Math.max(stats.bestROI, call.marketCapROI!);
			stats.worstROI = Math.min(stats.worstROI, call.marketCapROI!);
			if (call.marketCapROI! > 0) stats.gains++;
		});

		const topTokens = Array.from(tokenStats.values())
			.map(stats => ({
				symbol: stats.symbol,
				count: stats.count,
				avgROI: stats.totalROI / stats.count,
				bestROI: stats.bestROI,
				worstROI: stats.worstROI,
				winRate: (stats.gains / stats.count) * 100
			}))
			.sort((a, b) => b.avgROI - a.avgROI)
			.slice(0, 10);

		// Call type performance analysis
		const callTypeStats = new Map();
		callsWithData.forEach(call => {
			if (!call.call_type) return;
			
			if (!callTypeStats.has(call.call_type)) {
				callTypeStats.set(call.call_type, {
					type: call.call_type,
					count: 0,
					totalROI: 0,
					gains: 0
				});
			}
			
			const stats = callTypeStats.get(call.call_type);
			stats.count++;
			stats.totalROI += call.marketCapROI!;
			if (call.marketCapROI! > 0) stats.gains++;
		});

		const callTypeBreakdown = Array.from(callTypeStats.values())
			.map(stats => ({
				type: stats.type,
				count: stats.count,
				avgROI: stats.totalROI / stats.count,
				winRate: (stats.gains / stats.count) * 100
			}))
			.sort((a, b) => b.avgROI - a.avgROI);

		// SQDGN label performance analysis
		const labelStats = new Map();
		callsWithData.forEach(call => {
			if (!call.sqdgn_label) return;
			
			if (!labelStats.has(call.sqdgn_label)) {
				labelStats.set(call.sqdgn_label, {
					label: call.sqdgn_label,
					count: 0,
					totalROI: 0,
					gains: 0
				});
			}
			
			const stats = labelStats.get(call.sqdgn_label);
			stats.count++;
			stats.totalROI += call.marketCapROI!;
			if (call.marketCapROI! > 0) stats.gains++;
		});

		const labelPerformance = Array.from(labelStats.values())
			.map(stats => ({
				label: stats.label,
				count: stats.count,
				avgROI: stats.totalROI / stats.count,
				winRate: (stats.gains / stats.count) * 100
			}))
			.sort((a, b) => b.avgROI - a.avgROI);

		// Performance trends (daily)
		const dailyTrends = new Map();
		callsWithData.forEach(call => {
			const date = call.created_at.split('T')[0];
			
			if (!dailyTrends.has(date)) {
				dailyTrends.set(date, {
					date,
					calls: 0,
					totalROI: 0,
					gains: 0
				});
			}
			
			const trend = dailyTrends.get(date);
			trend.calls++;
			trend.totalROI += call.marketCapROI!;
			if (call.marketCapROI! > 0) trend.gains++;
		});

		const trends = Array.from(dailyTrends.values())
			.map(trend => ({
				date: trend.date,
				calls: trend.calls,
				avgROI: trend.totalROI / trend.calls,
				winRate: (trend.gains / trend.calls) * 100
			}))
			.sort((a, b) => a.date.localeCompare(b.date));

		// Recent activity (last 10 calls with market cap data)
		const recentActivity = callsWithData.slice(0, 10).map(call => ({
			id: call.id,
			token_symbol: call.token_symbol,
			call_type: call.call_type,
			sqdgn_label: call.sqdgn_label,
			created_at: call.created_at,
			marketCapROI: call.marketCapROI,
			initialMarketCap: call.initialMarketCap,
			currentMarketCap: call.currentMarketCap
		}));

		const analytics = {
			overview: {
				totalCalls,
				callsWithData: callsWithMarketCapData,
				avgMarketCapROI,
				totalPortfolioROI,
				bestPerformer,
				worstPerformer,
				overallWinRate
			},
			topTokens,
			callTypeBreakdown,
			labelPerformance,
			trends,
			recentActivity
		};

		return json(analytics);

	} catch (error) {
		console.error('Analytics API error:', error);
		return json({ error: 'Failed to fetch analytics' }, { status: 500 });
	}
};
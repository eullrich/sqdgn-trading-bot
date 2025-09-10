import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

interface ROIMetrics {
	portfolioROI: number;
	totalCalls: number;
	callsWithMarketCapData: number;
	unrealizedPnL: number;
	hypotheticalValue: number;
	hypotheticalInvestment: number;
	topGainers: Array<{
		symbol: string;
		callId: string;
		roi: number;
		currentPrice: number;
		initialMarketCap: number;
		currentMarketCap: number;
		marketCapChange: number;
		createdAt: string;
	}>;
	topLosers: Array<{
		symbol: string;
		callId: string;
		roi: number;
		currentPrice: number;
		initialMarketCap: number;
		currentMarketCap: number;
		marketCapChange: number;
		createdAt: string;
	}>;
	callTypePerformance: Array<{
		callType: string;
		count: number;
		avgROI: number;
		totalROI: number;
	}>;
	labelPerformance: Array<{
		label: string;
		count: number;
		avgROI: number;
		totalROI: number;
	}>;
	todaysPerformance: {
		callsToday: number;
		todayROI: number;
		biggestGainToday: number;
		biggestLossToday: number;
	};
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		const hypotheticalInvestment = 100; // $100 per call assumption
		const hoursFilter = url.searchParams.get('hours'); // 24, 168 (7d), 720 (30d)
		
		// Get calls with current market cap data
		let query = supabaseAdmin
			.from('calls')
			.select(`
				id,
				token_symbol,
				call_type,
				sqdgn_label,
				created_at,
				message_timestamp,
				market_cap,
				current_market_cap,
				market_cap_updated_at,
				current_price_usd,
				price_updated_at
			`)
			.eq('is_valid', true)
			.not('token_symbol', 'is', null);

		// Apply time filter if specified
		if (hoursFilter) {
			const hoursAgo = new Date(Date.now() - parseInt(hoursFilter) * 60 * 60 * 1000);
			query = query.gte('message_timestamp', hoursAgo.toISOString());
		}

		const { data: calls, error } = await query.order('message_timestamp', { ascending: false });

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch calls data' }, { status: 500 });
		}

		if (!calls || calls.length === 0) {
			return json({
				portfolioROI: 0,
				totalCalls: 0,
				callsWithMarketCapData: 0,
				unrealizedPnL: 0,
				hypotheticalValue: 0,
				hypotheticalInvestment: 0,
				topGainers: [],
				topLosers: [],
				callTypePerformance: [],
				labelPerformance: [],
				todaysPerformance: {
					callsToday: 0,
					todayROI: 0,
					biggestGainToday: 0,
					biggestLossToday: 0
				}
			});
		}

		// Process calls for ROI calculation based on market cap changes
		const callsWithROI = calls.map(call => {
			const initialMarketCap = call.market_cap; // Market cap when call was made
			const currentMarketCap = call.current_market_cap; // Current market cap
			
			// Calculate ROI based on market cap change
			const roi = initialMarketCap && currentMarketCap && initialMarketCap > 0
				? ((currentMarketCap - initialMarketCap) / initialMarketCap) * 100
				: 0;

			const marketCapChange = initialMarketCap && currentMarketCap
				? ((currentMarketCap - initialMarketCap) / initialMarketCap) * 100
				: 0;

			return {
				...call,
				currentPrice: call.current_price_usd || 0,
				initialMarketCap: initialMarketCap || 0,
				currentMarketCap: currentMarketCap || 0,
				roi,
				marketCapChange,
				currentValue: hypotheticalInvestment * (1 + roi / 100),
				hasMarketCapData: !!(initialMarketCap && currentMarketCap)
			};
		});

		// Filter calls that have market cap data
		const callsWithMarketCapData = callsWithROI.filter(call => call.hasMarketCapData);
		
		// Calculate portfolio metrics
		const totalInvestment = calls.length * hypotheticalInvestment;
		const totalCurrentValue = callsWithROI.reduce((sum, call) => sum + call.currentValue, 0);
		const portfolioROI = totalInvestment > 0 ? ((totalCurrentValue - totalInvestment) / totalInvestment) * 100 : 0;
		const unrealizedPnL = totalCurrentValue - totalInvestment;

		// Get top gainers and losers
		const sortedByROI = [...callsWithMarketCapData].sort((a, b) => b.roi - a.roi);
		const topGainers = sortedByROI.slice(0, 5).map(call => ({
			symbol: call.token_symbol,
			callId: call.id,
			roi: call.roi,
			currentPrice: call.currentPrice,
			initialMarketCap: call.initialMarketCap,
			currentMarketCap: call.currentMarketCap,
			marketCapChange: call.marketCapChange,
			createdAt: call.message_timestamp || call.created_at
		}));
		
		const topLosers = sortedByROI.slice(-5).reverse().map(call => ({
			symbol: call.token_symbol,
			callId: call.id,
			roi: call.roi,
			currentPrice: call.currentPrice,
			initialMarketCap: call.initialMarketCap,
			currentMarketCap: call.currentMarketCap,
			marketCapChange: call.marketCapChange,
			createdAt: call.message_timestamp || call.created_at
		}));

		// Calculate call type performance
		const callTypeStats = new Map();
		callsWithMarketCapData.forEach(call => {
			if (!call.call_type) return;
			
			if (!callTypeStats.has(call.call_type)) {
				callTypeStats.set(call.call_type, {
					count: 0,
					totalROI: 0
				});
			}
			
			const stats = callTypeStats.get(call.call_type);
			stats.count++;
			stats.totalROI += call.roi;
		});

		const callTypePerformance = Array.from(callTypeStats.entries()).map(([type, stats]) => ({
			callType: type,
			count: stats.count,
			avgROI: stats.count > 0 ? stats.totalROI / stats.count : 0,
			totalROI: stats.totalROI
		})).sort((a, b) => b.avgROI - a.avgROI);

		// Calculate SQDGN label performance
		const labelStats = new Map();
		callsWithMarketCapData.forEach(call => {
			if (!call.sqdgn_label) return;
			
			if (!labelStats.has(call.sqdgn_label)) {
				labelStats.set(call.sqdgn_label, {
					count: 0,
					totalROI: 0
				});
			}
			
			const stats = labelStats.get(call.sqdgn_label);
			stats.count++;
			stats.totalROI += call.roi;
		});

		const labelPerformance = Array.from(labelStats.entries()).map(([label, stats]) => ({
			label,
			count: stats.count,
			avgROI: stats.count > 0 ? stats.totalROI / stats.count : 0,
			totalROI: stats.totalROI
		})).sort((a, b) => b.avgROI - a.avgROI);

		// Calculate today's performance
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todaysCalls = callsWithMarketCapData.filter(call => 
			new Date(call.message_timestamp || call.created_at) >= today
		);

		const todayROI = todaysCalls.length > 0 
			? todaysCalls.reduce((sum, call) => sum + call.roi, 0) / todaysCalls.length
			: 0;

		const todaysPerformance = {
			callsToday: todaysCalls.length,
			todayROI,
			biggestGainToday: todaysCalls.length > 0 ? Math.max(...todaysCalls.map(c => c.roi)) : 0,
			biggestLossToday: todaysCalls.length > 0 ? Math.min(...todaysCalls.map(c => c.roi)) : 0
		};

		const roiMetrics: ROIMetrics = {
			portfolioROI,
			totalCalls: calls.length,
			callsWithMarketCapData: callsWithMarketCapData.length,
			unrealizedPnL,
			hypotheticalValue: totalCurrentValue,
			hypotheticalInvestment: totalInvestment,
			topGainers,
			topLosers,
			callTypePerformance,
			labelPerformance,
			todaysPerformance
		};

		return json(roiMetrics);

	} catch (error) {
		console.error('ROI Analytics API error:', error);
		return json({ error: 'Failed to calculate ROI metrics' }, { status: 500 });
	}
};
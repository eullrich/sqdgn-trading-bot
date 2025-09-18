import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

export interface ROICalculatorResult {
	summary: {
		totalInvestment: number;
		currentPortfolioValue: number;
		totalPnL: number;
		portfolioROI: number;
		totalCalls: number;
		callsWithMarketCapData: number;
		investmentPerCall: number;
		timeframe: string;
	};
	investments: Array<{
		callId: string;
		tokenSymbol: string;
		callType: string;
		sqdgnLabel: string | null;
		callDate: string;
		investmentAmount: number;
		currentValue: number;
		pnl: number;
		roi: number;
		initialMarketCap: number;
		currentMarketCap: number;
		marketCapChange: number;
		hasMarketCapData: boolean;
		contractAddress?: string;
	}>;
	topPerformers: Array<{
		callId: string;
		tokenSymbol: string;
		roi: number;
		pnl: number;
		investmentAmount: number;
		currentValue: number;
	}>;
	bottomPerformers: Array<{
		callId: string;
		tokenSymbol: string;
		roi: number;
		pnl: number;
		investmentAmount: number;
		currentValue: number;
	}>;
	performanceByCallType: Array<{
		callType: string;
		count: number;
		totalInvestment: number;
		currentValue: number;
		avgROI: number;
		totalPnL: number;
	}>;
	performanceByLabel: Array<{
		label: string;
		count: number;
		totalInvestment: number;
		currentValue: number;
		avgROI: number;
		totalPnL: number;
	}>;
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Get query parameters
		const investmentPerCallParam = url.searchParams.get('investmentPerCall') || '100';
		const hoursFilter = url.searchParams.get('hours'); // 24, 168 (7d), 720 (30d)
		
		const investmentPerCall = parseFloat(investmentPerCallParam);
		
		if (isNaN(investmentPerCall) || investmentPerCall <= 0) {
			return json({ error: 'Invalid investment amount' }, { status: 400 });
		}
		
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
				price_updated_at,
				contract_address
			`)
			.eq('is_valid', true)
			.not('token_symbol', 'is', null);

		// Apply time filter if specified
		let timeframe = 'all-time';
		if (hoursFilter) {
			const hours = parseInt(hoursFilter);
			const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
			query = query.gte('message_timestamp', hoursAgo.toISOString());
			
			if (hours === 24) timeframe = '24h';
			else if (hours === 168) timeframe = '7d';
			else if (hours === 720) timeframe = '30d';
			else timeframe = `${hours}h`;
		}

		const { data: calls, error } = await query.order('message_timestamp', { ascending: false });

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch calls data' }, { status: 500 });
		}

		if (!calls || calls.length === 0) {
			return json({
				summary: {
					totalInvestment: 0,
					currentPortfolioValue: 0,
					totalPnL: 0,
					portfolioROI: 0,
					totalCalls: 0,
					callsWithMarketCapData: 0,
					investmentPerCall,
					timeframe
				},
				investments: [],
				topPerformers: [],
				bottomPerformers: [],
				performanceByCallType: [],
				performanceByLabel: []
			});
		}

		// Process each call for ROI calculation
		const investments = calls.map(call => {
			const initialMarketCap = call.market_cap; // Market cap when call was made
			const currentMarketCap = call.current_market_cap; // Current market cap
			const hasMarketCapData = !!(initialMarketCap && currentMarketCap && initialMarketCap > 0);
			
			// Calculate ROI based on market cap change
			const roi = hasMarketCapData
				? ((currentMarketCap - initialMarketCap) / initialMarketCap) * 100
				: 0;

			const marketCapChange = hasMarketCapData
				? ((currentMarketCap - initialMarketCap) / initialMarketCap) * 100
				: 0;

			const currentValue = hasMarketCapData 
				? investmentPerCall * (1 + roi / 100)
				: investmentPerCall; // If no data, assume no change
			
			const pnl = currentValue - investmentPerCall;

			return {
				callId: call.id,
				tokenSymbol: call.token_symbol,
				callType: call.call_type || 'Unknown',
				sqdgnLabel: call.sqdgn_label,
				callDate: call.message_timestamp || call.created_at,
				investmentAmount: investmentPerCall,
				currentValue,
				pnl,
				roi,
				initialMarketCap: initialMarketCap || 0,
				currentMarketCap: currentMarketCap || 0,
				marketCapChange,
				hasMarketCapData,
				contractAddress: call.contract_address
			};
		});

		// Calculate summary metrics
		const totalInvestment = calls.length * investmentPerCall;
		const currentPortfolioValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
		const totalPnL = currentPortfolioValue - totalInvestment;
		const portfolioROI = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;
		const callsWithMarketCapData = investments.filter(inv => inv.hasMarketCapData).length;

		// Get top and bottom performers (only those with market cap data)
		const investmentsWithData = investments.filter(inv => inv.hasMarketCapData);
		const sortedByROI = [...investmentsWithData].sort((a, b) => b.roi - a.roi);
		
		const topPerformers = sortedByROI.slice(0, 5).map(inv => ({
			callId: inv.callId,
			tokenSymbol: inv.tokenSymbol,
			roi: inv.roi,
			pnl: inv.pnl,
			investmentAmount: inv.investmentAmount,
			currentValue: inv.currentValue
		}));
		
		const bottomPerformers = sortedByROI.slice(-5).reverse().map(inv => ({
			callId: inv.callId,
			tokenSymbol: inv.tokenSymbol,
			roi: inv.roi,
			pnl: inv.pnl,
			investmentAmount: inv.investmentAmount,
			currentValue: inv.currentValue
		}));

		// Calculate performance by call type
		const callTypeStats = new Map();
		investmentsWithData.forEach(inv => {
			if (!callTypeStats.has(inv.callType)) {
				callTypeStats.set(inv.callType, {
					count: 0,
					totalInvestment: 0,
					currentValue: 0,
					totalROI: 0
				});
			}
			
			const stats = callTypeStats.get(inv.callType);
			stats.count++;
			stats.totalInvestment += inv.investmentAmount;
			stats.currentValue += inv.currentValue;
			stats.totalROI += inv.roi;
		});

		const performanceByCallType = Array.from(callTypeStats.entries()).map(([type, stats]) => ({
			callType: type,
			count: stats.count,
			totalInvestment: stats.totalInvestment,
			currentValue: stats.currentValue,
			avgROI: stats.count > 0 ? stats.totalROI / stats.count : 0,
			totalPnL: stats.currentValue - stats.totalInvestment
		})).sort((a, b) => b.avgROI - a.avgROI);

		// Calculate performance by SQDGN label
		const labelStats = new Map();
		investmentsWithData.forEach(inv => {
			const label = inv.sqdgnLabel || 'No Label';
			if (!labelStats.has(label)) {
				labelStats.set(label, {
					count: 0,
					totalInvestment: 0,
					currentValue: 0,
					totalROI: 0
				});
			}
			
			const stats = labelStats.get(label);
			stats.count++;
			stats.totalInvestment += inv.investmentAmount;
			stats.currentValue += inv.currentValue;
			stats.totalROI += inv.roi;
		});

		const performanceByLabel = Array.from(labelStats.entries()).map(([label, stats]) => ({
			label,
			count: stats.count,
			totalInvestment: stats.totalInvestment,
			currentValue: stats.currentValue,
			avgROI: stats.count > 0 ? stats.totalROI / stats.count : 0,
			totalPnL: stats.currentValue - stats.totalInvestment
		})).sort((a, b) => b.avgROI - a.avgROI);

		const result: ROICalculatorResult = {
			summary: {
				totalInvestment,
				currentPortfolioValue,
				totalPnL,
				portfolioROI,
				totalCalls: calls.length,
				callsWithMarketCapData,
				investmentPerCall,
				timeframe
			},
			investments,
			topPerformers,
			bottomPerformers,
			performanceByCallType,
			performanceByLabel
		};

		return json(result);

	} catch (error) {
		console.error('ROI Calculator API error:', error);
		return json({ error: 'Failed to calculate ROI' }, { status: 500 });
	}
};
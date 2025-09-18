import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { callsRepo } from '$lib/server/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const days = parseInt(url.searchParams.get('days') || '30');
		const startDateParam = url.searchParams.get('start_date');
		const endDateParam = url.searchParams.get('end_date');
		
		let startDate: Date;
		let endDate: Date;
		
		if (startDateParam && endDateParam) {
			startDate = new Date(startDateParam);
			endDate = new Date(endDateParam);
		} else {
			endDate = new Date();
			startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
		}

		// Get all calls for the period using repository
		const calls = await callsRepo.findMany({
			where: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		const validCalls = calls?.filter(call => call.isValid) || [];
		
		// Calculate daily breakdown with enhanced metrics
		const dailyBreakdown = calculateEnhancedDailyBreakdown(validCalls, startDate, endDate);
		
		// Calculate call type distribution with performance metrics
		const callTypeDistribution = calculateEnhancedCallTypeDistribution(validCalls);
		
		// Calculate label distribution with performance metrics
		const labelDistribution = calculateEnhancedLabelDistribution(validCalls);
		
		// Calculate performance metrics
		const performanceMetrics = calculatePerformanceMetrics(validCalls);
		
		// Get best and worst performing calls
		const topPerformers = getTopPerformers(validCalls, 10);
		const worstPerformers = getWorstPerformers(validCalls, 10);
		
		// Calculate price analysis
		const priceAnalysis = calculatePriceAnalysis(validCalls);
		
		// Calculate detailed statistics
		const detailedStats = calculateDetailedStats(validCalls, days);

		return json({
			success: true,
			data: {
				overview: {
					totalCalls: calls?.length || 0,
					validCalls: validCalls.length,
					period: days,
					dateRange: {
						start: startDate.toISOString(),
						end: endDate.toISOString()
					}
				},
				dailyBreakdown,
				callTypeDistribution,
				labelDistribution,
				performanceMetrics,
				topPerformers,
				worstPerformers,
				priceAnalysis,
				detailedStats
			}
		});

	} catch (error) {
		console.error('Failed to get comprehensive analytics:', error);
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to get analytics'
		}, { status: 500 });
	}
};

function calculateEnhancedDailyBreakdown(calls: any[], startDate: Date, endDate: Date) {
	const dailyMap = new Map<string, {
		date: string;
		count: number;
		callTypes: Map<string, number>;
		successfulCalls: number;
		totalROI: number;
		uniqueTokens: Set<string>;
		totalVolume: number;
	}>();
	
	// Initialize all days
	const current = new Date(startDate);
	while (current <= endDate) {
		const dateKey = current.toISOString().split('T')[0];
		dailyMap.set(dateKey, {
			date: dateKey,
			count: 0,
			callTypes: new Map(),
			successfulCalls: 0,
			totalROI: 0,
			uniqueTokens: new Set(),
			totalVolume: 0
		});
		current.setDate(current.getDate() + 1);
	}
	
	// Process calls per day
	calls.forEach(call => {
		const callDate = new Date(call.createdAt).toISOString().split('T')[0];
		const dayData = dailyMap.get(callDate);
		if (dayData) {
			dayData.count++;
			
			// Call type breakdown
			const callType = call.callType || 'UNKNOWN';
			dayData.callTypes.set(callType, (dayData.callTypes.get(callType) || 0) + 1);
			
			// Performance metrics
			if (call.marketCap && call.currentMarketCap && call.marketCap > 0) {
				const roi = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
				dayData.totalROI += roi;
				if (roi > 0) dayData.successfulCalls++;
			}
			
			// Unique tokens
			if (call.tokenSymbol) {
				dayData.uniqueTokens.add(call.tokenSymbol);
			}
			
			// Volume
			if (call.volume24h) {
				dayData.totalVolume += call.volume24h;
			}
		}
	});
	
	// Convert to array with calculated metrics
	return Array.from(dailyMap.values())
		.map(day => ({
			date: day.date,
			count: day.count,
			callTypes: Array.from(day.callTypes.entries()).map(([type, count]) => ({ type, count })),
			successRate: day.count > 0 ? (day.successfulCalls / day.count * 100).toFixed(1) : '0',
			averageROI: day.count > 0 ? (day.totalROI / day.count).toFixed(2) : '0',
			uniqueTokens: day.uniqueTokens.size,
			totalVolume: day.totalVolume
		}))
		.sort((a, b) => a.date.localeCompare(b.date));
}

function calculateEnhancedCallTypeDistribution(calls: any[]) {
	const distribution = new Map<string, {
		count: number;
		successfulCalls: number;
		totalROI: number;
		totalVolume: number;
		avgPriceDelta: number;
		priceDeltas: number[];
	}>();
	
	calls.forEach(call => {
		const type = call.callType || 'UNKNOWN';
		if (!distribution.has(type)) {
			distribution.set(type, {
				count: 0,
				successfulCalls: 0,
				totalROI: 0,
				totalVolume: 0,
				avgPriceDelta: 0,
				priceDeltas: []
			});
		}
		
		const typeData = distribution.get(type)!;
		typeData.count++;
		
		// Performance calculations
		if (call.marketCap && call.currentMarketCap && call.marketCap > 0) {
			const roi = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
			typeData.totalROI += roi;
			typeData.priceDeltas.push(roi);
			if (roi > 0) typeData.successfulCalls++;
		}
		
		if (call.volume24h) {
			typeData.totalVolume += call.volume24h;
		}
	});
	
	return Array.from(distribution.entries())
		.map(([type, data]) => {
			// Calculate median ROI
			const sortedROIs = [...data.priceDeltas].sort((a, b) => a - b);
			const medianROI = sortedROIs.length > 0 
				? sortedROIs.length % 2 === 0
					? (sortedROIs[sortedROIs.length / 2 - 1] + sortedROIs[sortedROIs.length / 2]) / 2
					: sortedROIs[Math.floor(sortedROIs.length / 2)]
				: 0;
			
			// Calculate profit factor
			const profits = data.priceDeltas.filter(roi => roi > 0);
			const losses = data.priceDeltas.filter(roi => roi < 0);
			const totalProfits = profits.reduce((sum, roi) => sum + roi, 0);
			const totalLosses = Math.abs(losses.reduce((sum, roi) => sum + roi, 0));
			const profitFactor = totalLosses > 0 ? totalProfits / totalLosses : totalProfits > 0 ? 999 : 0;
			
			return {
				type,
				count: data.count,
				percentage: calls.length > 0 ? (data.count / calls.length * 100).toFixed(1) : '0',
				averageROI: data.count > 0 ? (data.totalROI / data.count).toFixed(2) : '0',
				medianROI: medianROI.toFixed(2),
				profitFactor: profitFactor.toFixed(2),
				winRate: data.count > 0 ? (data.successfulCalls / data.count * 100).toFixed(1) : '0',
				totalVolume: data.totalVolume,
				averageVolume: data.count > 0 ? (data.totalVolume / data.count).toFixed(0) : '0'
			};
		})
		.sort((a, b) => b.count - a.count);
}

function calculateEnhancedLabelDistribution(calls: any[]) {
	const distribution = new Map<string, {
		count: number;
		successfulCalls: number;
		totalROI: number;
		totalVolume: number;
		bestToken: { symbol: string; roi: number } | null;
		worstToken: { symbol: string; roi: number } | null;
		tokens: Map<string, number[]>;
		priceDeltas: number[];
	}>();
	
	calls.forEach(call => {
		const label = call.sqdgnLabel || 'NO_LABEL';
		if (!distribution.has(label)) {
			distribution.set(label, {
				count: 0,
				successfulCalls: 0,
				totalROI: 0,
				totalVolume: 0,
				bestToken: null,
				worstToken: null,
				tokens: new Map(),
				priceDeltas: []
			});
		}
		
		const labelData = distribution.get(label)!;
		labelData.count++;
		
		// Performance calculations
		if (call.marketCap && call.currentMarketCap && call.marketCap > 0) {
			const roi = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
			labelData.totalROI += roi;
			labelData.priceDeltas.push(roi);
			if (roi > 0) labelData.successfulCalls++;
			
			// Track best and worst tokens for this label
			const tokenSymbol = call.tokenSymbol || 'Unknown';
			if (!labelData.tokens.has(tokenSymbol)) {
				labelData.tokens.set(tokenSymbol, []);
			}
			labelData.tokens.get(tokenSymbol)!.push(roi);
			
			if (!labelData.bestToken || roi > labelData.bestToken.roi) {
				labelData.bestToken = { symbol: tokenSymbol, roi };
			}
			if (!labelData.worstToken || roi < labelData.worstToken.roi) {
				labelData.worstToken = { symbol: tokenSymbol, roi };
			}
		}
		
		if (call.volume24h) {
			labelData.totalVolume += call.volume24h;
		}
	});
	
	return Array.from(distribution.entries())
		.map(([label, data]) => {
			// Calculate median ROI
			const sortedROIs = [...data.priceDeltas].sort((a, b) => a - b);
			const medianROI = sortedROIs.length > 0 
				? sortedROIs.length % 2 === 0
					? (sortedROIs[sortedROIs.length / 2 - 1] + sortedROIs[sortedROIs.length / 2]) / 2
					: sortedROIs[Math.floor(sortedROIs.length / 2)]
				: 0;
			
			// Calculate profit factor
			const profits = data.priceDeltas.filter(roi => roi > 0);
			const losses = data.priceDeltas.filter(roi => roi < 0);
			const totalProfits = profits.reduce((sum, roi) => sum + roi, 0);
			const totalLosses = Math.abs(losses.reduce((sum, roi) => sum + roi, 0));
			const profitFactor = totalLosses > 0 ? totalProfits / totalLosses : totalProfits > 0 ? 999 : 0;
			
			return {
				label,
				count: data.count,
				percentage: calls.length > 0 ? (data.count / calls.length * 100).toFixed(1) : '0',
				averageROI: data.count > 0 ? (data.totalROI / data.count).toFixed(2) : '0',
				medianROI: medianROI.toFixed(2),
				profitFactor: profitFactor.toFixed(2),
				winRate: data.count > 0 ? (data.successfulCalls / data.count * 100).toFixed(1) : '0',
				totalVolume: data.totalVolume,
				bestToken: data.bestToken,
				worstToken: data.worstToken
			};
		})
		.sort((a, b) => b.count - a.count);
}

function calculatePerformanceMetrics(calls: any[]) {
	const callsWithPriceData = calls.filter(call => 
		call.marketCap && call.currentMarketCap && call.marketCap > 0
	);
	
	if (callsWithPriceData.length === 0) {
		return {
			totalPnL: 0,
			averageROI: 0,
			medianROI: 0,
			profitFactor: 0,
			winRate: 0,
			successfulCalls: 0,
			averageHoldTime: 0
		};
	}
	
	let totalROI = 0;
	let successfulCalls = 0;
	let totalHoldTime = 0;
	let roiValues: number[] = [];
	
	callsWithPriceData.forEach(call => {
		const roi = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
		totalROI += roi;
		roiValues.push(roi);
		
		if (roi > 0) successfulCalls++;
		
		// Calculate hold time in hours
		const holdTime = (new Date().getTime() - new Date(call.createdAt).getTime()) / (1000 * 60 * 60);
		totalHoldTime += holdTime;
	});
	
	// Calculate median ROI
	const sortedROIs = [...roiValues].sort((a, b) => a - b);
	const medianROI = sortedROIs.length > 0 
		? sortedROIs.length % 2 === 0
			? (sortedROIs[sortedROIs.length / 2 - 1] + sortedROIs[sortedROIs.length / 2]) / 2
			: sortedROIs[Math.floor(sortedROIs.length / 2)]
		: 0;
	
	// Calculate profit factor
	const profits = roiValues.filter(roi => roi > 0);
	const losses = roiValues.filter(roi => roi < 0);
	const totalProfits = profits.reduce((sum, roi) => sum + roi, 0);
	const totalLosses = Math.abs(losses.reduce((sum, roi) => sum + roi, 0));
	const profitFactor = totalLosses > 0 ? totalProfits / totalLosses : totalProfits > 0 ? 999 : 0;
	
	const averageROI = totalROI / callsWithPriceData.length;
	const winRate = (successfulCalls / callsWithPriceData.length) * 100;
	const averageHoldTime = totalHoldTime / callsWithPriceData.length;
	
	return {
		totalPnL: totalROI,
		averageROI,
		medianROI,
		profitFactor,
		winRate,
		successfulCalls,
		averageHoldTime
	};
}

function getTopPerformers(calls: any[], limit: number) {
	return calls
		.filter(call => call.marketCap && call.currentMarketCap && call.marketCap > 0)
		.map(call => ({
			...call,
			roi: ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100,
			priceChange: null // Not available without initial price data
		}))
		.sort((a, b) => b.roi - a.roi)
		.slice(0, limit)
		.map(call => ({
			id: call.id,
			tokenSymbol: call.tokenSymbol,
			callType: call.callType,
			label: call.sqdgnLabel,
			roi: call.roi,
			priceChange: call.priceChange,
			entryPrice: null, // Not available without initial price data
			currentPrice: call.currentPriceUsd,
			entryMarketCap: call.marketCap,
			currentMarketCap: call.currentMarketCap,
			createdAt: call.createdAt,
			contractAddress: call.contractAddress
		}));
}

function getWorstPerformers(calls: any[], limit: number) {
	return calls
		.filter(call => call.marketCap && call.currentMarketCap && call.marketCap > 0)
		.map(call => ({
			...call,
			roi: ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100,
			priceChange: null // Not available without initial price data
		}))
		.sort((a, b) => a.roi - b.roi)
		.slice(0, limit)
		.map(call => ({
			id: call.id,
			tokenSymbol: call.tokenSymbol,
			callType: call.callType,
			label: call.sqdgnLabel,
			roi: call.roi,
			priceChange: call.priceChange,
			entryPrice: null, // Not available without initial price data
			currentPrice: call.currentPriceUsd,
			entryMarketCap: call.marketCap,
			currentMarketCap: call.currentMarketCap,
			createdAt: call.createdAt,
			contractAddress: call.contractAddress
		}));
}

function calculatePriceAnalysis(calls: any[]) {
	const callsWithCurrentPrices = calls.filter(call => call.currentPriceUsd);

	if (callsWithCurrentPrices.length === 0) {
		return {
			averageEntryPrice: 0,
			averageCurrentPrice: 0,
			averagePriceDelta: 0,
			totalPriceDelta: 0,
			positivePriceChanges: 0,
			negativePriceChanges: 0
		};
	}

	let totalCurrentPrice = 0;

	callsWithCurrentPrices.forEach(call => {
		totalCurrentPrice += call.currentPriceUsd;
	});

	return {
		averageEntryPrice: 0, // Not available without initial price data
		averageCurrentPrice: totalCurrentPrice / callsWithCurrentPrices.length,
		averagePriceDelta: 0, // Not available without initial price data
		totalPriceDelta: 0, // Not available without initial price data
		positivePriceChanges: 0, // Not available without initial price data
		negativePriceChanges: 0 // Not available without initial price data
	};
}

function calculateDetailedStats(calls: any[], days: number) {
	const now = new Date();
	const callsWithData = calls.filter(call => call.marketCap && call.currentMarketCap);
	
	// Most active day
	const dailyBreakdown = calculateEnhancedDailyBreakdown(calls, new Date(Date.now() - days * 24 * 60 * 60 * 1000), new Date());
	const mostActiveDay = dailyBreakdown.reduce((max, day) => day.count > max.count ? day : max, dailyBreakdown[0]);
	
	// Token statistics
	const tokenStats = new Map<string, { count: number; totalROI: number; avgROI: number }>();
	
	callsWithData.forEach(call => {
		const symbol = call.tokenSymbol || 'UNKNOWN';
		const roi = ((call.currentMarketCap - call.marketCap) / call.marketCap) * 100;
		
		if (!tokenStats.has(symbol)) {
			tokenStats.set(symbol, { count: 0, totalROI: 0, avgROI: 0 });
		}
		
		const stats = tokenStats.get(symbol)!;
		stats.count++;
		stats.totalROI += roi;
		stats.avgROI = stats.totalROI / stats.count;
	});
	
	// Best and worst tokens by average ROI
	const tokenArray = Array.from(tokenStats.entries()).map(([symbol, stats]) => ({ symbol, ...stats }));
	const bestToken = tokenArray.reduce((best, token) => token.avgROI > best.avgROI ? token : best, tokenArray[0]);
	const worstToken = tokenArray.reduce((worst, token) => token.avgROI < worst.avgROI ? token : worst, tokenArray[0]);
	
	// Volume statistics
	const totalVolume = calls.reduce((sum, call) => sum + (call.volume24h || 0), 0);
	const averageVolume = calls.length > 0 ? totalVolume / calls.length : 0;
	
	// Liquidity statistics
	const totalLiquidity = calls.reduce((sum, call) => sum + (call.liquidity || 0), 0);
	const averageLiquidity = calls.length > 0 ? totalLiquidity / calls.length : 0;
	
	return {
		callsPerDay: calls.length / days,
		mostActiveDay,
		bestToken,
		worstToken,
		uniqueTokens: tokenStats.size,
		totalVolume,
		averageVolume,
		totalLiquidity,
		averageLiquidity,
		oldestCall: calls.length > 0 ? calls[calls.length - 1]?.created_at : null,
		newestCall: calls.length > 0 ? calls[0]?.created_at : null
	};
}
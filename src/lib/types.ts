import type { Database } from './database.types';

export type Call = Database['public']['Tables']['calls']['Row'];
export type CallInsert = Database['public']['Tables']['calls']['Insert'];
export type CallUpdate = Database['public']['Tables']['calls']['Update'];

export type PerformanceMetric = Database['public']['Tables']['performance_metrics']['Row'];
export type PerformanceMetricInsert = Database['public']['Tables']['performance_metrics']['Insert'];

export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

export interface ParsedCall {
	tokenSymbol: string;
	signalType: 'BUY' | 'SELL' | 'HOLD' | 'LONG' | 'SHORT';
	entryPrice?: number;
	targetMultiplier?: number;
	riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
	confidence: number;
}

export interface TradingRule {
	id: string;
	name: string;
	description: string;
	conditions: {
		minConfidence?: number;
		maxRisk?: 'LOW' | 'MEDIUM' | 'HIGH';
		minMultiplier?: number;
		allowedSignals?: string[];
		excludedTokens?: string[];
	};
	actions: {
		simulate: boolean;
		positionSize?: number;
		stopLoss?: number;
		takeProfit?: number;
	};
	enabled: boolean;
}

export interface DashboardMetrics {
	totalCalls: number;
	validCalls: number;
	winRate: number;
	avgMultiplier: number;
	totalPnl: number;
	topTokens: Array<{
		symbol: string;
		count: number;
		winRate: number;
		avgMultiplier: number;
	}>;
}

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

export interface ROIInvestment {
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
}

export interface ROITimeframeOption {
	value: string;
	label: string;
	hours?: number;
}

// Trailing Stop Loss Simulation Types
export interface TrailingStopSimulationFilters {
	callTypes?: string[];
	labels?: string[];
	marketCapMin?: number;
	marketCapMax?: number;
	liquidityMin?: number;
	volumeMin?: number;
	startDate?: string;
	endDate?: string;
	includeTokens?: string[];
	excludeTokens?: string[];
}

export interface TrailingStopSimulationParams {
	trailingStopPercentages: number[];
	takeProfitMultiplier?: number;
	maxHoldDays?: number;
	slippage?: number; // basis points
	fees?: number; // basis points
	investmentAmount?: number; // dollars per trade
}

export interface TrailingStopSimulationRequest {
	filters?: TrailingStopSimulationFilters;
	simulation: TrailingStopSimulationParams;
	includeDetails?: boolean;
}

export interface PerformanceMetrics {
	winRate: number;
	medianROI: number;
	averageROI: number;
	profitFactor: number;
	percentiles: {
		p10: number;
		p25: number;
		p75: number;
		p90: number;
	};
	riskMetrics: {
		standardDeviation: number;
		maxROI: number;
		minROI: number;
		sharpeRatio: number;
		maxDrawdown: number;
	};
}

export interface ExitBreakdown {
	takeProfitExits: number;
	trailingStopExits: number;
	maxHoldExits: number;
	noExits: number;
}

export interface ImprovementMetrics {
	averageImprovement: number;
	winRateDelta: number;
	medianROIDelta: number;
	profitFactorDelta: number;
}

export interface ScenarioMetrics {
	portfolioValue1000: number;
	maxConsecutiveWins: number;
	maxConsecutiveLosses: number;
	recoveryRate: number;
	timeInMarket: number;
}

export interface TrailingStopScenarioResult {
	trailingStopPct: number;
	totalCalls: number;
	simulatedCalls: number;
	coverage: number;
	exitBreakdown: ExitBreakdown;
	simulated: PerformanceMetrics & {
		avgDaysToExit: number;
		avgDaysToPeak: number;
	};
	actual: PerformanceMetrics;
	improvement: ImprovementMetrics;
	totalFeesPaid: number;
	avgFeesPerTrade: number;
	totalPnL: number;
	scenarios: ScenarioMetrics;
}

export interface TrailingStopCallDetail {
	callId: string;
	tokenAddress: string;
	tokenSymbol: string;
	callType: string;
	sqdgnLabel: string;
	
	// Entry data
	entryTime: string;
	entryPrice: number;
	entryMarketCap: number;
	liquidity: number;
	volume24h: number;
	
	// Peak data
	peakPrice: number;
	peakTime: string;
	peakMultiple: number;
	daysToPeak: number;
	
	// Exit data
	exitPrice?: number;
	exitTime?: string;
	exitReason?: string;
	daysToExit?: number;
	
	// Performance
	simulatedROI?: number;
	actualROI: number;
	currentPrice: number;
	improvement?: number;
	feesPaid?: number;

	// Calculated metrics
	peakCapture?: number; // How much of the peak was captured
	exitFromEntry?: number; // Exit price multiple from entry
	dollarPnL?: number; // Dollar P&L assuming $1000 investment
}

export interface OptimalConfiguration {
	trailingStopPct: number;
	profitFactor: number;
	medianROI: number;
	winRate: number;
}

export interface SimulationOverview {
	totalCallsAnalyzed: number;
	callsWithPriceData: number;
	dataAvailabilityPct: number;
	filtersApplied: {
		callTypes: number;
		labels: number;
		marketCapRange: boolean;
		liquidityMin: number;
		volumeMin: number;
		dateRange: boolean;
		tokenFilters: number;
	};
}

export interface TrailingStopSimulationResponse {
	success: boolean;
	data?: {
		configuration: {
			filters: TrailingStopSimulationFilters;
			simulation: TrailingStopSimulationParams & {
				trailingStopPercentages: string[];
			};
		};
		overview: SimulationOverview;
		results: Record<string, TrailingStopScenarioResult>;
		optimal: OptimalConfiguration;
		details?: TrailingStopCallDetail[];
		meta: {
			generatedAt: string;
			detailsIncluded: boolean;
			detailsForStopPct?: number;
		};
	};
	error?: string;
}

export interface StrategyConfigurationPreset {
	id: string;
	name: string;
	description: string;
	filters: TrailingStopSimulationFilters;
	simulation: TrailingStopSimulationParams;
	createdAt: string;
	isDefault?: boolean;
}
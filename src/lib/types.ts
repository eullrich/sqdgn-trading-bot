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
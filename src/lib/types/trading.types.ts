import type { Database } from '$lib/database.types';

// Base database types
export type Call = Database['public']['Tables']['calls']['Row'];
export type TradingPosition = Database['public']['Tables']['trading_positions']['Row'];
export type UserTradingConfig = Database['public']['Tables']['user_trading_config']['Row'];
export type AutoBuyQueue = Database['public']['Tables']['auto_buy_queue']['Row'];
export type TradeHistory = Database['public']['Tables']['trade_history']['Row'];
export type TrailingStop = Database['public']['Tables']['trailing_stops']['Row'];

// Trading domain types
export interface TradingSignal {
	callId: string;
	tokenAddress: string;
	tokenSymbol: string;
	signalType: 'buy' | 'sell' | 'hold';
	confidence: number;
	metadata?: Record<string, unknown>;
}

export interface OrderRequest {
	userWalletAddress: string;
	tokenAddress: string;
	tokenSymbol: string;
	amountSol: number;
	slippageBps: number;
	orderType: 'buy' | 'sell';
}

export interface OrderResult {
	success: boolean;
	transactionId?: string;
	executedPrice?: number;
	tokenAmount?: number;
	error?: string;
}

export interface PositionUpdate {
	positionId: string;
	currentPrice: number;
	currentValueSol: number;
	pnlPercentage: number;
	shouldClose?: boolean;
	closeReason?: string;
}

export interface TrailingStopUpdate {
	stopId: string;
	newStopPrice: number;
	triggered: boolean;
}

export interface TradingMetrics {
	totalPositions: number;
	openPositions: number;
	totalPnL: number;
	winRate: number;
	averageHoldTime: number;
}

// Service interfaces
export interface ITradingService {
	processSignal(signal: TradingSignal): Promise<void>;
	executeOrder(request: OrderRequest): Promise<OrderResult>;
	getMetrics(walletAddress: string): Promise<TradingMetrics>;
}

export interface IPositionManager {
	openPosition(order: OrderRequest, result: OrderResult): Promise<TradingPosition>;
	closePosition(positionId: string, reason: string): Promise<void>;
	updatePosition(update: PositionUpdate): Promise<void>;
	getOpenPositions(walletAddress: string): Promise<TradingPosition[]>;
}

export interface ITrailingStopManager {
	createStop(positionId: string, percentage: number): Promise<void>;
	checkStops(): Promise<TrailingStopUpdate[]>;
	updateStop(update: TrailingStopUpdate): Promise<void>;
}
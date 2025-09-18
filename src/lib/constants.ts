export const SIGNAL_TYPES = {
	BUY: 'BUY',
	SELL: 'SELL',
	LONG: 'LONG',
	SHORT: 'SHORT',
	HOLD: 'HOLD'
} as const;

export const RISK_LEVELS = {
	LOW: 'LOW',
	MEDIUM: 'MEDIUM',
	HIGH: 'HIGH'
} as const;

export const OUTCOMES = {
	WIN: 'WIN',
	LOSS: 'LOSS',
	PENDING: 'PENDING',
	CANCELLED: 'CANCELLED'
} as const;

export const EVENT_TYPES = {
	CALL_CREATED: 'CALL_CREATED',
	CALL_UPDATED: 'CALL_UPDATED',
	PERFORMANCE_CALCULATED: 'PERFORMANCE_CALCULATED',
	BOT_DECISION: 'BOT_DECISION',
	BOT_EXECUTION: 'BOT_EXECUTION',
	USER_LOGIN: 'USER_LOGIN',
	PRICE_UPDATE: 'PRICE_UPDATE',
	ERROR: 'ERROR'
} as const;

export const ENTITY_TYPES = {
	CALL: 'CALL',
	PERFORMANCE_METRIC: 'PERFORMANCE_METRIC',
	BOT: 'BOT',
	USER: 'USER'
} as const;

export const DEFAULT_TRADING_RULES = {
	minConfidence: 0.7,
	maxRisk: RISK_LEVELS.MEDIUM,
	minMultiplier: 2.0,
	positionSize: 0.01,
	stopLoss: 0.1,
	takeProfit: 0.2
} as const;

// Testing wallet address - used when no wallet is connected or for testing purposes
export const TESTING_WALLET_ADDRESS = 'GDDRBoNEmEnBo1QG7TVhiNje1CZwu2wZ61py28W81e4Z';
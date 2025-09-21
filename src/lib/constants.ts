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

// Solana Network Configuration
export const SOLANA_NETWORKS = {
	MAINNET: 'mainnet-beta',
	DEVNET: 'devnet',
	TESTNET: 'testnet'
} as const;

// Network configuration
export const NETWORK_CONFIG = {
	[SOLANA_NETWORKS.MAINNET]: {
		rpcUrl: 'https://api.mainnet-beta.solana.com',
		jupiterBaseUrl: 'https://quote-api.jup.ag',
		name: 'Mainnet',
		displayName: 'MAINNET'
	},
	[SOLANA_NETWORKS.DEVNET]: {
		rpcUrl: 'https://api.devnet.solana.com',
		jupiterBaseUrl: 'https://quote-api.jup.ag', // Jupiter supports devnet
		name: 'Devnet',
		displayName: 'TESTNET'
	},
	[SOLANA_NETWORKS.TESTNET]: {
		rpcUrl: 'https://api.testnet.solana.com',
		jupiterBaseUrl: 'https://quote-api.jup.ag',
		name: 'Testnet',
		displayName: 'TESTNET'
	}
} as const;

// Get current network from environment variable
export const CURRENT_NETWORK = (process.env.SOLANA_NETWORK as keyof typeof SOLANA_NETWORKS) || SOLANA_NETWORKS.MAINNET;

// Get current network configuration
export const getCurrentNetworkConfig = () => NETWORK_CONFIG[CURRENT_NETWORK];

// Test token addresses for devnet
export const DEVNET_TOKENS = {
	SOL: 'So11111111111111111111111111111111111111112',
	USDC: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr', // Devnet USDC
	WSOL: 'So11111111111111111111111111111111111111112'
} as const;

// Test trading configurations for devnet
export const TESTNET_CONFIG = {
	defaultBuyAmount: 0.1, // SOL
	maxTestPosition: 1.0, // SOL
	testSlippageBps: 100, // 1%
	trailingStopPercentage: 10.0, // 10%
	testTokens: [
		{
			symbol: 'TESTCOIN',
			address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Example devnet token
			name: 'Test Coin'
		},
		{
			symbol: 'DEVTOKEN',
			address: 'DevtokenETH7yF7gBZKL8RNJYpjGJP3NW8zF1Cb6Ld5H', // Example devnet token
			name: 'Development Token'
		}
	]
} as const;

// Get network-specific token configuration
export const getNetworkTokens = () => {
	if (CURRENT_NETWORK === SOLANA_NETWORKS.DEVNET) {
		return TESTNET_CONFIG.testTokens;
	}
	return []; // For mainnet, tokens are discovered dynamically
};
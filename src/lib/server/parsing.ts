import type { ParsedCall } from '../types';
import { SIGNAL_TYPES, RISK_LEVELS } from '../constants';

export interface ParseResult {
	tokenSymbol: string;
	isValid: boolean;
	parseErrors: string[];
	callType?: string;
	contractAddress?: string;
	sqdgnLabel?: string;
	metadata?: {
		marketCap?: number;
		volume24h?: number;
		liquidity?: number;
		walletPnL?: number;
		tokenAge?: string;
		walletAddress?: string;
		transactionAmount?: number;
		solanaAddress?: string;
		tokenName?: string;
		label?: string;
		creationDate?: string;
		blockchain?: string;
		dexScreenerUrl?: string;
		jupiterUrl?: string;
		raydiumUrl?: string;
	};
}

export class CallParser {
	private static readonly TOKEN_PATTERN = /\$([A-Z0-9]{2,15})/gi;
	private static readonly SOLANA_ADDRESS_PATTERN = /([A-Za-z0-9]{32,})/g;
	
	// Call type patterns based on the 8 identified types
	private static readonly CALL_TYPE_PATTERNS = [
		{ pattern: /Market activity spotted.*keeping.*close eye/i, type: 'market_activity' },
		{ pattern: /Transaction spotted.*watching price movements/i, type: 'transaction_spotted' },
		{ pattern: /Large trade noticed.*observing immediate effects/i, type: 'large_trade' },
		{ pattern: /Tracked wallet activity detected.*monitoring market impact/i, type: 'wallet_activity' },
		{ pattern: /Significant transaction observed.*tracking reactions/i, type: 'significant_transaction' },
		{ pattern: /Wallet signal detected.*evaluating price shifts/i, type: 'wallet_signal' },
		{ pattern: /Smart money move noticed.*analyzing potential trends/i, type: 'smart_money' },
		{ pattern: /On-chain signal detected.*assessing implications/i, type: 'onchain_signal' }
	];
	private static readonly MARKET_CAP_PATTERN = /Market Cap[:\s]*\$(\d+(?:,\d{3})*(?:\.\d+)?)/i;
	private static readonly VOLUME_PATTERN = /Volume.*?\$(\d+(?:,\d{3})*(?:\.\d+)?)/i;
	private static readonly LIQUIDITY_PATTERN = /Liquidity[:\s]*\$(\d+(?:,\d{3})*(?:\.\d+)?)/i;
	private static readonly PNL_PATTERN = /PnL.*?(\d+(?:\.\d+)?)%/i;
	private static readonly QUANTITY_PATTERN = /bought\s+(\d+(?:,\d{3})*(?:\.\d+)?)\s+of/i;

	static parse(text: string): ParseResult {
		const result: ParseResult = {
			tokenSymbol: '',
			isValid: false,
			parseErrors: []
		};

		const errors: string[] = [];

		try {
			// Parse token symbol (look for $TOKEN pattern)
			this.TOKEN_PATTERN.lastIndex = 0; // Reset regex
			const tokenMatch = this.TOKEN_PATTERN.exec(text);
			if (tokenMatch) {
				result.tokenSymbol = tokenMatch[1].toUpperCase();
			} else {
				errors.push('No token symbol found');
			}

			// Parse call type from SQDGN format
			const callType = this.parseCallType(text);
			if (callType) {
				result.callType = callType;
			}

			// Additional data extraction for metadata
			const marketData = this.parseMarketData(text);
			const walletData = this.parseWalletData(text);
			const tokenInfo = this.parseTokenInfo(text);
			const links = this.parseLinks(text);
			const solanaAddress = this.parseSolanaAddress(text);

			// Set contract address at top level for data pipeline
			result.contractAddress = solanaAddress || undefined;

			// Set SQDGN label at top level for data pipeline
			result.sqdgnLabel = tokenInfo.label || undefined;

			// Store additional data in result for later use
			result.metadata = {
				marketCap: marketData.marketCap,
				volume24h: marketData.volume,
				liquidity: marketData.liquidity,
				walletPnL: walletData.pnl,
				tokenAge: this.parseTokenAge(text) || undefined,
				walletAddress: walletData.address || undefined,
				transactionAmount: this.parseTransactionAmount(text) || undefined,
				solanaAddress: solanaAddress || undefined,
				tokenName: tokenInfo.name,
				label: tokenInfo.label,
				creationDate: tokenInfo.creationDate,
				blockchain: tokenInfo.blockchain,
				dexScreenerUrl: links.dexScreener,
				jupiterUrl: links.jupiter,
				raydiumUrl: links.raydium
			};

			result.parseErrors = errors;
			result.isValid = result.tokenSymbol.length > 0;

			return result;

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown parsing error';
			errors.push(`Parsing error: ${errorMessage}`);
			result.parseErrors = errors;
			return result;
		}
	}

	// Parse call type from SQDGN messages
	private static parseCallType(text: string): string | null {
		for (const { pattern, type } of this.CALL_TYPE_PATTERNS) {
			if (pattern.test(text)) {
				return type;
			}
		}
		
		// Fallback patterns for shorter/simpler descriptions
		if (/market activity/i.test(text)) return 'market_activity';
		if (/transaction spotted/i.test(text)) return 'transaction_spotted';
		if (/large trade/i.test(text)) return 'large_trade';
		if (/wallet activity/i.test(text)) return 'wallet_activity';
		if (/significant transaction/i.test(text)) return 'significant_transaction';
		if (/wallet signal/i.test(text)) return 'wallet_signal';
		if (/smart money/i.test(text)) return 'smart_money';
		if (/on-chain signal/i.test(text)) return 'onchain_signal';
		
		return null;
	}

	// SQDGN-specific parsing methods

	private static parseMarketData(text: string): { marketCap?: number; volume?: number; liquidity?: number } {
		const result: any = {};

		const marketCapMatch = this.MARKET_CAP_PATTERN.exec(text);
		if (marketCapMatch) {
			result.marketCap = parseFloat(marketCapMatch[1].replace(/,/g, ''));
		}

		const volumeMatch = this.VOLUME_PATTERN.exec(text);
		if (volumeMatch) {
			result.volume = parseFloat(volumeMatch[1].replace(/,/g, ''));
		}

		const liquidityMatch = this.LIQUIDITY_PATTERN.exec(text);
		if (liquidityMatch) {
			result.liquidity = parseFloat(liquidityMatch[1].replace(/,/g, ''));
		}

		return result;
	}

	private static parseWalletData(text: string): { pnl?: number; address?: string } {
		const result: any = {};

		const pnlMatch = this.PNL_PATTERN.exec(text);
		if (pnlMatch) {
			result.pnl = parseFloat(pnlMatch[1]);
		}

		// Extract wallet address (shortened format like FNMvBk..EqUL)
		const walletMatch = text.match(/wallet\s+([A-Za-z0-9]+\.\.\.?[A-Za-z0-9]+)/i);
		if (walletMatch) {
			result.address = walletMatch[1];
		}

		return result;
	}

	private static parseTokenAge(text: string): string | null {
		// Parse from "Token (or pool) age: < 15 min – brand new – unpredictable moves ahead."
		const ageMatch = text.match(/Token \(or pool\) age:\s*([^–]+)/i);
		if (ageMatch) {
			return ageMatch[1].trim();
		}
		
		// Fallback to original pattern
		const fallbackMatch = text.match(/Token age:\s*(.+?)(?:\s*–|$)/i);
		return fallbackMatch ? fallbackMatch[1].trim() : null;
	}

	private static parseTransactionAmount(text: string): number | null {
		const amountMatch = this.QUANTITY_PATTERN.exec(text);
		if (amountMatch) {
			return parseFloat(amountMatch[1].replace(/,/g, ''));
		}
		return null;
	}

	private static parseSolanaAddress(text: string): string | null {
		const addressMatch = text.match(/`?([A-Za-z0-9]{32,})`?\s*\(SOLANA\)/);
		return addressMatch ? addressMatch[1] : null;
	}

	private static parseTokenInfo(text: string): { name?: string; label?: string; creationDate?: string; blockchain?: string } {
		const result: any = {};

		// Parse token name from first line (e.g., "🟣 Skin Machine - $SM (SOLANA)")
		const nameMatch = text.match(/🟣\s*(.+?)\s*-\s*\$[A-Z0-9]+/);
		if (nameMatch) {
			result.name = nameMatch[1].trim();
		}

		// Parse SQDGN label
		const labelMatch = text.match(/🟢\s*Label:\s*([A-Z_]+)/i);
		if (labelMatch) {
			result.label = labelMatch[1].trim();
		}

		// Parse creation date
		const creationMatch = text.match(/🟢\s*Creation date:\s*([\d-]+\s+[\d:]+)/i);
		if (creationMatch) {
			result.creationDate = creationMatch[1].trim();
		}

		// Parse blockchain
		const blockchainMatch = text.match(/\(([A-Z]+)\)$/m);
		if (blockchainMatch) {
			result.blockchain = blockchainMatch[1];
		}

		return result;
	}

	private static parseLinks(text: string): { dexScreener?: string; jupiter?: string; raydium?: string } {
		const result: any = {};

		// For now, these would be constructed based on token address
		// In a real implementation, you might extract actual URLs if provided
		const solanaAddress = this.parseSolanaAddress(text);
		
		if (solanaAddress) {
			// Construct standard DEX URLs
			result.dexScreener = `https://dexscreener.com/solana/${solanaAddress}`;
			result.jupiter = `https://jup.ag/swap/SOL-${solanaAddress}`;
			result.raydium = `https://raydium.io/swap/?inputCurrency=sol&outputCurrency=${solanaAddress}`;
		}

		return result;
	}



	static batchParse(messages: string[]): ParseResult[] {
		return messages.map(message => this.parse(message));
	}
}

// Example usage and test function
export function testParser() {
	const testMessages = [
		// SQDGN format example
		`🟣 Goatcoin - $GOAT (SOLANA)
├ 
GNHW5JetZmW85vAU35KyoDcYoSd3sNWtx5RPMTDJpump (SOLANA)
​└SIGNAL: Tracked wallet FNMvBk..EqUL bought 248550 of $GOAT for $3151.53

SQDGN Analysis:
🟢 Label: MATURING
🟢 Creation date: 2025-08-26 22:16:33
🟢 Wallet's PnL (last 2 weeks): 10.97%
🟡 Token age: 1–3 days – showing positive early momentum.

Large trade noticed – observing immediate effects.

📊 Token Stats
├ Market Cap: $11,234,651.00
├ Liquidity: $605,815.36
└ Volume (24h): $2,452,659.17`,

		// Traditional format examples
		"🚀 $PEPE - BUY at $0.0001 - Target: 5x - Low risk gem!",
		"$BTC LONG entry 65000 target 2.5x HIGH RISK",
		"New call: $ETH - Entry: $3200 - TP: 150% - Medium risk",
		"DEGEN PLAY: $SHIB 10x potential 🌙",
		"Hold your positions in $SOL",
		"Just bought some apples at the store" // Should not parse as valid
	];

	console.log('Testing Call Parser with SQDGN format:');
	testMessages.forEach((message, index) => {
		const result = CallParser.parse(message);
		console.log(`\nTest ${index + 1}:`);
		console.log('Input:', message.substring(0, 100) + (message.length > 100 ? '...' : ''));
		console.log('Token:', result.tokenSymbol);
		console.log('Call Type:', result.callType);
		console.log('Market Cap:', result.metadata?.marketCap);
		console.log('Volume:', result.metadata?.volume24h);
		console.log('PnL:', result.metadata?.walletPnL);
		console.log('Valid:', result.isValid);
		if (result.metadata) {
			console.log('Market Data:', {
				marketCap: result.metadata.marketCap,
				volume: result.metadata.volume24h,
				liquidity: result.metadata.liquidity,
				walletPnL: result.metadata.walletPnL
			});
		}
		if (result.parseErrors.length > 0) {
			console.log('Errors:', result.parseErrors);
		}
	});
}
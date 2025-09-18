import { callsRepo, priceRepo, logAuditEvent } from './database';
import { CallParser, type ParseResult } from './parsing';
import { getTradingService, TradingService } from './services/trading/TradingService';
import type { CallInsert, Call } from '../types';
import { EVENT_TYPES, ENTITY_TYPES } from '../constants';
import { getDexScreenerAPI } from './dex-screener';

export interface ProcessingResult {
	success: boolean;
	processed: number;
	created: number;
	updated: number;
	errors: Array<{
		messageId: string;
		error: string;
	}>;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	warnings: string[];
	confidence: number;
}

export class DataPipeline {

	/**
	 * Capture initial price snapshot for a new call from DexScreener
	 */
	static async captureInitialPriceSnapshot(callId: string, tokenAddress: string, tokenSymbol?: string) {
		try {
			console.log(`🔍 Capturing initial price snapshot for ${tokenSymbol || tokenAddress}`);

			const dexAPI = getDexScreenerAPI();
			const tokenData = await dexAPI.getTokenPrice(tokenAddress);

			if (!tokenData) {
				console.warn(`⚠️ No price data found for token ${tokenSymbol || tokenAddress}`);
				return null;
			}

			const token = tokenData;
			const now = new Date();

			try {
				await priceRepo.batchInsertSnapshots([{
					time: now,
					tokenAddress: tokenAddress,
					priceUsd: token.priceUsd || 0,
					priceNative: null,
					volume5m: null,
					volume1h: null,
					volume24h: token.volume24h || null,
					liquidityUsd: token.liquidity || null,
					marketCap: token.marketCap || null,
					priceChange5m: null,
					priceChange1h: token.priceChange1h || null,
					priceChange24h: token.priceChange24h || null,
					txnBuys5m: null,
					txnSells5m: null,
					dexId: token.dexId || null,
					pairAddress: token.pairAddress || null,
					source: 'dexscreener_initial'
				}]);

				console.log(`✅ Initial price snapshot captured for ${tokenSymbol || tokenAddress}: $${token.priceUsd}`);

				// Update the call with initial price and market cap data
				await callsRepo.update(callId, {
					currentPriceUsd: token.priceUsd,
					currentMarketCap: token.marketCap,
					marketCapUpdatedAt: now,
					priceUpdatedAt: now
				});

				// Log audit event
				await logAuditEvent(
					EVENT_TYPES.PRICE_UPDATE,
					ENTITY_TYPES.CALL,
					callId,
					{
						source: 'dexscreener_initial',
						price_usd: token.priceUsd,
						market_cap: token.marketCap,
						token_address: tokenAddress
					}
				);
			} catch (snapshotError) {
				console.error(`❌ Failed to insert initial price snapshot:`, snapshotError);
			}

			return token;
		} catch (error) {
			console.error(`💥 Error capturing initial price snapshot:`, error);
			return null;
		}
	}

	static async processMessages(messages: Array<{
		messageId: string;
		text: string;
		metadata?: any;
	}>): Promise<ProcessingResult> {
		const result: ProcessingResult = {
			success: true,
			processed: 0,
			created: 0,
			updated: 0,
			errors: []
		};

		console.log(`🔄 Processing ${messages.length} messages`);

		for (const message of messages) {
			try {
				result.processed++;

				const messageResult = await this.processSingleMessage(
					message.messageId,
					message.text,
					message.metadata
				);

				if (messageResult.success) {
					if (messageResult.action === 'created') {
						result.created++;
					} else if (messageResult.action === 'updated') {
						result.updated++;
					}
				} else {
					result.errors.push({
						messageId: message.messageId,
						error: messageResult.error || 'Unknown error'
					});
				}
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				console.error(`❌ Error processing message ${message.messageId}:`, errorMessage);

				result.errors.push({
					messageId: message.messageId,
					error: errorMessage
				});
				result.success = false;
			}
		}

		return result;
	}

	static async processSingleMessage(
		messageId: string,
		text: string,
		metadata?: any
	): Promise<{ success: boolean; action?: 'created' | 'updated' | 'skipped'; error?: string }> {

		// Check if message already exists
		const existingCall = await callsRepo.findByMessageId(messageId);

		// Parse the message
		const parseResult = CallParser.parse(text);

		// Validate the call
		const validation = this.validateCall(parseResult, text);

		// Build call data
		const callData = {
			messageId: messageId,
			rawMessage: text,
			messageTimestamp: metadata?.timestamp ? new Date(metadata.timestamp) : null,
			channel: metadata?.channelName || 'SQDGN_Solana_Direct', // Default to SQDGN if not provided
			tokenSymbol: parseResult.tokenSymbol,
			tokenName: parseResult.metadata?.tokenName,
			contractAddress: parseResult.contractAddress,
			blockchain: parseResult.metadata?.blockchain || 'solana',
			sqdgnLabel: parseResult.sqdgnLabel,
			callType: parseResult.callType,
			marketCap: parseResult.metadata?.marketCap,
			liquidity: parseResult.metadata?.liquidity,
			volume24h: parseResult.metadata?.volume24h,
			dexScreenerUrl: parseResult.metadata?.dexScreenerUrl,
			jupiterUrl: parseResult.metadata?.jupiterUrl,
			raydiumUrl: parseResult.metadata?.raydiumUrl,
			metadata: {
				...metadata,
				...parseResult.metadata,
				parse_errors: parseResult.parseErrors,
				validation_warnings: validation.warnings,
			},
			isValid: validation.isValid,
			parsedAt: new Date()
		};

		if (existingCall) {
			// Update existing call if confidence improved or data changed
			if (this.shouldUpdateCall(existingCall, callData)) {
				try {
					await callsRepo.update(existingCall.id, callData);

					await logAuditEvent(
						EVENT_TYPES.CALL_UPDATED,
						ENTITY_TYPES.CALL,
						messageId,
						{ confidence: parseResult.confidence, is_valid: validation.isValid }
					);

					return { success: true, action: 'updated' };
				} catch (error: any) {
					await logAuditEvent(
						EVENT_TYPES.ERROR,
						ENTITY_TYPES.CALL,
						messageId,
						{ error: error.message, action: 'update' }
					);
					return { success: false, error: error.message };
				}
			}

			return { success: true, action: 'skipped' };
		} else {
			// Create new call
			try {
				const data = await callsRepo.create(callData);

				await logAuditEvent(
					EVENT_TYPES.CALL_CREATED,
					ENTITY_TYPES.CALL,
					data.id,
					{ confidence: parseResult.confidence, is_valid: validation.isValid }
				);

				// Capture initial price snapshot if we have a contract address
				if (callData.contractAddress && validation.isValid) {
					// Do this in background to avoid blocking the main pipeline
					this.captureInitialPriceSnapshot(
						data.id,
						callData.contractAddress,
						callData.tokenSymbol
					).catch(error => {
						console.error('Failed to capture initial price snapshot:', error);
					});
				}

				// Process signal for auto-trading if valid
				if (validation.isValid && parseResult.tokenSymbol && callData.contractAddress) {
					try {
						const tradingService = getTradingService();
						const signal = TradingService.extractTokenFromCall(data as any);
						if (signal) {
							// Process signal in background to avoid blocking the pipeline
							tradingService.processSignal(signal).catch(error => {
								console.error('Failed to process trading signal:', error);
							});
						}
					} catch (error) {
						console.error('Error initializing trading service for signal processing:', error);
					}
				}

				return { success: true, action: 'created' };
			} catch (error: any) {
				await logAuditEvent(
					EVENT_TYPES.ERROR,
					ENTITY_TYPES.CALL,
					messageId,
					{ error: error.message, action: 'create' }
				);
				return { success: false, error: error.message };
			}
		}
	}

	static validateCall(parseResult: ParseResult, originalText: string): ValidationResult {
		const validation: ValidationResult = {
			isValid: true,
			errors: [],
			warnings: [],
			confidence: 1.0 // Simple binary validation now
		};

		// Basic validation - must have at least a token symbol
		if (!parseResult.tokenSymbol) {
			validation.isValid = false;
			validation.errors.push('No token symbol found');
		}

		// Warn if no contract address
		if (!parseResult.contractAddress) {
			validation.warnings.push('No contract address found');
		}

		// Warn if text is too short (likely spam or incomplete)
		if (originalText.length < 10) {
			validation.warnings.push('Message text is very short');
		}

		// Set confidence based on how much data we extracted
		const dataPoints = [
			parseResult.tokenSymbol,
			parseResult.contractAddress,
			parseResult.tokenName,
			parseResult.marketCap,
			parseResult.sqdgnLabel
		].filter(Boolean).length;

		validation.confidence = Math.min(dataPoints / 3, 1.0); // Normalize to max 1.0

		return validation;
	}

	static shouldUpdateCall(existingCall: any, newCallData: any): boolean {
		// Only update if we have more/better data
		if (!existingCall.contractAddress && newCallData.contractAddress) {
			return true;
		}

		if (!existingCall.tokenName && newCallData.tokenName) {
			return true;
		}

		if (!existingCall.marketCap && newCallData.marketCap) {
			return true;
		}

		return false;
	}

	/**
	 * Cleanup old invalid calls
	 */
	static async cleanupOldCalls(): Promise<void> {
		try {
			// For now, this is a placeholder since we don't have a direct delete method
			// In the future we could add a cleanup method to the repository
			console.log('Cleanup functionality would be implemented here');
		} catch (error) {
			console.error('Error cleaning up old calls:', error);
		}
	}
}

/**
 * Process a single message (exported function for Telegram monitor)
 */
export async function processMessage(message: {
	messageId: string;
	text: string;
	metadata?: any;
}): Promise<{ success: boolean; action?: string; error?: string }> {
	return DataPipeline.processSingleMessage(message.messageId, message.text, message.metadata);
}
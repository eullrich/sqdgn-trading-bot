import { supabaseAdmin, logAuditEvent } from './database';
import { CallParser, type ParseResult } from './parsing';
import type { CallInsert, Call } from '../types';
import { EVENT_TYPES, ENTITY_TYPES } from '../constants';

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

		for (const message of messages) {
			try {
				const processResult = await this.processSingleMessage(
					message.messageId,
					message.text,
					message.metadata
				);

				if (processResult.success) {
					if (processResult.action === 'created') {
						result.created++;
					} else if (processResult.action === 'updated') {
						result.updated++;
					}
				} else {
					result.errors.push({
						messageId: message.messageId,
						error: processResult.error || 'Unknown error'
					});
				}

				result.processed++;

			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
		const { data: existingCall } = await supabaseAdmin
			.from('calls')
			.select('*')
			.eq('message_id', messageId)
			.single();

		// Parse the message
		const parseResult = CallParser.parse(text);
		
		// Validate the parsed data
		const validation = this.validateCall(parseResult, text);

		// Prepare call data
		const callData: any = {
			message_id: messageId,
			raw_message: text,
			token_symbol: parseResult.tokenSymbol || null,
			is_valid: validation.isValid,
			call_type: parseResult.callType || null,
			// New dedicated columns
			token_name: parseResult.metadata?.tokenName || null,
			contract_address: parseResult.metadata?.solanaAddress || null,
			blockchain: parseResult.metadata?.blockchain || null,
			sqdgn_label: parseResult.metadata?.label || null,
			creation_date: parseResult.metadata?.creationDate ? new Date(parseResult.metadata.creationDate) : null,
			token_age: parseResult.metadata?.tokenAge || null,
			market_cap: parseResult.metadata?.marketCap || null,
			liquidity: parseResult.metadata?.liquidity || null,
			volume_24h: parseResult.metadata?.volume24h || null,
			dex_screener_url: parseResult.metadata?.dexScreenerUrl || null,
			jupiter_url: parseResult.metadata?.jupiterUrl || null,
			raydium_url: parseResult.metadata?.raydiumUrl || null,
			// Keep metadata for backwards compatibility and additional fields
			metadata: {
				...metadata,
				...parseResult.metadata, // Include parsed metadata fields
				parse_errors: parseResult.parseErrors,
				validation_warnings: validation.warnings,
				processed_at: new Date().toISOString()
			}
		};

		if (existingCall) {
			// Update existing call if confidence improved or data changed
			if (this.shouldUpdateCall(existingCall, callData)) {
				const { error } = await supabaseAdmin
					.from('calls')
					.update(callData as any)
					.eq('message_id', messageId);

				if (error) {
					await logAuditEvent(
						EVENT_TYPES.ERROR,
						ENTITY_TYPES.CALL,
						messageId,
						{ error: error.message, action: 'update' }
					);
					return { success: false, error: error.message };
				}

				await logAuditEvent(
					EVENT_TYPES.CALL_UPDATED,
					ENTITY_TYPES.CALL,
					messageId,
					{ confidence: parseResult.confidence, is_valid: validation.isValid }
				);

				return { success: true, action: 'updated' };
			}

			return { success: true, action: 'skipped' };
		} else {
			// Create new call
			const { error, data } = await supabaseAdmin
				.from('calls')
				.insert(callData as any)
				.select()
				.single();

			if (error) {
				await logAuditEvent(
					EVENT_TYPES.ERROR,
					ENTITY_TYPES.CALL,
					messageId,
					{ error: error.message, action: 'create' }
				);
				return { success: false, error: error.message };
			}

			await logAuditEvent(
				EVENT_TYPES.CALL_CREATED,
				ENTITY_TYPES.CALL,
				(data as any)?.id,
				{ confidence: parseResult.confidence, is_valid: validation.isValid }
			);

			return { success: true, action: 'created' };
		}
	}

	static validateCall(parseResult: ParseResult, originalText: string): ValidationResult {
		const validation: ValidationResult = {
			isValid: true,
			errors: [],
			warnings: [],
			confidence: 1.0 // Simple binary validation now
		};

		// Copy parsing errors
		validation.errors = [...parseResult.parseErrors];

		// Simple validation - just check if we have a token symbol
		if (!parseResult.tokenSymbol) {
			validation.errors.push('Token symbol is required');
			validation.isValid = false;
		} else if (parseResult.tokenSymbol.length < 2 || parseResult.tokenSymbol.length > 15) {
			validation.warnings.push('Token symbol length is unusual');
		}

		// Check for spam patterns
		if (this.isSpamMessage(originalText)) {
			validation.warnings.push('Message might be spam');
			validation.isValid = false;
		}

		// Check for common false positives
		if (this.isFalsePositive(originalText)) {
			validation.isValid = false;
			validation.errors.push('Detected as false positive');
		}

		return validation;
	}

	private static shouldUpdateCall(existingCall: Call, newData: CallInsert): boolean {
		// Update if previously invalid call became valid
		if (!existingCall.is_valid && newData.is_valid) {
			return true;
		}

		// Update if new data has more fields filled
		const existingFieldCount = [
			existingCall.token_symbol,
			existingCall.call_type,
			existingCall.sqdgn_label,
			existingCall.market_cap,
			existingCall.liquidity
		].filter(Boolean).length;

		const newFieldCount = [
			newData.token_symbol,
			newData.call_type,
			newData.sqdgn_label,
			newData.market_cap,
			newData.liquidity
		].filter(Boolean).length;

		return newFieldCount > existingFieldCount;
	}

	private static isSpamMessage(text: string): boolean {
		const spamPatterns = [
			/telegram\.me|t\.me/i,
			/join.*group|group.*join/i,
			/premium.*signal|signal.*premium/i,
			/\b(scam|fraud|fake)\b/i,
			/click.*here|here.*click/i,
			/\b(dm|pm).*me\b/i
		];

		return spamPatterns.some(pattern => pattern.test(text));
	}

	private static isFalsePositive(text: string): boolean {
		const falsePositivePatterns = [
			/\b(joke|kidding|lol|haha)\b/i,
			/\b(not.*financial.*advice|nfa)\b/i,
			/\b(paper.*trading|demo.*account)\b/i,
			/\b(what.*if|imagine.*if)\b/i,
			/\b(old.*call|past.*call)\b/i
		];

		return falsePositivePatterns.some(pattern => pattern.test(text));
	}

	// Batch processing for better performance
	static async batchProcessMessages(
		messages: Array<{ messageId: string; text: string; metadata?: any }>,
		batchSize: number = 10
	): Promise<ProcessingResult> {
		const totalResult: ProcessingResult = {
			success: true,
			processed: 0,
			created: 0,
			updated: 0,
			errors: []
		};

		// Process in batches to avoid overwhelming the database
		for (let i = 0; i < messages.length; i += batchSize) {
			const batch = messages.slice(i, i + batchSize);
			const batchResult = await this.processMessages(batch);

			// Combine results
			totalResult.processed += batchResult.processed;
			totalResult.created += batchResult.created;
			totalResult.updated += batchResult.updated;
			totalResult.errors.push(...batchResult.errors);

			if (!batchResult.success) {
				totalResult.success = false;
			}

			// Add small delay between batches to be gentle on the database
			if (i + batchSize < messages.length) {
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		}

		return totalResult;
	}

	// Cleanup old or invalid data
	static async cleanupData(daysOld: number = 30): Promise<{ deletedCalls: number; deletedLogs: number }> {
		const cutoffDate = new Date();
		cutoffDate.setDate(cutoffDate.getDate() - daysOld);

		// Delete old audit logs
		const { count: deletedLogs } = await supabaseAdmin
			.from('audit_logs')
			.delete({ count: 'exact' })
			.lt('created_at', cutoffDate.toISOString());

		// Delete old invalid calls with very low confidence
		const { count: deletedCalls } = await supabaseAdmin
			.from('calls')
			.delete({ count: 'exact' })
			.lt('created_at', cutoffDate.toISOString())
			.eq('is_valid', false)
			.lt('confidence', 0.2);

		await logAuditEvent(
			'DATA_CLEANUP',
			'SYSTEM',
			null,
			{
				deleted_calls: deletedCalls,
				deleted_logs: deletedLogs,
				cutoff_date: cutoffDate.toISOString()
			}
		);

		return {
			deletedCalls: deletedCalls || 0,
			deletedLogs: deletedLogs || 0
		};
	}
}

// Helper function for the telegram client
export async function processMessage(message: {
	message_id: string;
	raw_message: string;
	timestamp: Date;
}): Promise<void> {
	try {
		await DataPipeline.processSingleMessage(
			message.message_id,
			message.raw_message,
			{ timestamp: message.timestamp.toISOString() }
		);
	} catch (error) {
		console.error(`Failed to process message ${message.message_id}:`, error);
		throw error;
	}
}
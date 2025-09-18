import { supabaseAdmin, logAuditEvent } from './database';
import { CallParser, type ParseResult } from './parsing';
import { getTradingService, TradingService } from './services/trading/TradingService';
import type { CallInsert } from '../types';
import { EVENT_TYPES, ENTITY_TYPES } from '../constants';
import { DataPipeline } from './data-pipeline';

/**
 * Ultra-fast message processor that prioritizes immediate database insertion
 * All heavy operations (price fetching, trading signals) are queued as background jobs
 */
export class FastMessageProcessor {
	private static backgroundJobQueue: Array<() => Promise<void>> = [];
	private static isProcessingQueue = false;

	/**
	 * Process message with minimal delay - INSERT FIRST, enrich later
	 */
	static async processFast(
		messageId: string,
		text: string,
		metadata?: any
	): Promise<{ success: boolean; callId?: string; error?: string }> {
		console.log(`⚡ Fast processing message: ${messageId}`);
		const startTime = Date.now();

		try {
			// Check for duplicate
			const { data: existing } = await supabaseAdmin
				.from('calls')
				.select('id')
				.eq('message_id', messageId)
				.single();

			if (existing) {
				return { success: true, callId: existing.id };
			}

			// MINIMAL parsing - just extract basic info quickly
			const parseResult = CallParser.parse(text);
			const validation = DataPipeline.validateCall(parseResult, text);

			// Create basic call record IMMEDIATELY
			const callData: any = {
				message_id: messageId,
				raw_message: text,
				token_symbol: parseResult.tokenSymbol || null,
				is_valid: validation.isValid,
				call_type: parseResult.callType || null,
				message_timestamp: metadata?.timestamp ? new Date(metadata.timestamp) : null,
				contract_address: parseResult.metadata?.solanaAddress || null,
				created_at: new Date().toISOString(),
				// Minimal metadata for now
				metadata: {
					processed_at: new Date().toISOString(),
					fast_processed: true,
					parse_errors: parseResult.parseErrors
				}
			};

			// INSERT IMMEDIATELY - no delays
			const { error, data } = await supabaseAdmin
				.from('calls')
				.insert([callData])
				.select('id')
				.single();

			if (error) {
				console.error('❌ Fast insert failed:', error);
				return { success: false, error: error.message };
			}

			const callId = (data as any)?.id;
			const processingTime = Date.now() - startTime;
			console.log(`✅ Fast insert completed in ${processingTime}ms for call ${callId}`);

			// Queue background enrichment (don't await)
			this.queueBackgroundEnrichment(callId, callData, parseResult, validation);

			return { success: true, callId };

		} catch (error) {
			console.error('❌ Fast processing failed:', error);
			return { 
				success: false, 
				error: error instanceof Error ? error.message : 'Unknown error' 
			};
		}
	}

	/**
	 * Queue expensive operations for background processing
	 */
	private static queueBackgroundEnrichment(
		callId: string,
		callData: any,
		parseResult: ParseResult,
		validation: any
	): void {
		// Add background jobs to queue
		if (callData.contract_address && validation.isValid) {
			this.backgroundJobQueue.push(() => 
				DataPipeline.captureInitialPriceSnapshot(
					callId,
					callData.contract_address,
					callData.token_symbol
				)
			);
		}

		// Trading signal processing
		if (validation.isValid && parseResult.tokenSymbol && callData.contract_address) {
			this.backgroundJobQueue.push(() => {
				try {
					const tradingService = getTradingService();
					const signal = TradingService.extractTokenFromCall({ 
						...callData, 
						id: callId 
					} as any);
					if (signal) {
						return tradingService.processSignal(signal);
					}
				} catch (error) {
					console.error('Error in trading signal processing:', error);
				}
				return Promise.resolve();
			});
		}

		// Start processing queue if not already running
		this.processBackgroundQueue();
	}

	/**
	 * Process background jobs without blocking main pipeline
	 */
	private static async processBackgroundQueue(): Promise<void> {
		if (this.isProcessingQueue || this.backgroundJobQueue.length === 0) {
			return;
		}

		this.isProcessingQueue = true;

		while (this.backgroundJobQueue.length > 0) {
			const job = this.backgroundJobQueue.shift();
			if (job) {
				try {
					await job();
				} catch (error) {
					console.error('Background job failed:', error);
				}
			}
		}

		this.isProcessingQueue = false;
	}
}

/**
 * Fast helper function for telegram client
 */
export async function processFastMessage(message: {
	message_id: string;
	raw_message: string;
	timestamp: Date;
}): Promise<void> {
	const result = await FastMessageProcessor.processFast(
		message.message_id,
		message.raw_message,
		{ timestamp: message.timestamp.toISOString() }
	);

	if (!result.success) {
		console.error(`Fast processing failed for ${message.message_id}:`, result.error);
		throw new Error(result.error);
	}

	console.log(`⚡ Message ${message.message_id} inserted as call ${result.callId}`);
}
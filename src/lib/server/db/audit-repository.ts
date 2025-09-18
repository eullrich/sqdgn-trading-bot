import type { Prisma } from '@prisma/client';
import { db } from './index';

export class AuditRepository {
	/**
	 * Log an audit event
	 */
	async logEvent(
		eventType: string,
		entityType: string,
		details?: any,
		options?: {
			entityId?: string;
			userId?: string;
			ipAddress?: string;
			userAgent?: string;
		}
	) {
		return db.auditLog.create({
			data: {
				eventType,
				entityType,
				entityId: options?.entityId || null,
				userId: options?.userId || null,
				details: details || null,
				ipAddress: options?.ipAddress || null,
				userAgent: options?.userAgent || null,
			},
		});
	}

	/**
	 * Get audit logs with filtering
	 */
	async findLogs(options: {
		eventType?: string;
		entityType?: string;
		entityId?: string;
		userId?: string;
		startDate?: Date;
		endDate?: Date;
		orderBy?: Prisma.AuditLogOrderByWithRelationInput;
		take?: number;
		skip?: number;
	} = {}) {
		const { eventType, entityType, entityId, userId, startDate, endDate, ...restOptions } = options;

		return db.auditLog.findMany({
			where: {
				...(eventType && { eventType }),
				...(entityType && { entityType }),
				...(entityId && { entityId }),
				...(userId && { userId }),
				...(startDate && {
					createdAt: {
						gte: startDate,
						...(endDate && { lte: endDate }),
					},
				}),
			},
			...restOptions,
		});
	}

	/**
	 * Get recent audit logs
	 */
	async getRecentLogs(hoursBack: number = 24, limit: number = 100) {
		const since = new Date();
		since.setHours(since.getHours() - hoursBack);

		return db.auditLog.findMany({
			where: {
				createdAt: {
					gte: since,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
		});
	}

	/**
	 * Count audit logs by type
	 */
	async getEventTypeCounts(startDate?: Date, endDate?: Date) {
		return db.auditLog.groupBy({
			by: ['eventType'],
			where: {
				...(startDate && {
					createdAt: {
						gte: startDate,
						...(endDate && { lte: endDate }),
					},
				}),
			},
			_count: {
				eventType: true,
			},
			orderBy: {
				_count: {
					eventType: 'desc',
				},
			},
		});
	}

	/**
	 * Delete old audit logs (for cleanup)
	 */
	async deleteOldLogs(beforeDate: Date) {
		return db.auditLog.deleteMany({
			where: {
				createdAt: {
					lt: beforeDate,
				},
			},
		});
	}

	/**
	 * Get error logs
	 */
	async getErrorLogs(options: {
		startDate?: Date;
		endDate?: Date;
		take?: number;
		skip?: number;
	} = {}) {
		return this.findLogs({
			eventType: 'ERROR',
			orderBy: { createdAt: 'desc' },
			...options,
		});
	}

	/**
	 * Get user activity logs
	 */
	async getUserActivity(
		userId: string,
		options: {
			startDate?: Date;
			endDate?: Date;
			take?: number;
			skip?: number;
		} = {}
	) {
		return this.findLogs({
			userId,
			orderBy: { createdAt: 'desc' },
			...options,
		});
	}
}

// ===== INGESTION RUNS =====

export class IngestionRepository {
	/**
	 * Start a new ingestion run
	 */
	async startRun(dataType: string = 'candles') {
		return db.ingestionRun.create({
			data: {
				dataType,
				startedAt: new Date(),
			},
		});
	}

	/**
	 * Complete an ingestion run
	 */
	async completeRun(
		runId: string,
		result: {
			ok: boolean;
			tokensProcessed?: number;
			rowsInserted?: number;
			vendorRateStatus?: any;
			errorMessage?: string;
		}
	) {
		return db.ingestionRun.update({
			where: { runId },
			data: {
				endedAt: new Date(),
				ok: result.ok,
				tokensProcessed: result.tokensProcessed,
				rowsInserted: result.rowsInserted,
				vendorRateStatus: result.vendorRateStatus,
				errorMessage: result.errorMessage,
			},
		});
	}

	/**
	 * Get recent ingestion runs
	 */
	async getRecentRuns(limit: number = 20) {
		return db.ingestionRun.findMany({
			orderBy: { startedAt: 'desc' },
			take: limit,
		});
	}

	/**
	 * Get ingestion statistics
	 */
	async getIngestionStats(hoursBack: number = 24) {
		const since = new Date();
		since.setHours(since.getHours() - hoursBack);

		const runs = await db.ingestionRun.findMany({
			where: {
				startedAt: {
					gte: since,
				},
			},
		});

		const totalRuns = runs.length;
		const successfulRuns = runs.filter((r) => r.ok).length;
		const totalTokensProcessed = runs.reduce(
			(sum, r) => sum + (r.tokensProcessed || 0),
			0
		);
		const totalRowsInserted = runs.reduce(
			(sum, r) => sum + (r.rowsInserted || 0),
			0
		);

		return {
			totalRuns,
			successfulRuns,
			failureRate: totalRuns > 0 ? ((totalRuns - successfulRuns) / totalRuns) * 100 : 0,
			totalTokensProcessed,
			totalRowsInserted,
			avgTokensPerRun: totalRuns > 0 ? totalTokensProcessed / totalRuns : 0,
			avgRowsPerRun: totalRuns > 0 ? totalRowsInserted / totalRuns : 0,
		};
	}
}
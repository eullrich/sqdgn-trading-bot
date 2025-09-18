// New database service using Prisma ORM
import { db, auditRepo } from './db/repositories';

// Export the main database instance for direct queries
export { db };

// Export all repositories for organized data access
export {
	callsRepo,
	tradingRepo,
	priceRepo,
	auditRepo,
	ingestionRepo,
	getPrismaClient,
	disconnectDatabase,
	testConnection
} from './db/repositories';

/**
 * Log audit events using the new repository pattern
 */
export async function logAuditEvent(
	eventType: string,
	entityType: string,
	entityId?: string | null,
	details?: any,
	userId?: string
) {
	try {
		await auditRepo.logEvent(eventType, entityType, details, {
			entityId: entityId || undefined,
			userId: userId || undefined,
		});
	} catch (err) {
		console.error('Audit logging error:', err);
	}
}

// Legacy compatibility - export as supabaseAdmin for easier migration
export const supabaseAdmin = {
	// Provide a migration helper that throws helpful errors
	from: (table: string) => {
		throw new Error(`
			Migration Error: supabaseAdmin.from('${table}') is no longer supported.
			Please use the new repository pattern:

			- For calls: import { callsRepo } from '$lib/server/database'
			- For trading: import { tradingRepo } from '$lib/server/database'
			- For prices: import { priceRepo } from '$lib/server/database'
			- For audit logs: import { auditRepo } from '$lib/server/database'
			- For direct queries: import { db } from '$lib/server/database'
		`);
	}
};
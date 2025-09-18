import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
let prismaInstance: PrismaClient | null = null;

/**
 * Get or create a singleton Prisma client instance
 */
export function getPrismaClient(): PrismaClient {
	if (!prismaInstance) {
		prismaInstance = new PrismaClient({
			log: [
				{ level: 'error', emit: 'stdout' },
				{ level: 'warn', emit: 'stdout' },
				{ level: 'info', emit: 'stdout' },
			],
			datasources: {
				db: {
					url: process.env.DATABASE_URL,
				},
			},
		});

		// Handle graceful shutdown
		const cleanup = async () => {
			if (prismaInstance) {
				await prismaInstance.$disconnect();
				prismaInstance = null;
			}
		};

		process.on('SIGTERM', cleanup);
		process.on('SIGINT', cleanup);
		process.on('beforeExit', cleanup);
	}

	return prismaInstance;
}

/**
 * Disconnect from the database
 */
export async function disconnectDatabase(): Promise<void> {
	if (prismaInstance) {
		await prismaInstance.$disconnect();
		prismaInstance = null;
	}
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
	try {
		const client = getPrismaClient();
		await client.$queryRaw`SELECT 1`;
		return true;
	} catch (error) {
		console.error('Database connection test failed:', error);
		return false;
	}
}

// Export the client instance for direct use
export const db = getPrismaClient();
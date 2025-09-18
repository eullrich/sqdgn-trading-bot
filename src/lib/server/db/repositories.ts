// Export all repository instances for easy access
import { CallsRepository } from './calls-repository';
import { TradingRepository } from './trading-repository';
import { PriceRepository } from './price-repository';
import { AuditRepository, IngestionRepository } from './audit-repository';

// Create singleton instances
export const callsRepo = new CallsRepository();
export const tradingRepo = new TradingRepository();
export const priceRepo = new PriceRepository();
export const auditRepo = new AuditRepository();
export const ingestionRepo = new IngestionRepository();

// Export repository classes for direct instantiation if needed
export { CallsRepository, TradingRepository, PriceRepository, AuditRepository, IngestionRepository };

// Re-export database utilities
export { db, getPrismaClient, disconnectDatabase, testConnection } from './index';
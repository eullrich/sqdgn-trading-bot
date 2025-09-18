import { supabaseAdmin } from './database';
import type { Database } from '$lib/database.types';

// Helper types for better type inference
export type Tables = Database['public']['Tables'];
export type CallsTable = Tables['calls'];
export type CallsRow = CallsTable['Row'];
export type CallsInsert = CallsTable['Insert'];
export type CallsUpdate = CallsTable['Update'];

export type TradingPositionsTable = Tables['trading_positions'];
export type TradingPositionsRow = TradingPositionsTable['Row'];
export type TradingPositionsInsert = TradingPositionsTable['Insert'];
export type TradingPositionsUpdate = TradingPositionsTable['Update'];

export type UserTradingConfigTable = Tables['user_trading_config'];
export type UserTradingConfigRow = UserTradingConfigTable['Row'];
export type UserTradingConfigInsert = UserTradingConfigTable['Insert'];
export type UserTradingConfigUpdate = UserTradingConfigTable['Update'];

export type AutoBuyQueueTable = Tables['auto_buy_queue'];
export type AutoBuyQueueRow = AutoBuyQueueTable['Row'];
export type AutoBuyQueueInsert = AutoBuyQueueTable['Insert'];
export type AutoBuyQueueUpdate = AutoBuyQueueTable['Update'];

export type TradeHistoryTable = Tables['trade_history'];
export type TradeHistoryRow = TradeHistoryTable['Row'];
export type TradeHistoryInsert = TradeHistoryTable['Insert'];
export type TradeHistoryUpdate = TradeHistoryTable['Update'];

export type TrailingStopsTable = Tables['trailing_stops'];
export type TrailingStopsRow = TrailingStopsTable['Row'];
export type TrailingStopsInsert = TrailingStopsTable['Insert'];
export type TrailingStopsUpdate = TrailingStopsTable['Update'];

export type TokenPriceSnapshotsTable = Tables['token_price_snapshots_5m'];
export type TokenPriceSnapshotsRow = TokenPriceSnapshotsTable['Row'];
export type TokenPriceSnapshotsInsert = TokenPriceSnapshotsTable['Insert'];
export type TokenPriceSnapshotsUpdate = TokenPriceSnapshotsTable['Update'];

// Export typed supabase client for better type inference
export const db = supabaseAdmin;
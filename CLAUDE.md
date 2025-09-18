# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

**Development & Building:**
```bash
npm run dev          # Start development server on port 5173
npm run build        # Build for production
npm run preview      # Preview production build
npm start            # Start production server (node build)
npm run check        # Run type checking with svelte-check
npm run check:watch  # Run type checking in watch mode
```

**Database & Migrations:**
```bash
node scripts/run-migration.js                    # Run database migrations
node scripts/setup-telegram.js                   # Setup Telegram integration
node scripts/setup-telegram-interactive.js      # Interactive Telegram setup
node scripts/test-connection-only.js            # Test database connection
node scripts/test-telegram-simple.js            # Test Telegram connectivity
```

**API Testing:**
```bash
curl -X POST http://localhost:5173/api/prices/ingest           # Manual price snapshot trigger
curl -X POST http://localhost:5173/api/telegram/monitor/start  # Start Telegram monitoring
curl http://localhost:5173/api/analytics/metrics               # Get analytics data
```

## Architecture Overview

This is a **SvelteKit-based trading bot** that monitors and analyzes signals from the SQDGN Telegram channel. The application follows a **full-stack TypeScript architecture** with Supabase as the database and real-time backend, using DexScreener for automated price data collection.

### Core Components

**Frontend (SvelteKit):**
- `src/routes/+page.svelte` - Main dashboard with real-time metrics and analytics
- `src/routes/calls/` - Trading calls management interface  
- `src/routes/analytics/` - Analytics and performance dashboards
- `src/lib/components/` - Reusable Svelte components

**Backend Services (Refactored Architecture):**
- `src/lib/server/services/` - **Service layer architecture with dependency injection**
  - `telegram-monitor.ts` - Simplified Telegram monitoring with polling-based approach
  - `price-service.ts` - DexScreener integration without Edge function dependency
  - `analytics-service.ts` - Performance metrics and token analytics with caching
  - `cache-service.ts` - In-memory caching with TTL and automatic cleanup
  - `job-processor.ts` - Background job processing with retry logic and scheduling
- `src/lib/server/data-pipeline.ts` - Core message processing pipeline with validation and deduplication
- `src/lib/server/parsing.ts` - Signal parsing engine for token symbols, prices, and trading signals
- `src/lib/server/database.ts` - Supabase admin client and audit logging
- `src/lib/server/init.ts` - Server initialization and graceful shutdown handling

**API Routes (Updated):**
- `/api/calls/*` - CRUD operations for trading calls
- `/api/analytics/metrics` - Performance metrics and dashboard data with caching
- `/api/telegram/monitor/start` - Start/stop Telegram monitoring with simplified client
- `/api/prices/ingest` - Direct price data ingestion (no Edge function dependency)
- `/api/logs/*` - System logging and monitoring
- `/api/migrate/*` - Database migration endpoints

**Background Services:**
- **Job Processor** - Automated background tasks with retry logic:
  - Price ingestion every 5 minutes
  - Data cleanup (removes old invalid data) 
  - Analytics refresh for better performance
  - Telegram monitoring management

### Database Schema

**Core Tables:**
- `calls` - Raw and parsed trading signals with metadata, price tracking, and ROI calculations
- `token_price_snapshots_5m` - Time series price data from DexScreener with volume and liquidity metrics  
- `audit_logs` - System activity and error logging
- `performance_metrics` - Call outcome tracking and performance analysis

**Key Features:**
- Row Level Security policies for data protection
- **Performance optimized indexes** (added in migration 11_add_performance_indexes.sql)
- **Materialized views** for frequently accessed analytics (mv_token_stats)
- **Custom PostgreSQL functions** for performance calculations:
  - `get_call_performance(p_days)` - Calculates win rates and ROI metrics
  - `get_top_performers(p_limit, p_days)` - Returns best performing tokens
  - `refresh_token_stats()` - Updates materialized views

### Data Processing Pipeline

The system processes data through two main pipelines:

**1. Telegram Message Pipeline (Refactored):**
1. **Message Ingestion** - Simplified polling-based monitoring via `SimpleTelegramMonitor` service
2. **Signal Parsing** - Extract tokens, prices, signal types using regex patterns in `parsing.ts`
3. **Validation** - Business rule validation with confidence scoring in `data-pipeline.ts`
4. **Deduplication** - Intelligent conflict resolution for duplicate messages
5. **Storage** - Structured data storage in Supabase with audit logging and initial price capture

**2. Price Data Pipeline (Simplified):**
1. **Automated Collection** - Vercel cron job triggers `/api/prices/ingest` every 5 minutes
2. **Direct API Processing** - `PriceService` calls DexScreener API directly (no Edge functions)
3. **Rate Limited Requests** - Built-in rate limiting with token bucket algorithm (300 requests/minute)
4. **Caching Layer** - In-memory cache with TTL reduces API calls and improves response times
5. **Time Series Storage** - Price snapshots stored in `token_price_snapshots_5m` table with batch processing
6. **Background Jobs** - Job processor handles retry logic, data cleanup, and analytics refresh

### Signal Parsing Logic

The parser in `src/lib/server/parsing.ts` handles:
- Token symbol extraction (`$BTC`, `$ETH` patterns)
- Signal type detection (BUY, SELL, LONG, SHORT)
- Entry price and target multiplier extraction
- Risk level classification (LOW, MEDIUM, HIGH)
- Confidence scoring (0-1) based on pattern matches

### DexScreener Integration (Refactored)

**API Service:** `src/lib/server/services/price-service.ts`
- **Direct API integration** - No Edge function dependency, runs server-side
- **Advanced rate limiting** - Token bucket algorithm with request queuing
- **Built-in caching** - Reduces API calls with configurable TTL (5 minutes default)
- **Batch processing** - Handles multiple tokens efficiently with error recovery
- **Automatic retries** - Background job processor handles failed requests

**Data Structure:** `token_price_snapshots_5m` table stores:
- Price in USD and native token with timestamp
- Volume metrics (5m, 1h, 24h) for trading analysis
- Liquidity and market cap data for market analysis
- Buy/sell transaction counts for sentiment analysis
- Price change percentages for trend analysis
- DEX and pair information for tracking source

### Environment Configuration

Required environment variables in `.env.local`:
```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Telegram Configuration (for simplified monitoring)
TELEGRAM_API_ID=your_telegram_api_id
TELEGRAM_API_HASH=your_telegram_api_hash
SQDGN_CHANNEL_USERNAME=SQDGN_Solana_Direct

# Application Configuration
DATABASE_URL=your_supabase_database_url
CRON_SECRET=your_vercel_cron_secret
```

## Key Files & Their Purpose

- `src/lib/types.ts` - TypeScript type definitions for the entire application
- `src/lib/constants.ts` - Application constants and enums  
- `src/lib/database.types.ts` - Supabase database types (manually updated to match schema)
- `src/lib/utils.ts` - Utility functions for formatting and data processing
- `src/hooks.server.ts` - Server initialization with background services startup
- `supabase/migrations/*.sql` - Database schema migrations (run in numbered order, latest: 11_add_performance_indexes.sql)
- `vercel.json` - Vercel deployment configuration with cron job pointing to `/api/prices/ingest`

**Service Architecture Files:**
- `src/lib/server/services/` - Core service layer following dependency injection pattern
- `src/lib/server/init.ts` - Server initialization and graceful shutdown management

## Development Workflow

1. **Setup**: Configure environment variables in `.env.local` (see Environment Configuration above)
2. **Dependencies**: Run `npm install` to install all required packages
3. **Database**: Run migrations in order using `node scripts/run-migration.js`
4. **Development**: Use `npm run dev` for local development with hot reload
5. **Type Safety**: Run `npm run check` before commits to ensure type correctness
6. **Testing**: Use utility scripts in `/scripts/` to test specific functionality

**Important Notes:**
- Background services (job processor, caching) start automatically in development
- Telegram monitoring requires valid API credentials and session setup
- Price ingestion works independently of Telegram monitoring

## Deployment Notes

- **Target Platform**: Vercel with Node.js runtime (nodejs20.x)
- **Build Output**: Node.js server using `@sveltejs/adapter-node`
- **Production Server**: `npm run build && npm start` (serves on configured port)
- **Database**: Supabase with real-time subscriptions and optimized indexes
- **Cron Jobs**: Vercel cron triggers `/api/prices/ingest` every 5 minutes
- **No Edge Functions**: All functionality moved to server-side services
- **Environment**: All secrets must be configured in Vercel environment variables
- **Background Services**: Automatically start on server boot via `hooks.server.ts`

## Analytics Architecture (Enhanced)

**Service-Based Analytics:**
- `AnalyticsService` with built-in caching for performance metrics
- Market cap and price-based ROI calculations with confidence scoring
- Performance metrics broken down by token, call type, and SQDGN labels
- Win rate calculations and trend analysis with materialized views
- Real-time dashboard with filtering and caching capabilities

**Data Sources:**
- **Automated Price Ingestion** - 5-minute snapshots from DexScreener API
- **Historical Analysis** - Time series data with volume and liquidity metrics
- **Performance Tracking** - ROI calculations using initial vs current market cap
- **Materialized Views** - Pre-computed token statistics for fast queries

## Performance Considerations (Optimized)

**Database Performance:**
- **Comprehensive indexes** added for fast analytics queries (migration 11)
- **Materialized views** (`mv_token_stats`) for frequently accessed data  
- **Custom PostgreSQL functions** for complex performance calculations
- **Efficient time-based queries** on price snapshot data with proper indexing

**Application Performance:**
- **Multi-layer caching** - Service-level cache with TTL management
- **Background job processing** - Heavy tasks moved to job processor with retry logic
- **Rate limiting** - Advanced token bucket algorithm prevents API exhaustion
- **Batch processing** - Efficient handling of large message and price data volumes
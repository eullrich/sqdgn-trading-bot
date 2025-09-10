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

## Architecture Overview

This is a **SvelteKit-based trading bot** that monitors and analyzes signals from the SQDGN Telegram channel. The application follows a **full-stack TypeScript architecture** with Supabase as the database and real-time backend.

### Core Components

**Frontend (SvelteKit):**
- `src/routes/+page.svelte` - Main dashboard with real-time metrics
- `src/routes/calls/` - Trading calls management interface  
- `src/routes/analytics/` - Analytics and performance dashboards
- `src/lib/components/` - Reusable Svelte components

**Backend Services:**
- `src/lib/server/data-pipeline.ts` - Core message processing pipeline with validation, deduplication, and batch processing
- `src/lib/server/parsing.ts` - Signal parsing engine that extracts tokens, prices, and trading signals from text
- `src/lib/server/telegram-client.ts` - Telegram API integration for message ingestion
- `src/lib/server/database.ts` - Supabase admin client and database operations

**API Routes:**
- `/api/calls/*` - CRUD operations for trading calls
- `/api/analytics/*` - Performance metrics and dashboard data
- `/api/telegram/*` - Telegram message processing and channel management
- `/api/migrate/*` - Database migration endpoints

### Database Schema

**Core Tables:**
- `calls` - Raw and parsed trading signals with metadata
- `performance_metrics` - Outcome tracking and P&L calculations  
- `audit_logs` - System activity and error logging

**Key Features:**
- Row Level Security policies for data protection
- Optimized indexes for fast analytical queries
- Custom PostgreSQL functions for complex calculations
- Materialized views for performance analytics

### Data Processing Pipeline

The system processes Telegram messages through a sophisticated pipeline:

1. **Message Ingestion** - Real-time Telegram monitoring via `telegram-client.ts`
2. **Signal Parsing** - Extract tokens, prices, signal types using regex patterns in `parsing.ts`
3. **Validation** - Business rule validation with confidence scoring in `data-pipeline.ts`
4. **Deduplication** - Intelligent conflict resolution for duplicate messages
5. **Storage** - Structured data storage in Supabase with audit logging

### Signal Parsing Logic

The parser in `src/lib/server/parsing.ts` handles:
- Token symbol extraction (`$BTC`, `$ETH` patterns)
- Signal type detection (BUY, SELL, LONG, SHORT)
- Entry price and target multiplier extraction
- Risk level classification (LOW, MEDIUM, HIGH)
- Confidence scoring (0-1) based on pattern matches

### Environment Configuration

Required environment variables in `.env.local`:
```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_sqdgn_chat_id
DATABASE_URL=your_supabase_database_url
```

## Key Files & Their Purpose

- `src/lib/types.ts` - TypeScript type definitions for the entire application
- `src/lib/constants.ts` - Application constants and enums
- `src/lib/database.types.ts` - Generated Supabase database types
- `src/lib/supabase.ts` - Client-side Supabase configuration
- `supabase/migrations/*.sql` - Database schema migrations (run in numbered order)

## Development Workflow

1. **Setup**: Copy `.env.example` to `.env.local` and configure all required environment variables
2. **Database**: Run migrations in order using `node scripts/run-migration.js`
3. **Development**: Use `npm run dev` for local development with hot reload
4. **Type Safety**: Run `npm run check` before commits to ensure type correctness
5. **Testing**: Use utility scripts in `/scripts/` to test specific functionality

## Deployment Notes

- **Target Platform**: Local deployment with external internet access
- **Build Output**: Node.js server using `@sveltejs/adapter-node`
- **Production Server**: `npm run build && npm start` (serves on configured port)
- **Database**: Supabase with real-time subscriptions
- **Environment**: All secrets must be configured in `.env.local` or environment variables

## Performance Considerations

- Database queries use optimized indexes for fast analytics
- Real-time subscriptions minimize unnecessary polling
- Batch processing for large message volumes
- Materialized views for complex analytical queries
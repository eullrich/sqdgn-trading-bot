# SQDGN Trading Bot

A comprehensive web application that monitors, ingests, analyzes, and automates trading based on signals from the SQDGN early access Telegram channel. Built with SvelteKit, Supabase, and TypeScript.

## Features

- 🤖 **Automated Telegram Ingestion**: Real-time monitoring and parsing of trading signals
- 📊 **Advanced Analytics**: Performance metrics, win rates, and trend analysis
- 🎯 **Smart Signal Parsing**: AI-powered extraction of token symbols, prices, and targets
- 📈 **Interactive Dashboard**: Real-time visualizations and insights
- 🔒 **Secure & Scalable**: Built on Supabase with Row Level Security
- 📱 **Responsive Design**: Works perfectly on desktop and mobile

## Architecture

- **Frontend**: SvelteKit with TypeScript and Tailwind CSS
- **Backend**: Supabase PostgreSQL with Edge Functions
- **Real-time**: Supabase realtime subscriptions
- **Deployment**: Vercel-ready with auto-scaling

## Quick Start

### Prerequisites

- Node.js 18+ 
- Supabase account
- Telegram Bot Token (for channel access)

### 1. Environment Setup

Copy the environment variables:

```bash
cp .env.example .env.local
```

Fill in your Supabase and Telegram credentials in `.env.local`:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Telegram Configuration  
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_sqdgn_chat_id

# Application Configuration
DATABASE_URL=your_supabase_database_url
```

### 2. Database Setup

Run the database migrations in your Supabase SQL editor:

```bash
# Run these files in order:
# 1. supabase/migrations/01_initial_schema.sql
# 2. supabase/migrations/02_analytics_functions.sql
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Deploy Edge Function (Optional)

Deploy the Telegram ingestion function to Supabase:

```bash
# Using Supabase CLI
supabase functions deploy telegram-ingestion
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your dashboard.

## Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable Svelte components
│   ├── server/             # Server-side utilities
│   │   ├── database.ts     # Supabase admin client
│   │   ├── parsing.ts      # Signal parsing logic
│   │   └── data-pipeline.ts # Data processing pipeline
│   ├── utils/              # Utility functions
│   ├── types.ts            # TypeScript definitions
│   ├── constants.ts        # Application constants
│   └── supabase.ts         # Supabase client setup
├── routes/
│   ├── api/                # API endpoints
│   │   ├── calls/          # Calls CRUD operations
│   │   └── analytics/      # Analytics endpoints
│   ├── calls/              # Calls management page
│   ├── analytics/          # Analytics dashboard
│   └── +page.svelte        # Main dashboard
└── supabase/
    ├── functions/          # Edge Functions
    └── migrations/         # Database schemas
```

## API Endpoints

### Calls API

- `GET /api/calls` - List trading calls with filtering
- `GET /api/calls/[id]` - Get specific call details
- `PUT /api/calls/[id]` - Update call information
- `POST /api/calls` - Process new messages

### Analytics API

- `GET /api/analytics` - Get dashboard metrics and insights

## Key Features

### Signal Parsing

The system automatically parses Telegram messages for:

- Token symbols (e.g., $BTC, $ETH)
- Signal types (BUY, SELL, LONG, SHORT)
- Entry prices and target multipliers
- Risk levels (LOW, MEDIUM, HIGH)
- Confidence scoring (0-1)

### Data Pipeline

- **Validation**: Comprehensive validation with business rules
- **Deduplication**: Intelligent conflict resolution for duplicate messages
- **Error Handling**: Robust error handling with audit logging
- **Batch Processing**: Efficient processing of large message volumes

### Dashboard Features

- **Real-time Updates**: Live data with Supabase subscriptions
- **Performance Metrics**: Win rates, average multipliers, P&L tracking
- **Token Analysis**: Performance breakdown by individual tokens
- **Trend Visualization**: Historical performance trends
- **Advanced Filtering**: Filter calls by token, signal type, confidence, etc.

## Database Schema

### Core Tables

- **calls**: Raw and parsed trading signals
- **performance_metrics**: Outcome tracking and performance data
- **audit_logs**: System activity and error logging

### Key Features

- Optimized indexes for fast queries
- Row Level Security for data protection
- Materialized views for analytics performance
- Custom PostgreSQL functions for complex calculations

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform.

## Development

### Running Tests

```bash
npm run test
```

### Type Checking

```bash
npm run check
```

### Building for Production

```bash
npm run build
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security

- All sensitive data is stored securely in Supabase
- Row Level Security policies protect data access
- Environment variables for all secrets
- Input validation and sanitization throughout

## Performance

- Optimized database queries with proper indexing
- Efficient real-time subscriptions
- Lazy loading and pagination for large datasets
- Materialized views for complex analytics

## License

This project is private and proprietary. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## Support

For issues and questions, please create an issue in the repository or contact the development team.

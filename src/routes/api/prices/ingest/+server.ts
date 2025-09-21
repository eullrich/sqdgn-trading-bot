import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPriceService } from '$lib/server/services/price-service';

// Global flag to prevent concurrent ingestion
let isIngesting = false;
let lastIngestionTime = 0;
const MIN_INGESTION_INTERVAL = 3 * 60 * 1000; // 3 minutes minimum between runs

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Check for cron secret or allow manual trigger
    const authToken = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const userAgent = request.headers.get('user-agent');

    // Allow Vercel cron, authenticated requests, or local dev
    const isAuthorized =
      (cronSecret && authToken === `Bearer ${cronSecret}`) ||
      userAgent?.includes('vercel-cron') ||
      process.env.NODE_ENV === 'development';

    if (!isAuthorized) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent concurrent ingestion
    const now = Date.now();
    if (isIngesting) {
      console.log('⏸️ Price ingestion already in progress, skipping...');
      return json({
        success: true,
        skipped: true,
        reason: 'Already in progress',
        timestamp: new Date().toISOString()
      });
    }

    // Prevent too frequent calls
    if (now - lastIngestionTime < MIN_INGESTION_INTERVAL) {
      const remainingTime = MIN_INGESTION_INTERVAL - (now - lastIngestionTime);
      console.log(`⏸️ Price ingestion too frequent, skipping (${Math.round(remainingTime / 1000)}s remaining)...`);
      return json({
        success: true,
        skipped: true,
        reason: 'Too frequent',
        remainingCooldown: remainingTime,
        timestamp: new Date().toISOString()
      });
    }

    isIngesting = true;
    lastIngestionTime = now;

    console.log('🔄 Starting price snapshot ingestion...');

    const priceService = getPriceService();
    const result = await priceService.ingestPriceSnapshots();

    console.log(`✅ Ingestion complete: ${result.inserted} snapshots for ${result.tokens} tokens`);
    
    return json({
      success: true,
      timestamp: new Date().toISOString(),
      snapshotsInserted: result.inserted,
      errors: result.errors,
      tokensProcessed: result.tokens,
      duration: result.duration,
      skipped: result.skipped
    });

  } catch (error) {
    console.error('❌ Price ingestion error:', error);

    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    // Always reset the ingesting flag
    isIngesting = false;
  }
};

export const GET: RequestHandler = async ({ url }) => {
  try {
    const tokenAddress = url.searchParams.get('token');
    
    if (!tokenAddress) {
      return json({
        error: 'Token address required'
      }, { status: 400 });
    }

    const priceService = getPriceService();
    const snapshot = await priceService.fetchTokenPrice(tokenAddress);
    
    if (!snapshot) {
      return json({
        error: 'Failed to fetch price'
      }, { status: 404 });
    }
    
    return json({
      success: true,
      data: snapshot,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Price fetch error:', error);
    
    return json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};
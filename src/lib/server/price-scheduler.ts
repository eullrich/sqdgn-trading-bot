// Background price update scheduler for local development
let priceUpdateInterval: NodeJS.Timeout | null = null;

export function startPriceScheduler() {
  // Don't start multiple intervals
  if (priceUpdateInterval) {
    console.log('📊 Price scheduler already running');
    return;
  }

  console.log('📊 Starting price update scheduler (every 5 minutes)');

  // Run immediately on startup
  updatePrices();

  // Then run every 5 minutes (300000ms)
  priceUpdateInterval = setInterval(() => {
    updatePrices();
  }, 5 * 60 * 1000);
}

export function stopPriceScheduler() {
  if (priceUpdateInterval) {
    clearInterval(priceUpdateInterval);
    priceUpdateInterval = null;
    console.log('📊 Price scheduler stopped');
  }
}

async function updatePrices() {
  try {
    console.log('🔄 Running scheduled price update...');
    
    // Get the base URL for the current environment
    const baseUrl = process.env.ORIGIN || 'http://localhost:5174';
    
    const response = await fetch(`${baseUrl}/api/prices/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'local-scheduler'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Scheduled update completed: ${result.snapshotsInserted} snapshots, ${result.errors || 0} errors`);
    } else {
      console.error(`❌ Scheduled update failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Price scheduler error:', error);
  }
}
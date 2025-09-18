import { startJobProcessor } from './services/job-processor';
import { building } from '$app/environment';

// Initialize server services
export async function initializeServer() {
  // Don't start background services during build
  if (building) {
    console.log('⚠️ Skipping server initialization during build');
    return;
  }

  console.log('🚀 Initializing server services...');
  
  try {
    // Start the job processor for background tasks
    startJobProcessor();
    console.log('✅ Job processor started');

    // Start the trading service
    const { getTradingService } = await import('./services/trading/TradingService');
    const tradingService = getTradingService();
    tradingService.start();
    console.log('✅ Trading service started');

    // Add initial jobs
    const { getJobProcessor, JobType } = await import('./services/job-processor');
    const processor = getJobProcessor();

    // Schedule immediate price ingestion
    processor.addJob(JobType.PRICE_INGESTION);

    console.log('✅ Server services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize server services:', error);
  }
}

// Cleanup function for graceful shutdown
export async function cleanupServer() {
  console.log('🛑 Cleaning up server services...');
  
  try {
    // Stop job processor
    const { stopJobProcessor } = await import('./services/job-processor');
    stopJobProcessor();
    
    // Stop trading service
    try {
      const { getTradingService } = await import('./services/trading/TradingService');
      const tradingService = getTradingService();
      tradingService.stop();
      console.log('✅ Trading service stopped');
    } catch (tradingError) {
      console.warn('⚠️ Trading service not found or already stopped');
    }
    
    // Stop any active Telegram monitoring with improved cleanup
    try {
      const { resetTelegramMonitor, getTelegramMonitor } = await import('./services/telegram-monitor');
      
      // Try to get monitor instance (may not exist)
      let monitor = null;
      try {
        monitor = getTelegramMonitor();
      } catch (monitorNotFoundError) {
        console.log('📭 No active Telegram monitor found');
      }
      
      if (monitor) {
        console.log('🔌 Applying improved Telegram disconnect...');
        
        // Add timeout wrapper for entire cleanup process
        await Promise.race([
          (async () => {
            await monitor.stopMonitoring();
            await monitor.disconnect();
            console.log('✅ Telegram monitor cleanly disconnected');
          })(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Telegram cleanup timeout (30s)')), 30000)
          )
        ]);
      }
      
      resetTelegramMonitor();
      console.log('✅ Telegram monitor reset completed');
    } catch (telegramError) {
      console.warn('⚠️ Error stopping Telegram monitor:', telegramError);
      
      // Force reset even if there were errors
      try {
        const { resetTelegramMonitor } = await import('./services/telegram-monitor');
        resetTelegramMonitor();
        console.log('🔧 Forced Telegram monitor reset');
      } catch (resetError) {
        console.warn('⚠️ Failed to force reset Telegram monitor:', resetError);
      }
    }
    
    // Force cleanup any remaining Telegram connections
    try {
      // Give some time for connections to close
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Telegram cleanup completed');
    } catch (forceError) {
      console.warn('⚠️ Force cleanup error:', forceError);
    }
    
    // Stop cache service if it exists
    try {
      const { getCacheService } = await import('./services/cache-service');
      getCacheService().destroy();
    } catch (cacheError) {
      console.warn('⚠️ Cache service not found or already stopped');
    }
    
    console.log('✅ Server cleanup completed');
  } catch (error) {
    console.error('❌ Error during server cleanup:', error);
  }
}
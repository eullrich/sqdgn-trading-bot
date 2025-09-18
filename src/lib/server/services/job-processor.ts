import { getPriceService } from './price-service';
import { getTelegramMonitor } from './telegram-monitor';
import { callsRepo, priceRepo, auditRepo, logAuditEvent } from '../database';
import { EVENT_TYPES } from '../../constants';

export enum JobType {
  PRICE_INGESTION = 'price_ingestion',
  TELEGRAM_MONITORING = 'telegram_monitoring',
  DATA_CLEANUP = 'data_cleanup',
  ANALYTICS_REFRESH = 'analytics_refresh'
}

export interface Job {
  id: string;
  type: JobType;
  payload?: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export class JobProcessor {
  private jobs: Map<string, Job> = new Map();
  private timers: Map<JobType, NodeJS.Timeout> = new Map();
  private isRunning = false;
  private processingInterval: NodeJS.Timeout | null = null;

  start(): void {
    if (this.isRunning) {
      console.log('Job processor already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting job processor...');

    // Schedule recurring jobs
    this.scheduleRecurringJobs();

    // Start processing queue
    this.startProcessingLoop();
  }

  stop(): void {
    console.log('🛑 Stopping job processor...');
    this.isRunning = false;

    // Clear all timers
    for (const timer of this.timers.values()) {
      clearInterval(timer);
    }
    this.timers.clear();

    // Stop processing loop
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  addJob(type: JobType, payload?: any, options?: { maxAttempts?: number }): string {
    const job: Job = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      status: 'pending',
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      createdAt: new Date()
    };

    this.jobs.set(job.id, job);
    console.log(`📋 Added job ${job.id} of type ${type}`);
    
    return job.id;
  }

  getJob(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  getJobsByType(type: JobType): Job[] {
    return Array.from(this.jobs.values()).filter(job => job.type === type);
  }

  getJobStats(): {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    const jobs = Array.from(this.jobs.values());
    
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      processing: jobs.filter(j => j.status === 'processing').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length
    };
  }

  private scheduleRecurringJobs(): void {
    // Price ingestion every 5 minutes
    const priceTimer = setInterval(() => {
      this.addJob(JobType.PRICE_INGESTION);
    }, 5 * 60 * 1000);
    this.timers.set(JobType.PRICE_INGESTION, priceTimer);

    // Data cleanup daily
    const cleanupTimer = setInterval(() => {
      this.addJob(JobType.DATA_CLEANUP, { daysOld: 30 });
    }, 24 * 60 * 60 * 1000);
    this.timers.set(JobType.DATA_CLEANUP, cleanupTimer);

    // Analytics refresh every hour
    const analyticsTimer = setInterval(() => {
      this.addJob(JobType.ANALYTICS_REFRESH);
    }, 60 * 60 * 1000);
    this.timers.set(JobType.ANALYTICS_REFRESH, analyticsTimer);

    console.log('✅ Scheduled recurring jobs');
  }

  private startProcessingLoop(): void {
    this.processingInterval = setInterval(() => {
      this.processNextJob();
    }, 5000); // Check for jobs every 5 seconds
  }

  private async processNextJob(): Promise<void> {
    if (!this.isRunning) return;

    // Find next pending job
    const pendingJobs = Array.from(this.jobs.values())
      .filter(j => j.status === 'pending')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (pendingJobs.length === 0) return;

    const job = pendingJobs[0];
    
    // Mark as processing
    job.status = 'processing';
    job.startedAt = new Date();
    job.attempts++;

    console.log(`⚙️ Processing job ${job.id} (attempt ${job.attempts}/${job.maxAttempts})`);

    try {
      await this.executeJob(job);
      
      // Mark as completed
      job.status = 'completed';
      job.completedAt = new Date();
      
      console.log(`✅ Job ${job.id} completed successfully`);
      
      // Clean up old completed jobs
      this.cleanupCompletedJobs();
      
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      
      job.error = error instanceof Error ? error.message : 'Unknown error';
      
      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed';
        job.completedAt = new Date();
        
        // Log failure
        await logAuditEvent(
          EVENT_TYPES.ERROR,
          'JOB_PROCESSOR',
          job.id,
          { type: job.type, error: job.error }
        );
      } else {
        // Retry later
        job.status = 'pending';
        console.log(`🔄 Job ${job.id} will be retried`);
      }
    }
  }

  private async executeJob(job: Job): Promise<void> {
    switch (job.type) {
      case JobType.PRICE_INGESTION:
        await this.executePriceIngestion();
        break;
        
      case JobType.TELEGRAM_MONITORING:
        await this.executeTelegramMonitoring(job.payload);
        break;
        
      case JobType.DATA_CLEANUP:
        await this.executeDataCleanup(job.payload);
        break;
        
      case JobType.ANALYTICS_REFRESH:
        await this.executeAnalyticsRefresh();
        break;
        
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  private async executePriceIngestion(): Promise<void> {
    const priceService = getPriceService();
    const result = await priceService.ingestPriceSnapshots();
    
    console.log(`Price ingestion: ${result.inserted} snapshots, ${result.errors} errors`);
    
    if (result.errors > result.inserted) {
      throw new Error('Too many errors during price ingestion');
    }
  }

  private async executeTelegramMonitoring(payload?: any): Promise<void> {
    const { channel, sessionString } = payload || {};
    
    if (!sessionString) {
      throw new Error('No session string provided for Telegram monitoring');
    }

    const monitor = getTelegramMonitor();
    
    if (!monitor.getStatus().isConnected) {
      await monitor.connect();
    }
    
    await monitor.startMonitoring(channel);
  }

  private async executeDataCleanup(payload?: any): Promise<void> {
    const { daysOld = 30 } = payload || {};
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Clean old data using repository methods
    const deletedLogs = await auditRepo.deleteOldLogs(cutoffDate);
    const deletedCalls = await callsRepo.deleteOldInvalidCalls(cutoffDate);
    const deletedSnapshots = await priceRepo.deleteOldSnapshots(cutoffDate);

    console.log(`Cleanup: ${deletedCalls} calls, ${deletedLogs} logs, ${deletedSnapshots} snapshots`);
  }

  private async executeAnalyticsRefresh(): Promise<void> {
    // This could trigger analytics cache refresh or pre-compute metrics
    console.log('Analytics refresh triggered');
    
    // Get active tokens and update their latest prices
    const recentCalls = await callsRepo.findRecentCallsWithContracts(new Date(Date.now() - 24 * 60 * 60 * 1000));

    if (recentCalls && recentCalls.length > 0) {
      const uniqueAddresses = [...new Set(recentCalls.map(c => c.contractAddress).filter(Boolean))];
      const priceService = getPriceService();

      // Refresh prices for active tokens
      for (const address of uniqueAddresses) {
        if (address) {
          await priceService.fetchTokenPrice(address);
        }
      }
    }
  }

  private cleanupCompletedJobs(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    
    // Remove completed jobs older than 1 hour
    for (const [id, job] of this.jobs.entries()) {
      if (
        job.status === 'completed' && 
        job.completedAt && 
        job.completedAt.getTime() < oneHourAgo
      ) {
        this.jobs.delete(id);
      }
    }
  }
}

// Singleton instance
let jobProcessorInstance: JobProcessor | null = null;

export function getJobProcessor(): JobProcessor {
  if (!jobProcessorInstance) {
    jobProcessorInstance = new JobProcessor();
  }
  return jobProcessorInstance;
}

export function startJobProcessor(): void {
  const processor = getJobProcessor();
  processor.start();
}

export function stopJobProcessor(): void {
  const processor = getJobProcessor();
  processor.stop();
}
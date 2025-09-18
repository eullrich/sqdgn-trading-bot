import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
// import { NewMessage } from 'telegram/events'; // Not used in polling mode
import { Api } from 'telegram';
import { processMessage } from '../data-pipeline';

// Utility function to sleep for a specified number of milliseconds
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Utility function to add timeout to any promise
function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`${errorMessage} (timeout: ${timeoutMs}ms)`)), timeoutMs)
    )
  ]);
}

// Centralized safe teardown helper - encapsulates community-proven workarounds
async function safeDestroy(client: TelegramClient, context: string = 'unknown'): Promise<void> {
  console.log(`🔧 Starting safe teardown for ${context}...`);
  
  try {
    const clientAny = client as any;
    
    // Step 1: Gracefully signal that we're shutting down
    // WARNING: Accessing private property - remove when GramJS fixes the underlying issue
    if (clientAny._destroyed !== undefined) {
      clientAny._destroyed = true;
      console.log('🛑 Set internal destroyed flag (temporary workaround)');
    }
    
    // Step 2: Remove all event listeners to prevent new events
    try {
      if (clientAny.removeAllListeners) {
        clientAny.removeAllListeners();
        console.log('🧹 Removed all event listeners');
      }
    } catch (listenerError) {
      console.warn('⚠️ Error removing listeners:', listenerError);
    }
    
    // Step 3: Clear any pending timers/intervals
    try {
      if (clientAny._updateLoopHandle) {
        clearTimeout(clientAny._updateLoopHandle);
        clearInterval(clientAny._updateLoopHandle);
        clientAny._updateLoopHandle = null;
        console.log('⏰ Cleared update loop timers');
      }
    } catch (timerError) {
      console.warn('⚠️ Error clearing timers:', timerError);
    }
    
    // Step 4: Community-proven teardown sequence
    console.log('🔌 Executing disconnect with timeout...');
    await withTimeout(client.disconnect(), 30000, `Client disconnect timeout (${context})`);
    
    if (client.destroy) {
      console.log('💥 Executing destroy with timeout...');
      await withTimeout(client.destroy(), 15000, `Client destroy timeout (${context})`);
    }
    
    // Step 5: Community-proven cooldown period (PING_INTERVAL)
    console.log('⏳ Waiting for pending promises to resolve...');
    await sleep(9000);
    
    console.log(`✅ Safe teardown completed for ${context}`);
    
  } catch (error) {
    // Swallow "already closed" style errors but log others
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('closed') || errorMsg.includes('disconnect') || errorMsg.includes('destroyed')) {
      console.log(`📝 Expected teardown error (${context}): ${errorMsg}`);
    } else {
      console.warn(`⚠️ Unexpected teardown error (${context}):`, error);
    }
  }
}

// Lightweight client setup helper - applies minimal necessary configuration
function setupClientForPolling(client: TelegramClient, context: string = 'unknown'): void {
  console.log(`⚙️ Setting up client for pure polling (${context})...`);
  
  try {
    const clientAny = client as any;
    
    // Only apply essential overrides to prevent update loops
    // These are less invasive than the nuclear option
    if (clientAny._handleUpdate) {
      clientAny._handleUpdate = () => {
        // Silent no-op - we use manual polling instead
      };
    }
    
    console.log(`✅ Client configured for polling (${context})`);
  } catch (error) {
    console.warn(`⚠️ Error during client setup (${context}):`, error);
  }
}

interface MonitorConfig {
  apiId: number;
  apiHash: string;
  sessionString: string;
  channelUsername?: string;
  pollingInterval?: number;
}

interface MonitorStatus {
  isConnected: boolean;
  lastActivity: Date | null;
  messagesProcessed: number;
  errors: number;
  activeChannels: string[];
}

interface CachedChannel {
  entity: any;
  channelName: string;
  cachedAt: Date;
}

export class SimpleTelegramMonitor {
  private client: TelegramClient | null = null;
  private config: MonitorConfig;
  private status: MonitorStatus;
  private pollingTimers: Map<string, NodeJS.Timeout> = new Map();
  private isPolling = false;
  private lastMessageIds: Map<string, number> = new Map();
  private cachedChannels: Map<string, CachedChannel> = new Map();
  private activeChannels: Set<string> = new Set();
  private isClosing = false; // Prevent race conditions during teardown

  constructor(config: MonitorConfig) {
    this.config = {
      ...config,
      pollingInterval: config.pollingInterval || 60000 // Default 60 seconds (increased for efficiency)
    };
    
    this.status = {
      isConnected: false,
      lastActivity: null,
      messagesProcessed: 0,
      errors: 0,
      activeChannels: []
    };
  }

  async connect(): Promise<void> {
    // Guard against parallel operations during closing
    if (this.isClosing) {
      throw new Error('Cannot connect: monitor is shutting down');
    }
    
    try {
      if (this.client && this.status.isConnected) {
        console.log('✅ Already connected to Telegram');
        return;
      }

      const session = new StringSession(this.config.sessionString);
      
      this.client = new TelegramClient(
        session,
        this.config.apiId,
        this.config.apiHash,
        {
          connectionRetries: 3,
          retryDelay: 2000,
          timeout: 30000,
          requestRetries: 2,
          useWSS: false, // Use HTTP for better stability
          autoReconnect: false // We'll handle reconnection manually
        } as any
      );

      // Apply lightweight polling setup (replaces nuclear option)
      setupClientForPolling(this.client, 'monitor-connect');
      
      console.log('🔄 Connecting to Telegram with polling configuration...');
      await withTimeout(this.client.connect(), 45000, 'Telegram client connection timeout');
      
      // Reinforce polling setup post-connection
      setupClientForPolling(this.client, 'post-connect');
      
      this.status.isConnected = true;
      this.status.lastActivity = new Date();
      
      console.log('✅ Successfully connected to Telegram (pure polling mode)');
    } catch (error) {
      this.status.isConnected = false;
      console.error('❌ Failed to connect to Telegram:', error);
      throw error;
    }
  }

  async startMonitoring(channelUsernames?: string | string[]): Promise<void> {
    if (!this.client || !this.status.isConnected) {
      await this.connect();
    }

    // Handle both single channel and multiple channels
    const channels = Array.isArray(channelUsernames)
      ? channelUsernames
      : channelUsernames
        ? [channelUsernames]
        : this.config.channelUsername
          ? [this.config.channelUsername]
          : [];

    if (channels.length === 0) {
      throw new Error('No channel usernames provided');
    }

    // Start monitoring each channel
    for (const channel of channels) {
      if (!this.activeChannels.has(channel)) {
        this.activeChannels.add(channel);
        console.log(`🎯 Starting monitoring for channel: ${channel}`);
        this.startPolling(channel);
      } else {
        console.log(`⚠️ Channel ${channel} already being monitored`);
      }
    }

    // Update status
    this.status.activeChannels = Array.from(this.activeChannels);
  }

  private startPolling(channelUsername: string): void {
    // Check if already polling this specific channel
    if (this.pollingTimers.has(channelUsername)) {
      console.log(`⚠️ Already polling channel: ${channelUsername}`);
      return;
    }

    const poll = async () => {
      // Check if this channel is still active
      if (!this.activeChannels.has(channelUsername) || !this.client || !this.status.isConnected) {
        return;
      }

      try {
        // Guard against polling during shutdown
        if (this.isClosing) {
          console.log(`⚠️ Stopping polling for ${channelUsername}: monitor is closing`);
          return;
        }

        await this.fetchNewMessages(channelUsername);
        this.status.lastActivity = new Date();
      } catch (error) {
        console.error(`❌ Polling error for ${channelUsername}:`, error);
        this.status.errors++;

        // Simple reconnection on error (shared across all channels)
        if (this.status.errors > 3) {
          console.log('🔄 Too many errors, attempting reconnection...');
          await this.reconnect();
        }
      }

      // Schedule next poll if channel is still active
      if (this.activeChannels.has(channelUsername)) {
        const timer = setTimeout(poll, this.config.pollingInterval!);
        this.pollingTimers.set(channelUsername, timer);
      }
    };

    // Start polling
    poll();
    console.log(`📊 Polling started for ${channelUsername} (interval: ${this.config.pollingInterval}ms)`);
  }

  private async fetchNewMessages(channelUsername: string): Promise<void> {
    if (!this.client || this.isClosing) return;

    try {
      let channel;
      
      // Check if we have a cached channel that's still valid (< 5 minutes old)
      const cachedChannel = this.cachedChannels.get(channelUsername);
      if (cachedChannel &&
          (Date.now() - cachedChannel.cachedAt.getTime()) < 5 * 60 * 1000) {

        channel = cachedChannel.entity;
        console.log(`🎯 Using cached channel: ${(channel as any).title}`);
      } else {
        console.log(`🔍 Looking for channel: ${channelUsername}`);
        
        // Skip direct entity lookup and go straight to dialog search (which works)
        console.log('🔍 Using dialog search method (known to work)...');
        
        // Get all dialogs and search for exact matches
        const dialogs = await this.client.getDialogs({ limit: 100 });
        
        // Log available channels for debugging
        console.log('📺 Searching through dialogs, total count:', dialogs.length);
        const availableChannels = dialogs.map(d => {
          const entity = d.entity as any;
          if (!entity) return null;
          
          return {
            title: entity.title || 'No title',
            username: entity.username || 'No username', 
            type: entity.className || 'Unknown type'
          };
        }).filter(c => c !== null);
        
        console.log('📺 Available channels:', availableChannels);
        
        // Try exact match first (case insensitive)
        const searchTerm = channelUsername.toLowerCase().replace('@', '');
        console.log(`🔍 Searching for: "${searchTerm}"`);
        
        const exactMatch = dialogs.find(dialog => {
          const entity = dialog.entity as any;
          if (!entity) return false;
          
          const title = entity.title?.toLowerCase();
          const username = entity.username?.toLowerCase();
          
          console.log(`🔍 Checking: title="${title}" username="${username}"`);
          
          return title === searchTerm || username === searchTerm;
        });
        
        if (exactMatch) {
          channel = exactMatch.entity;
          const channelAny = channel as any;
          console.log(`✅ Found channel by exact match: "${channelAny.title}" (@${channelAny.username})`);
        } else {
          // If no exact match, provide helpful error with available options
          const channelList = availableChannels
            .map(c => `"${c.title}" (@${c.username})`)
            .join(', ');
          
          throw new Error(`Channel "${channelUsername}" not found. Available channels: ${channelList}`);
        }
        
        // Cache the resolved channel
        this.cachedChannels.set(channelUsername, {
          entity: channel,
          channelName: channelUsername,
          cachedAt: new Date()
        });
      }
      
      // Get last message ID for this specific channel
      const lastMessageId = this.lastMessageIds.get(channelUsername) || 0;

      // Fetch recent messages
      const messages = await this.client.getMessages(channel, {
        limit: 10,
        minId: lastMessageId
      });

      if (messages.length === 0) {
        console.log('📭 No new messages');
        return;
      }

      console.log(`📨 Found ${messages.length} new messages`);

      // Process messages in order (oldest first)
      for (const message of messages.reverse()) {
        if (message.id > lastMessageId && message.text) {
          try {
            // Extract channel ID properly from Telegram's Integer object
            const channelId = (channel as any).id?.value || (channel as any).id || 'unknown';
            const messageId = `${channelId}_${message.id}`;

            await processMessage({
              messageId,
              text: message.text,
              metadata: {
                timestamp: new Date(message.date * 1000),
                channelName: channelUsername
              }
            });

            this.status.messagesProcessed++;

            // Update last message ID for this specific channel
            const currentLastId = this.lastMessageIds.get(channelUsername) || 0;
            this.lastMessageIds.set(channelUsername, Math.max(currentLastId, message.id));

            console.log(`✅ Processed message ${message.id} from ${channelUsername}`);
          } catch (error) {
            console.error(`❌ Failed to process message ${message.id} from ${channelUsername}:`, error);
            this.status.errors++;
          }
        }
      }

      // Reset error count on successful fetch
      if (this.status.errors > 0) {
        this.status.errors = 0;
      }
    } catch (error) {
      console.error('❌ Failed to fetch messages:', error);
      throw error;
    }
  }

  async stopMonitoring(channelUsername?: string): Promise<void> {
    if (channelUsername) {
      // Stop monitoring specific channel
      return this.stopChannel(channelUsername);
    }

    // Stop monitoring all channels
    console.log('🛑 Stopping all monitoring...');

    // Clear all timers
    for (const [channel, timer] of this.pollingTimers) {
      clearTimeout(timer);
      console.log(`🛑 Stopped polling for ${channel}`);
    }
    this.pollingTimers.clear();

    // Clear all active channels
    this.activeChannels.clear();
    this.status.activeChannels = [];

    console.log('✅ All monitoring stopped');
  }

  async stopChannel(channelUsername: string): Promise<void> {
    console.log(`🛑 Stopping monitoring for channel: ${channelUsername}`);

    // Clear timer for this channel
    const timer = this.pollingTimers.get(channelUsername);
    if (timer) {
      clearTimeout(timer);
      this.pollingTimers.delete(channelUsername);
    }

    // Remove from active channels
    this.activeChannels.delete(channelUsername);
    this.status.activeChannels = Array.from(this.activeChannels);

    console.log(`✅ Stopped monitoring ${channelUsername}`);
  }

  async disconnect(): Promise<void> {
    // Set closing flag to prevent new operations
    this.isClosing = true;
    
    try {
      await this.stopMonitoring();
      
      if (this.client) {
        // Use hardened teardown helper
        await safeDestroy(this.client, 'monitor-disconnect');
      }

      // Clear all state
      this.client = null;
      this.cachedChannels.clear();
      this.lastMessageIds.clear();
      this.activeChannels.clear();
      this.pollingTimers.clear();
      this.status.isConnected = false;
      this.status.activeChannels = [];
      
    } finally {
      // Always clear the closing flag
      this.isClosing = false;
    }
  }

  private async reconnect(): Promise<void> {
    console.log('🔄 Reconnecting...');
    
    // Guard against reconnection during closing
    if (this.isClosing) {
      console.log('⚠️ Skipping reconnection: monitor is closing');
      return;
    }
    
    const currentChannels = Array.from(this.activeChannels);

    // Stop current monitoring
    await this.stopMonitoring();

    // Safely teardown current client
    if (this.client) {
      await safeDestroy(this.client, 'reconnect');
      this.client = null;
      this.status.isConnected = false;
    }

    // Wait before reconnecting
    await sleep(5000);

    // Guard again after sleep
    if (this.isClosing) {
      console.log('⚠️ Skipping reconnection: monitor closed during wait');
      return;
    }

    // Reconnect
    try {
      await this.connect();

      // Resume monitoring for all channels that were active
      if (currentChannels.length > 0) {
        await this.startMonitoring(currentChannels);
      }

      // Reset error count
      this.status.errors = 0;
    } catch (error) {
      console.error('❌ Reconnection failed:', error);
      // Will retry on next polling cycle
    }
  }

  getStatus(): MonitorStatus {
    return { ...this.status };
  }

  async fetchHistoricalMessages(channelUsername: string, limit: number = 100): Promise<number> {
    if (this.isClosing) {
      throw new Error('Cannot fetch historical messages: monitor is shutting down');
    }
    
    if (!this.client || !this.status.isConnected) {
      await this.connect();
    }

    try {
      console.log(`📥 Fetching ${limit} historical messages from ${channelUsername}`);
      
      if (!this.client) {
        throw new Error('Client not initialized');
      }
      
      const channel = await this.client.getEntity(channelUsername);
      const messages = await this.client.getMessages(channel, { limit });
      
      let processed = 0;
      
      // Process in chronological order
      for (const message of messages.reverse()) {
        if (message.text) {
          try {
            // Extract channel ID properly from Telegram's Integer object
            const channelId = (channel as any).id?.value || (channel as any).id || 'unknown';
            const messageId = `${channelId}_${message.id}`;

            await processMessage({
              messageId,
              text: message.text,
              metadata: {
                timestamp: new Date(message.date * 1000),
                channelName: channelUsername
              }
            });
            processed++;
          } catch (error) {
            console.error(`Failed to process historical message ${message.id}:`, error);
          }
        }
      }

      console.log(`✅ Processed ${processed} historical messages`);
      return processed;
    } catch (error) {
      console.error('❌ Failed to fetch historical messages:', error);
      throw error;
    }
  }

}

// Singleton instance management
let monitorInstance: SimpleTelegramMonitor | null = null;

export function getTelegramMonitor(config?: MonitorConfig): SimpleTelegramMonitor {
  if (!monitorInstance && config) {
    monitorInstance = new SimpleTelegramMonitor(config);
  } else if (!monitorInstance) {
    throw new Error('Telegram monitor not initialized. Provide config on first call.');
  }
  
  return monitorInstance;
}

export function resetTelegramMonitor(): void {
  if (monitorInstance) {
    monitorInstance.disconnect().catch(console.error);
    monitorInstance = null;
  }
}

// Add methods for getting available channels
export async function getAvailableChannels(): Promise<Array<{title: string, username: string}>> {
  const monitor = getTelegramMonitor();
  if (!monitor.getStatus().isConnected) {
    throw new Error('Monitor not connected');
  }

  // This would need to be implemented in the monitor class
  // For now, return empty array
  return [];
}
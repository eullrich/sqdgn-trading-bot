import pkg from 'telegram';
import { StringSession } from 'telegram/sessions';
import events from 'telegram/events';

const { TelegramClient: TelegramApiClient } = pkg;
const { NewMessage } = events;
import { processMessage } from './data-pipeline';
import { processFastMessage } from './fast-message-processor';
import { isFastProcessingEnabled } from './processing-mode';
// import type { Message } from 'telegram/tl/custom/message';

class TelegramClient {
    private client: any | null = null;
    private session: StringSession;
    private isConnected = false;
    private monitoringChannels: string[] = [];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 10000; // 10 seconds (slower to prevent rapid cycling)
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private circuitBreakerFailures = 0;
    private circuitBreakerThreshold = 3;
    private circuitBreakerResetTime = 120000; // 2 minutes for timeout patterns
    private isCircuitBreakerOpen = false;
    private lastTimeoutTime = 0;
    private rapidTimeoutCount = 0;
    private connectionRefreshInterval: NodeJS.Timeout | null = null;
    private lastSuccessfulOperation = Date.now();
    private pollingFallbackActive = false;
    private pollingInterval: NodeJS.Timeout | null = null;
    private streamingHealthy = true;
    private consecutiveStreamFailures = 0;

    constructor() {
        // Initialize with empty session - will be set when connecting
        this.session = new StringSession('');
    }

    async connect(): Promise<void> {
        if (this.isConnected) return;

        const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
        const apiHash = process.env.TELEGRAM_API_HASH || '';
        const phoneNumber = process.env.TELEGRAM_PHONE_NUMBER || '';

        if (!apiId || !apiHash || !phoneNumber) {
            throw new Error('Missing Telegram API credentials in environment variables');
        }

        this.client = new TelegramApiClient(this.session, apiId, apiHash, {
            connectionRetries: 5,
            retryDelay: 2000,
            timeout: 90,           // Increased timeout for 2.25.x stability
            requestRetries: 3,
            floodSleepThreshold: 300,
            useIPV6: false,
            autoReconnect: false,  // Keep our own reconnect logic
            // Switch to WebSocket for better idle tolerance 
            useWSS: true,          // Use WebSocket - better for persistent idle connections
            // Connection optimization
            maxConcurrentDownloads: 1,
        });

        console.log('Connecting to Telegram...');
        await this.client.start({
            phoneNumber: async () => phoneNumber,
            password: async () => {
                // If you have 2FA enabled, you'll need to provide password
                return process.env.TELEGRAM_PASSWORD || '';
            },
            phoneCode: async () => {
                // In production, you'd need a way to input the verification code
                // For now, this will need manual intervention
                throw new Error('Phone verification required - run setup script first');
            },
            onError: (err: any) => console.error('Telegram client error:', err),
        });

        console.log('Successfully connected to Telegram');
        console.log('Session string:', this.client.session.save());
        
        this.isConnected = true;
    }

    async connectWithSession(sessionString: string, apiId?: number, apiHash?: string): Promise<void> {
        if (this.isConnected) return;

        // Validate session string before attempting connection
        if (!sessionString || sessionString.trim() === '') {
            throw new Error('Cannot connect: Empty or invalid session string provided');
        }

        // Use passed credentials first, then fall back to environment
        const telegramApiId = apiId || parseInt(process.env.TELEGRAM_API_ID || '0');
        const telegramApiHash = apiHash || process.env.TELEGRAM_API_HASH || '';

        if (!telegramApiId || !telegramApiHash) {
            throw new Error('Missing Telegram API credentials in environment variables');
        }

        console.log('🔑 Session validation passed, proceeding with connection...');

        // Create session from stored string
        this.session = new StringSession(sessionString);
        this.client = new TelegramApiClient(this.session, telegramApiId, telegramApiHash, {
            connectionRetries: 5,
            retryDelay: 2000,
            timeout: 90,           // Increased timeout for 2.25.x stability
            requestRetries: 3,
            floodSleepThreshold: 300,
            useIPV6: false,
            autoReconnect: false,  // Keep our own reconnect logic
            // Switch to WebSocket for better idle tolerance 
            useWSS: true,          // Use WebSocket - better for persistent idle connections
            // Connection optimization
            maxConcurrentDownloads: 1,
        });

        console.log('Connecting to Telegram with stored session...');
        await this.client.connect();

        console.log('Successfully connected to Telegram with session');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Set up error handlers
        this.setupErrorHandlers();
        
        // Start passive connection monitoring with destroy() fix
        this.startPassiveMonitoring();
        
        // Start periodic connection refresh
        this.startConnectionRefresh();
    }

    async startListening(channelUsername?: string): Promise<void> {
        if (!this.client) {
            throw new Error('Client not connected. Call connect() first.');
        }

        const channel = channelUsername || process.env.SQDGN_CHANNEL_USERNAME;
        if (!channel) {
            throw new Error('Channel username not provided and SQDGN_CHANNEL_USERNAME not set in environment variables');
        }

        console.log(`Starting to listen for messages in ${channel}...`);

        // Get the channel entity
        const channelEntity = await this.client.getEntity(channel);

        // Add event handler for new messages
        this.client.addEventHandler(async (event: any) => {
            const message = event.message;
            
            // Only process messages from the target channel
            if (message.chatId?.toString() === channelEntity.id.toString()) {
                console.log(`New message received: ${message.text?.substring(0, 100)}...`);
                
                try {
                    const messageData = {
                        message_id: message.id.toString(),
                        raw_message: message.text || '',
                        timestamp: new Date(message.date * 1000),
                    };

                    if (isFastProcessingEnabled()) {
                        // Use fast processor for immediate DB insertion
                        await processFastMessage(messageData);
                    } else {
                        // Use normal processor with sequential processing
                        await processMessage(messageData);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        }, new NewMessage({}));

        console.log('Event handler added. Listening for messages...');
    }

    async startListeningToChannels(channelData: any[]): Promise<void> {
        if (!this.client) {
            throw new Error('Client not connected. Call connectWithSession() first.');
        }

        try {
            this.monitoringChannels = channelData.map(c => c.id);
            console.log(`Starting to listen for messages in ${channelData.length} channels...`);

            // Get channel entities using stored ID and accessHash
            const channels: any[] = [];
            for (const channelInfo of channelData) {
                try {
                console.log(`🔍 Attempting to connect to channel: ${channelInfo.title} (ID: ${channelInfo.id}, AccessHash: ${channelInfo.accessHash})`);
                
                let channel;
                
                if (channelInfo.accessHash) {
                    // Use both ID and accessHash to create proper peer
                    const channelId = parseInt(channelInfo.id);
                    const accessHash = BigInt(channelInfo.accessHash);
                    
                    // Create channel peer with ID and accessHash
                    const { Api } = await import('telegram');
                    const channelPeer = new Api.InputPeerChannel({
                        channelId: channelId,
                        accessHash: accessHash
                    });
                    
                    channel = await this.client.getEntity(channelPeer);
                } else {
                    // Fallback to username if available
                    if (channelInfo.username) {
                        channel = await this.client.getEntity(channelInfo.username);
                    } else {
                        throw new Error('No accessHash or username available');
                    }
                }
                
                channels.push(channel);
                console.log(`✅ Connected to channel: ${channel.title || channelInfo.title}`);
            } catch (error) {
                console.error(`❌ Failed to connect to channel ${channelInfo.title} (${channelInfo.id}):`, error);
                if (error instanceof Error) {
                    console.error('Error details:', error.message);
                    console.error('Error stack:', error.stack);
                }
            }
        }

        if (channels.length === 0) {
            throw new Error('No channels could be connected to');
        }

        // Add event handler with proper destroy() error handling
        this.client.addEventHandler(async (event: any) => {
            try {
                const message = event.message;
                console.log(`🔍 Event received - Message ID: ${message?.id}, Chat ID: ${message?.chatId}, Has text: ${!!message?.text}`);
                
                if (!message || !message.text) {
                    console.log('⚠️ Skipping event - no message or text content');
                    return;
                }
                
                // Check if message is from one of our monitored channels
                const messageChannelId = message.chatId?.toString();
                
                // Convert between Telegram ID formats:
                // Channel ID: 2300324200 -> Chat ID: -1002300324200 (add -100 prefix)
                // Chat ID: -1002300324200 -> Channel ID: 2300324200 (remove -100 prefix)
                const convertChatIdToChannelId = (chatId: string) => {
                    if (chatId.startsWith('-100')) {
                        return chatId.replace('-100', '');
                    }
                    return chatId;
                };
                
                const convertChannelIdToChatId = (channelId: string) => {
                    if (!channelId.startsWith('-100')) {
                        return `-100${channelId}`;
                    }
                    return channelId;
                };
                
                const messageChanId = convertChatIdToChannelId(messageChannelId || '');
                console.log(`🔍 Message from Chat ID: ${messageChannelId} -> Channel ID: ${messageChanId}`);
                console.log(`📋 Monitoring Channel IDs: ${this.monitoringChannels.join(', ')}`);
                
                // Check if this message is from one of our monitored channels
                const isFromMonitoredChannel = this.monitoringChannels.includes(messageChanId);
                console.log(`✅ Is from monitored channel: ${isFromMonitoredChannel}`);
                
                if (isFromMonitoredChannel) {
                    const channelName = channels.find(c => c.id.toString() === messageChannelId)?.title || messageChannelId;
                    console.log(`📨 Processing new message from ${channelName}: ${message.text.substring(0, 100)}...`);
                    
                    try {
                        // Process message directly with local data pipeline
                        console.log(`⚡ Processing message ${message.id} locally...`);
                        const messageData = {
                            message_id: `${messageChannelId}_${message.id}`,
                            raw_message: message.text,
                            timestamp: new Date(message.date * 1000),
                        };

                        if (isFastProcessingEnabled()) {
                            await processFastMessage(messageData);
                        } else {
                            await processMessage(messageData);
                        }
                        console.log(`✅ Successfully processed message ${message.id} from ${channelName}`);
                        this.lastSuccessfulOperation = Date.now();
                    } catch (error) {
                        console.error(`❌ Error processing message ${message.id}:`, error);
                    }
                }
            } catch (error) {
                console.error('💥 Critical error in event handler:', error);
                
                // If it's a connection-related error, trigger reconnection with destroy()
                if (this.shouldReconnect(error)) {
                    console.log('🔄 Triggering reconnection with destroy() fix...');
                    this.handleReconnectAsync();
                }
            }
        }, new NewMessage({}));

        console.log(`🎧 Event handler added with destroy() fix. Listening for messages from ${channels.length} channels...`);
        
        // TEST: Disabled for stability testing - monitoring aggressive keep-alives instead
        console.log('🔬 Stability mode active - aggressive 15s keep-alives enabled');
        } catch (error) {
            console.error('🚨 Failed to start listening to channels:', error);
            throw error;
        }
    }

    async getRecentMessages(limit: number = 100, channelUsername?: string): Promise<void> {
        if (!this.client) {
            throw new Error('Client not connected. Call connect() first.');
        }

        const channel = channelUsername || process.env.SQDGN_CHANNEL_USERNAME;
        if (!channel) {
            throw new Error('Channel username not provided and SQDGN_CHANNEL_USERNAME not set in environment variables');
        }

        console.log(`Fetching last ${limit} messages from ${channel}...`);

        const channelEntity = await this.client.getEntity(channel);
        const messages = await this.client.getMessages(channelEntity, { limit });

        console.log(`Retrieved ${messages.length} messages`);

        // Process messages in reverse order (oldest first)
        for (const message of messages.reverse()) {
            if (message.text) {
                try {
                    // Process message directly with local data pipeline
                    const messageData = {
                        message_id: message.id.toString(),
                        raw_message: message.text,
                        timestamp: new Date(message.date * 1000),
                    };

                    if (isFastProcessingEnabled()) {
                        await processFastMessage(messageData);
                    } else {
                        await processMessage(messageData);
                    }
                } catch (error) {
                    console.error(`Error processing message ${message.id}:`, error);
                }
            }
        }

        console.log('Finished processing historical messages');
    }

    async getRecentMessagesFromChannels(channelData: any[], limit: number = 100): Promise<void> {
        if (!this.client) {
            throw new Error('Client not connected. Call connectWithSession() first.');
        }

        console.log(`Fetching last ${limit} messages from ${channelData.length} selected channels...`);

        let totalMessages = 0;

        for (const channelInfo of channelData) {
            try {
                console.log(`📥 Fetching messages from: ${channelInfo.title}`);
                
                let channel;
                
                if (channelInfo.accessHash) {
                    // Use both ID and accessHash to create proper peer
                    const channelId = parseInt(channelInfo.id);
                    const accessHash = BigInt(channelInfo.accessHash);
                    
                    // Create channel peer with ID and accessHash
                    const { Api } = await import('telegram');
                    const channelPeer = new Api.InputPeerChannel({
                        channelId: channelId,
                        accessHash: accessHash
                    });
                    
                    channel = await this.client.getEntity(channelPeer);
                } else if (channelInfo.username) {
                    // Fallback to username if available
                    channel = await this.client.getEntity(channelInfo.username);
                } else {
                    console.error(`⚠️ Cannot fetch messages from ${channelInfo.title}: no accessHash or username`);
                    continue;
                }

                const messages = await this.client.getMessages(channel, { limit });
                console.log(`Retrieved ${messages.length} messages from ${channelInfo.title}`);

                // Process messages in reverse order (oldest first)
                for (const message of messages.reverse()) {
                    if (message.text) {
                        try {
                            // Process message directly with local data pipeline
                            const messageData = {
                                message_id: `${channelInfo.id}_${message.id}`,
                                raw_message: message.text,
                                timestamp: new Date(message.date * 1000),
                            };

                            if (isFastProcessingEnabled()) {
                                await processFastMessage(messageData);
                            } else {
                                await processMessage(messageData);
                            }
                            totalMessages++;
                        } catch (error) {
                            console.error(`Error processing message ${message.id} from ${channelInfo.title}:`, error);
                        }
                    }
                }
            } catch (error) {
                console.error(`❌ Failed to fetch messages from ${channelInfo.title}:`, error);
            }
        }

        console.log(`✅ Finished processing ${totalMessages} total historical messages from ${channelData.length} channels`);
    }

    private setupErrorHandlers(): void {
        if (!this.client) return;

        // The Telegram client doesn't use standard EventEmitter patterns
        // We'll rely on heartbeat monitoring and error handling in individual methods
        console.log('✅ Connection monitoring set up - relying on heartbeat and method-level error handling');
    }

    private shouldReconnect(error: any): boolean {
        // Always prevent reconnection if no session string is available
        const sessionString = this.getSessionString();
        if (!sessionString) {
            console.warn('🚫 Preventing reconnection: No valid session string available');
            return false;
        }

        // Check circuit breaker
        if (this.isCircuitBreakerOpen) {
            console.warn('🚦 Circuit breaker is open - skipping reconnection attempt');
            return false;
        }

        const reconnectErrors = [
            'TIMEOUT',
            'CONNECTION_DEVICE_ERROR',
            'NETWORK_ERROR',
            'CONNECTION_NOT_INITED',
            'AUTH_KEY_DUPLICATED',
            'CONNECTION_DEVICE_INVALID',
            'SESSION_REVOKED'
        ];
        
        const shouldReconnect = reconnectErrors.some(errorType => 
            error.message?.includes(errorType) || error.toString().includes(errorType)
        );

        if (shouldReconnect) {
            const now = Date.now();
            
            // Detect rapid timeout pattern (timeouts within 2 minutes)
            if (error.message?.includes('TIMEOUT')) {
                if (now - this.lastTimeoutTime < 120000) { // Within 2 minutes
                    this.rapidTimeoutCount++;
                } else {
                    this.rapidTimeoutCount = 1; // Reset if gap is large
                }
                this.lastTimeoutTime = now;
                
                // Special handling for rapid timeout cycles
                if (this.rapidTimeoutCount >= 3) {
                    console.warn(`🚦 Rapid timeout pattern detected (${this.rapidTimeoutCount} timeouts) - opening circuit breaker for longer`);
                    this.isCircuitBreakerOpen = true;
                    this.rapidTimeoutCount = 0;
                    
                    // Longer timeout for rapid timeout patterns
                    setTimeout(() => {
                        console.log('🚦 Circuit breaker reset after timeout pattern cooldown');
                        this.isCircuitBreakerOpen = false;
                        this.circuitBreakerFailures = 0;
                    }, 300000); // 5 minutes for timeout patterns
                    
                    return false;
                }
            }
            
            this.circuitBreakerFailures++;
            
            // Standard circuit breaker logic
            if (this.circuitBreakerFailures >= this.circuitBreakerThreshold) {
                console.warn(`🚦 Circuit breaker opened after ${this.circuitBreakerFailures} failures`);
                this.isCircuitBreakerOpen = true;
                
                // Reset circuit breaker after timeout
                setTimeout(() => {
                    console.log('🚦 Circuit breaker reset - allowing reconnection attempts');
                    this.isCircuitBreakerOpen = false;
                    this.circuitBreakerFailures = 0;
                }, this.circuitBreakerResetTime);
                
                return false; // Don't reconnect immediately
            }
        }
        
        return shouldReconnect;
    }

    private async handleReconnect(): Promise<void> {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached. Stopping monitoring.`);
            this.isConnected = false;
            return;
        }

        this.reconnectAttempts++;
        console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

        try {
            // DESTROY existing client to properly stop update loop (GramJS fix)
            if (this.client && this.isConnected) {
                try {
                    console.log('🔥 Destroying client to stop update loop before reconnection');
                    await this.client.destroy();
                } catch (destroyError) {
                    console.warn('⚠️ Error during destroy:', destroyError);
                }
                this.client = null; // Clear reference for full cleanup
            }

            // Wait before reconnecting
            await new Promise(resolve => setTimeout(resolve, this.reconnectDelay));

            // Get session before destroying client
            const sessionString = this.session?.save() || '';
            if (!sessionString) {
                throw new Error('No session string available for reconnection');
            }

            // Recreate client completely (fresh instance)
            this.isConnected = false;
            this.client = null; // Ensure clean slate
            await this.connectWithSession(sessionString);
            console.log('✅ Successfully reconnected with fresh client instance');
            

        } catch (error) {
            console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed:`, error);
            
            // Exponential backoff
            this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
            
            // Try again after delay
            setTimeout(() => this.handleReconnect(), this.reconnectDelay);
        }
    }

    private startPassiveMonitoring(): void {
        // Clear existing heartbeat if any
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        // Conservative keep-alive every 60 seconds to prevent excessive API calls
        this.heartbeatInterval = setInterval(async () => {
            try {
                if (this.client && this.isConnected) {
                    // Use conservative keep-alive to reduce timeout errors
                    // Only send keep-alive if no recent successful operation
                    const timeSinceLastSuccess = Date.now() - this.lastSuccessfulOperation;
                    if (timeSinceLastSuccess < 45000) { // Skip if activity within 45 seconds
                        console.log('💓 Skipping keep-alive (recent activity detected)');
                        return;
                    }

                    console.log('💓 Sending conservative keep-alive to maintain connection health');
                    
                    try {
                        // Use lightweight getState call with conservative timeout
                        const startTime = Date.now();
                        await Promise.race([
                            this.client.invoke(new (await import('telegram')).Api.updates.GetState()),
                            new Promise((_, reject) =>
                                setTimeout(() => reject(new Error('Keep-alive timeout')), 15000)
                            )
                        ]);
                        
                        const duration = Date.now() - startTime;
                        console.log(`✅ Keep-alive successful (${duration}ms) - connection healthy`);
                        this.lastSuccessfulOperation = Date.now();
                        
                        // Reset all failure counters on success
                        this.circuitBreakerFailures = 0;
                        this.isCircuitBreakerOpen = false;
                        this.consecutiveStreamFailures = 0;
                        
                    } catch (keepAliveError) {
                        console.error('💔 Keep-alive failed - connection may be stale:', keepAliveError);
                        
                        // Only trigger reconnection after 3 consecutive failures to be more conservative
                        this.consecutiveStreamFailures++;
                        if (this.consecutiveStreamFailures >= 3) {
                            console.warn('🔄 Multiple keep-alive failures, triggering reconnection');
                            this.handleReconnectAsync();
                        } else {
                            console.log('⚠️ Keep-alive failed, will retry in 60 seconds');
                        }
                    }
                }
            } catch (error) {
                console.error('⚠️ Monitoring error:', error);
                if (this.shouldReconnect(error)) {
                    this.handleReconnectAsync();
                }
            }
        }, 60000); // Conservative 60-second keep-alives to reduce timeout errors
    }

    private async performControlledReconnect(): Promise<void> {
        console.log('🔄 Performing controlled reconnection with state reconciliation...');
        
        try {
            // Get current state before reconnecting
            const sessionString = this.getSessionString();
            if (!sessionString) {
                throw new Error('No session string available');
            }

            // Perform graceful reconnection
            await this.gracefulReconnect(sessionString);
            
            // Reconcile state after reconnection using getState/getDifference
            if (this.client && this.isConnected) {
                try {
                    const state = await this.client.invoke(new (await import('telegram')).Api.updates.GetState());
                    console.log('✅ State reconciliation successful after reconnection');
                    this.lastSuccessfulOperation = Date.now();
                } catch (stateError) {
                    console.warn('⚠️ State reconciliation failed, but connection appears stable:', stateError);
                }
            }
            
        } catch (error) {
            console.error('❌ Controlled reconnection failed:', error);
            this.handleReconnectAsync(); // Fall back to normal reconnection
        }
    }

    private async startPollingFallback(): Promise<void> {
        console.log('📊 Starting polling fallback mode...');
        
        this.pollingFallbackActive = true;
        this.streamingHealthy = false;
        
        // Clear any existing polling interval
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        
        // Start polling every 30-60 seconds with jitter
        const pollMessages = async () => {
            try {
                if (!this.client || !this.isConnected || !this.pollingFallbackActive) {
                    return;
                }
                
                console.log('📥 Polling for new messages...');
                
                // Poll each monitored channel
                for (const channelId of this.monitoringChannels) {
                    try {
                        // Get recent messages (limit 5 to avoid overwhelming for low-traffic channels)
                        const messages = await this.client.getMessages(channelId, { limit: 5 });
                        
                        // Process any new messages
                        for (const message of messages) {
                            if (message.text && message.date > (this.lastSuccessfulOperation / 1000)) {
                                console.log(`📨 Found new message via polling: ${message.text.substring(0, 100)}...`);
                                
                                // Process message through local data pipeline  
                                console.log(`⚡ Processing polled message ${message.id} locally...`);
                                const messageData = {
                                    message_id: `${channelId}_${message.id}`,
                                    raw_message: message.text,
                                    timestamp: new Date(message.date * 1000),
                                };

                                if (isFastProcessingEnabled()) {
                                    await processFastMessage(messageData);
                                } else {
                                    await processMessage(messageData);
                                }
                            }
                        }
                        
                        this.lastSuccessfulOperation = Date.now();
                        
                    } catch (channelError) {
                        console.error(`⚠️ Polling error for channel ${channelId}:`, channelError);
                    }
                }
                
                // Try to restore streaming health periodically
                await this.checkStreamingHealth();
                
            } catch (error) {
                console.error('📊 Polling fallback error:', error);
            }
        };
        
        // Initial poll
        await pollMessages();
        
        console.log('✅ Polling-only mode established - will check for messages every 2-5 minutes');
        
        // Set up interval with jitter (2-5 minutes for low-traffic channels)
        const setJitteredInterval = () => {
            const jitter = Math.random() * 180000 + 120000; // 2-5 minutes
            this.pollingInterval = setTimeout(async () => {
                await pollMessages();
                if (this.pollingFallbackActive) {
                    setJitteredInterval(); // Schedule next poll
                }
            }, jitter);
        };
        
        setJitteredInterval();
    }

    private async checkStreamingHealth(): Promise<void> {
        try {
            // Every 5 minutes, try to restore streaming by testing connection health
            if (Date.now() % 300000 < 60000) { // Roughly every 5 minutes
                console.log('🔍 Testing streaming health for potential restoration...');
                
                const state = await this.client.invoke(new (await import('telegram')).Api.updates.GetState());
                console.log('✅ State check successful, attempting to restore streaming');
                
                // Stop polling fallback
                await this.stopPollingFallback();
                
                // Reset streaming health
                this.streamingHealthy = true;
                this.consecutiveStreamFailures = 0;
                this.lastSuccessfulOperation = Date.now();
                
                console.log('🔄 Streaming restored successfully');
            }
        } catch (error) {
            console.log('⚠️ Streaming still unhealthy, continuing polling fallback');
        }
    }

    private async stopPollingFallback(): Promise<void> {
        console.log('🛑 Stopping polling fallback mode');
        
        this.pollingFallbackActive = false;
        
        if (this.pollingInterval) {
            clearTimeout(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    private handleReconnectAsync(): void {
        // Run reconnection in background to avoid blocking heartbeat
        setImmediate(async () => {
            try {
                await this.handleReconnect();
            } catch (error) {
                console.error('🚨 Background reconnection failed:', error);
            }
        });
    }

    private startConnectionRefresh(): void {
        // Clear existing refresh interval
        if (this.connectionRefreshInterval) {
            clearInterval(this.connectionRefreshInterval);
        }

        // Proactively refresh connection every 30 minutes to prevent long-running connection issues
        this.connectionRefreshInterval = setInterval(async () => {
            try {
                const timeSinceLastSuccess = Date.now() - this.lastSuccessfulOperation;
                const connectionAge = Date.now() - this.lastSuccessfulOperation;
                
                // For low-traffic channels: refresh if no activity in 20 minutes OR connection is 2+ hours old
                const noRecentActivity = timeSinceLastSuccess > 1200000; // 20 minutes
                const connectionTooOld = connectionAge > 7200000; // 2 hours
                
                if ((noRecentActivity || connectionTooOld) && this.isConnected) {
                    const reason = connectionTooOld ? 'connection age (2+ hours)' : `no activity (${Math.round(timeSinceLastSuccess/60000)} minutes)`;
                    console.log(`🔄 Proactive connection refresh - ${reason}`);
                    
                    const sessionString = this.getSessionString();
                    if (sessionString) {
                        // Gracefully disconnect and reconnect
                        await this.gracefulReconnect(sessionString);
                        this.lastSuccessfulOperation = Date.now();
                    }
                } else if (this.isConnected) {
                    console.log(`✅ Connection stable - last activity: ${Math.round(timeSinceLastSuccess/60000)} minutes ago`);
                }
            } catch (error) {
                console.error('⚠️ Connection refresh failed:', error);
                // Don't throw - let normal error handling take over
            }
        }, 1800000); // 30 minutes
    }

    private async gracefulReconnect(sessionString: string): Promise<void> {
        console.log('🔄 Starting graceful reconnection...');
        
        try {
            // Save current monitoring state
            const wasMonitoring = this.monitoringChannels.length > 0;
            
            // Stop monitoring and refresh timers
            this.stopPassiveMonitoring();
            this.stopConnectionRefresh();
            
            // DESTROY current client to properly stop update loop (GramJS fix)
            if (this.client && this.isConnected) {
                try {
                    console.log('🔥 Destroying client for graceful reconnection');
                    await this.client.destroy();
                } catch (destroyError) {
                    console.warn('⚠️ Error during graceful destroy:', destroyError);
                }
                this.client = null; // Clear reference for full cleanup
            }
            
            // Small delay to ensure clean disconnect
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Recreate client completely with fresh instance
            this.isConnected = false;
            this.client = null; // Ensure clean slate
            await this.connectWithSession(sessionString);
            
            console.log('✅ Graceful reconnection completed with fresh client instance');
            
        } catch (error) {
            console.error('❌ Graceful reconnection failed:', error);
            // Fall back to normal error handling
            if (this.shouldReconnect(error)) {
                this.handleReconnectAsync();
            }
        }
    }

    private stopPassiveMonitoring(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    private stopConnectionRefresh(): void {
        if (this.connectionRefreshInterval) {
            clearInterval(this.connectionRefreshInterval);
            this.connectionRefreshInterval = null;
        }
    }

    async disconnect(): Promise<void> {
        this.stopPassiveMonitoring();
        this.stopConnectionRefresh();
        await this.stopPollingFallback();
        
        if (this.client && this.isConnected) {
            try {
                console.log('🔥 Using client.destroy() to properly stop update loop (GramJS fix)');
                await this.client.destroy();
            } catch (error) {
                console.warn('⚠️ Error during destroy:', error);
            }
            this.isConnected = false;
            this.client = null; // Clear reference for full cleanup
            console.log('✅ Client destroyed and disconnected from Telegram');
        }
    }

    getSessionString(): string {
        return this.client?.session.save() || '';
    }

    get isClientConnected(): boolean {
        return this.isConnected && this.client; // Don't check client.disconnected - it's unreliable
    }

    // Webhook function removed - now using direct local processing
}

// Singleton instance
let telegramClient: TelegramClient | null = null;

export function getTelegramClient(): TelegramClient {
    if (!telegramClient) {
        telegramClient = new TelegramClient();
    }
    return telegramClient;
}

export { TelegramClient };
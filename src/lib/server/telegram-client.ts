import pkg from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage } from 'telegram/events';

const { TelegramClient: TelegramApiClient } = pkg;
import { processMessage } from './data-pipeline';
// import type { Message } from 'telegram/tl/custom/message';

class TelegramClient {
    private client: any | null = null;
    private session: StringSession;
    private isConnected = false;
    private monitoringChannels: string[] = [];

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

    async connectWithSession(sessionString: string): Promise<void> {
        if (this.isConnected) return;

        const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
        const apiHash = process.env.TELEGRAM_API_HASH || '';

        if (!apiId || !apiHash) {
            throw new Error('Missing Telegram API credentials in environment variables');
        }

        // Create session from stored string
        this.session = new StringSession(sessionString);
        this.client = new TelegramApiClient(this.session, apiId, apiHash, {
            connectionRetries: 5,
        });

        console.log('Connecting to Telegram with stored session...');
        await this.client.connect();

        console.log('Successfully connected to Telegram with session');
        this.isConnected = true;
    }

    async startListening(): Promise<void> {
        if (!this.client) {
            throw new Error('Client not connected. Call connect() first.');
        }

        const channelUsername = process.env.SQDGN_CHANNEL_USERNAME;
        if (!channelUsername) {
            throw new Error('SQDGN_CHANNEL_USERNAME not set in environment variables');
        }

        console.log(`Starting to listen for messages in ${channelUsername}...`);

        // Get the channel entity
        const channel = await this.client.getEntity(channelUsername);

        // Add event handler for new messages
        this.client.addEventHandler(async (event: any) => {
            const message = event.message;
            
            // Only process messages from the target channel
            if (message.chatId?.toString() === channel.id.toString()) {
                console.log(`New message received: ${message.text?.substring(0, 100)}...`);
                
                try {
                    // Send to Supabase Edge Function for processing
                    await this.sendToWebhook({
                        message_id: message.id.toString(),
                        raw_message: message.text || '',
                        timestamp: new Date(message.date * 1000).toISOString(),
                    });
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

        // Add event handler for new messages from all selected channels
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
                console.log(`🔍 Checking if message from ${messageChannelId} matches monitored channels:`, channels.map(c => c.id.toString()));
                
                const isFromMonitoredChannel = channels.some(channel => 
                    channel.id.toString() === messageChannelId
                );
                
                if (isFromMonitoredChannel) {
                    const channelName = channels.find(c => c.id.toString() === messageChannelId)?.title || messageChannelId;
                    console.log(`📨 Processing new message from ${channelName}: ${message.text.substring(0, 100)}...`);
                    
                    try {
                        // Send to Supabase Edge Function for processing
                        await this.sendToWebhook({
                            message_id: `${messageChannelId}_${message.id}`,
                            raw_message: message.text,
                            timestamp: new Date(message.date * 1000).toISOString(),
                            channel_id: messageChannelId,
                            channel_title: channelName
                        });
                        console.log(`✅ Successfully processed message ${message.id} from ${channelName}`);
                    } catch (error) {
                        console.error(`❌ Error processing message ${message.id}:`, error);
                    }
                } else {
                    console.log(`🚫 Ignoring message from unmonitored channel: ${messageChannelId}`);
                }
            } catch (error) {
                console.error('💥 Critical error in event handler:', error);
            }
        }, new NewMessage({}));

        console.log(`🎧 Event handler added. Listening for messages from ${channels.length} channels...`);
    }

    async getRecentMessages(limit: number = 100): Promise<void> {
        if (!this.client) {
            throw new Error('Client not connected. Call connect() first.');
        }

        const channelUsername = process.env.SQDGN_CHANNEL_USERNAME;
        if (!channelUsername) {
            throw new Error('SQDGN_CHANNEL_USERNAME not set in environment variables');
        }

        console.log(`Fetching last ${limit} messages from ${channelUsername}...`);

        const channel = await this.client.getEntity(channelUsername);
        const messages = await this.client.getMessages(channel, { limit });

        console.log(`Retrieved ${messages.length} messages`);

        // Process messages in reverse order (oldest first)
        for (const message of messages.reverse()) {
            if (message.text) {
                try {
                    await this.sendToWebhook({
                        message_id: message.id.toString(),
                        raw_message: message.text,
                        timestamp: new Date(message.date * 1000).toISOString(),
                    });
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
                            await this.sendToWebhook({
                                message_id: `${channelInfo.id}_${message.id}`,
                                raw_message: message.text,
                                timestamp: new Date(message.date * 1000).toISOString(),
                                channel_id: channelInfo.id,
                                channel_title: channelInfo.title
                            });
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

    async disconnect(): Promise<void> {
        if (this.client && this.isConnected) {
            await this.client.disconnect();
            this.isConnected = false;
            console.log('Disconnected from Telegram');
        }
    }

    getSessionString(): string {
        return this.client?.session.save() || '';
    }

    get isClientConnected(): boolean {
        return this.isConnected && this.client && !this.client.disconnected;
    }

    private async sendToWebhook(message: {
        message_id: string;
        raw_message: string;
        timestamp: string;
        channel_id?: string;
        channel_title?: string;
    }): Promise<void> {
        const webhookUrl = 'https://femdphkrpsyvdnhtfwhn.supabase.co/functions/v1/message-webhook';
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify(message)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Webhook error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log(`📤 Webhook response for ${message.message_id}:`, result);
        } catch (error) {
            console.error(`🚨 Failed to send message to webhook:`, error);
            
            // Fallback to local processing if webhook fails
            try {
                console.log('📋 Falling back to local processing...');
                await processMessage({
                    message_id: message.message_id,
                    raw_message: message.raw_message,
                    timestamp: new Date(message.timestamp),
                });
            } catch (fallbackError) {
                console.error('❌ Fallback processing also failed:', fallbackError);
                throw fallbackError;
            }
        }
    }
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
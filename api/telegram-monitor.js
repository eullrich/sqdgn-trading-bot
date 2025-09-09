import { TelegramApi } from 'telegram';
import { StringSession } from 'telegram/sessions';

// Serverless Telegram monitor for Vercel
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Trigger message fetching
      await fetchAndProcessMessages();
      return res.status(200).json({ success: true, message: 'Messages processed' });
    }

    if (req.method === 'GET') {
      // Health check or setup
      const { action } = req.query;
      
      if (action === 'fetch') {
        await fetchAndProcessMessages();
        return res.status(200).json({ success: true, message: 'Messages fetched' });
      }

      return res.status(200).json({ 
        status: 'healthy',
        service: 'telegram-monitor-vercel',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in telegram monitor:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

async function fetchAndProcessMessages() {
  const apiId = parseInt(process.env.TELEGRAM_API_ID || '0');
  const apiHash = process.env.TELEGRAM_API_HASH || '';
  const sessionString = process.env.TELEGRAM_SESSION_STRING || '';
  const monitoredChannels = (process.env.MONITORED_CHANNELS || '').split(',').filter(Boolean);

  if (!apiId || !apiHash || !sessionString) {
    throw new Error('Missing Telegram credentials');
  }

  const session = new StringSession(sessionString);
  const client = new TelegramApi(session, apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    console.log('Connecting to Telegram...');
    await client.connect();

    if (!monitoredChannels.length) {
      throw new Error('No monitored channels configured');
    }

    console.log(`Fetching messages from ${monitoredChannels.length} channels...`);

    for (const channelInfo of monitoredChannels) {
      try {
        const [channelId, accessHash, title] = channelInfo.split(':');
        
        let channel;
        if (accessHash) {
          // Use channel ID and access hash
          const { Api } = await import('telegram');
          const channelPeer = new Api.InputPeerChannel({
            channelId: parseInt(channelId),
            accessHash: BigInt(accessHash)
          });
          channel = await client.getEntity(channelPeer);
        } else {
          // Use channel ID directly
          channel = await client.getEntity(parseInt(channelId));
        }

        // Fetch recent messages (last 10)
        const messages = await client.getMessages(channel, { limit: 10 });
        
        console.log(`Fetched ${messages.length} messages from ${title || channelId}`);

        // Process each message
        for (const message of messages) {
          if (message.text) {
            await sendToWebhook({
              message_id: `${channelId}_${message.id}`,
              raw_message: message.text,
              timestamp: new Date(message.date * 1000).toISOString(),
              channel_id: channelId,
              channel_title: title || channelId
            });
          }
        }

      } catch (channelError) {
        console.error(`Error processing channel ${channelInfo}:`, channelError);
      }
    }

  } finally {
    await client.disconnect();
  }
}

async function sendToWebhook(message) {
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
    console.log(`Webhook response for ${message.message_id}:`, result);
  } catch (error) {
    console.error(`Failed to send message to webhook:`, error);
    throw error;
  }
}
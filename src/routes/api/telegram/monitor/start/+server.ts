import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTelegramMonitor, resetTelegramMonitor } from '$lib/server/services/telegram-monitor';
import { TELEGRAM_API_ID, TELEGRAM_API_HASH } from '$env/static/private';

export const POST: RequestHandler = async ({ cookies, request }) => {
  try {
    const sessionString = cookies.get('telegram_session');

    if (!sessionString) {
      return json({
        success: false,
        error: 'Not authenticated. Please login first.'
      }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { channels, channel, fetchHistory = false } = body;

    // Support both single channel (legacy) and multiple channels (new)
    const channelsToMonitor = Array.isArray(channels)
      ? channels
      : channel
        ? [channel]
        : [];

    if (channelsToMonitor.length === 0) {
      return json({
        success: false,
        error: 'At least one channel is required. Please select channels from the dropdown.'
      }, { status: 400 });
    }

    console.log(`🚀 Starting Telegram monitoring for channels: ${channelsToMonitor.join(', ')}`);

    // Get or create monitor (don't reset anymore)
    let monitor;
    try {
      monitor = getTelegramMonitor();
    } catch {
      // Create new monitor with config if none exists
      monitor = getTelegramMonitor({
        apiId: parseInt(TELEGRAM_API_ID || '0'),
        apiHash: TELEGRAM_API_HASH || '',
        sessionString,
        pollingInterval: 60000
      });
    }

    // Connect if not already connected
    if (!monitor.getStatus().isConnected) {
      await monitor.connect();
    }

    // Start monitoring for each channel
    for (const channelName of channelsToMonitor) {
      // Optionally fetch historical messages
      if (fetchHistory) {
        try {
          const historicalCount = await monitor.fetchHistoricalMessages(channelName, 100);
          console.log(`Fetched ${historicalCount} historical messages from ${channelName}`);
        } catch (error) {
          console.warn(`Failed to fetch history for ${channelName}:`, error);
        }
      }
    }

    // Start monitoring for new messages
    await monitor.startMonitoring(channelsToMonitor);

    const status = monitor.getStatus();

    return json({
      success: true,
      message: `Started monitoring ${channelsToMonitor.length} channel(s): ${channelsToMonitor.join(', ')}`,
      status
    });

  } catch (error) {
    console.error('❌ Failed to start monitoring:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start monitoring'
    }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ url }) => {
  try {
    const monitor = getTelegramMonitor();

    if (!monitor) {
      return json({
        success: true,
        message: 'No active monitoring'
      });
    }

    const channel = url.searchParams.get('channel');

    if (channel) {
      // Stop specific channel
      await monitor.stopChannel(channel);
      return json({
        success: true,
        message: `Stopped monitoring ${channel}`
      });
    } else {
      // Stop all monitoring
      await monitor.stopMonitoring();
      return json({
        success: true,
        message: 'All monitoring stopped'
      });
    }

  } catch (error) {
    console.error('❌ Failed to stop monitoring:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to stop monitoring'
    }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  try {
    let monitor;
    try {
      monitor = getTelegramMonitor();
    } catch {
      // No monitor initialized
      return json({
        success: true,
        status: {
          isConnected: false,
          lastActivity: null,
          messagesProcessed: 0,
          errors: 0,
          activeChannels: []
        }
      });
    }

    const status = monitor.getStatus();

    return json({
      success: true,
      status
    });

  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Status check failed'
    }, { status: 500 });
  }
};
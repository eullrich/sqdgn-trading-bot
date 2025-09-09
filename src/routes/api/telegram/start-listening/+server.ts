import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTelegramClient } from '$lib/server/telegram-client';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

let isListening = false;
let connectionStatus = 'disconnected';

export const POST: RequestHandler = async ({ cookies }) => {
	console.log('🚀 Starting POST request to /api/telegram/start-listening');
	try {
		if (isListening) {
			return json({
				success: true,
				message: 'Already listening to selected channels',
				status: connectionStatus
			});
		}

		const sessionString = cookies.get('telegram_session');
		const selectedChannelsStr = cookies.get('selected_channels');
		
		console.log('📋 Session string exists:', !!sessionString);
		console.log('📋 Selected channels string exists:', !!selectedChannelsStr);
		
		if (!sessionString) {
			return json({
				success: false,
				error: 'Not authenticated. Please login first.'
			}, { status: 401 });
		}
		
		if (!selectedChannelsStr) {
			return json({
				success: false,
				error: 'No channels selected. Please select channels to monitor.'
			}, { status: 400 });
		}

		const selectedChannels = JSON.parse(selectedChannelsStr);
		console.log('Selected channels to monitor:', selectedChannels);
		
		const client = getTelegramClient();
		
		// Connect if not already connected
		connectionStatus = 'connecting';
		await client.connectWithSession(sessionString);
		connectionStatus = 'connected';
		
		// Start listening for new messages from selected channels
		await client.startListeningToChannels(selectedChannels);
		isListening = true;
		connectionStatus = 'listening';

		console.log(`🚀 Real-time monitoring started for ${selectedChannels.length} channels!`);

		return json({
			success: true,
			message: `Successfully started listening to ${selectedChannels.length} channel${selectedChannels.length === 1 ? '' : 's'}`,
			status: connectionStatus,
			channelCount: selectedChannels.length
		});

	} catch (error) {
		console.error('Failed to start Telegram listening:', error);
		
		// Log more details for debugging
		if (error instanceof Error) {
			console.error('Error name:', error.name);
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}
		
		connectionStatus = 'error';
		isListening = false;
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error starting Telegram listener',
			status: connectionStatus,
			details: error instanceof Error ? error.stack : undefined
		}, { status: 500 });
	}
};

export const GET: RequestHandler = async () => {
	try {
		// Check if client is actually connected
		if (isListening) {
			const client = getTelegramClient();
			const isConnected = client.getSessionString() && client.isClientConnected;
			
			if (!isConnected) {
				console.warn('⚠️ Client reports listening but connection lost - resetting status');
				isListening = false;
				connectionStatus = 'disconnected';
			}
		}
		
		return json({
			isListening,
			status: connectionStatus,
			timestamp: new Date().toISOString(),
			sessionExists: !!getTelegramClient().getSessionString()
		});
	} catch (error) {
		console.error('Error checking connection status:', error);
		return json({
			isListening: false,
			status: 'error',
			timestamp: new Date().toISOString(),
			error: error instanceof Error ? error.message : 'Unknown error'
		});
	}
};

export const DELETE: RequestHandler = async () => {
	try {
		if (!isListening) {
			return json({
				success: true,
				message: 'Not currently listening',
				status: connectionStatus
			});
		}

		const client = getTelegramClient();
		await client.disconnect();
		
		isListening = false;
		connectionStatus = 'disconnected';

		return json({
			success: true,
			message: 'Stopped listening to SQDGN channel',
			status: connectionStatus
		});

	} catch (error) {
		console.error('Failed to stop Telegram listening:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error stopping Telegram listener'
		}, { status: 500 });
	}
};
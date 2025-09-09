import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTelegramClient } from '$lib/server/telegram-client';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { limit = 100 } = await request.json();

		if (limit < 1 || limit > 1000) {
			return json({
				success: false,
				error: 'Limit must be between 1 and 1000'
			}, { status: 400 });
		}

		const sessionString = cookies.get('telegram_session');
		const selectedChannelsStr = cookies.get('selected_channels');
		
		if (!sessionString) {
			return json({
				success: false,
				error: 'Not authenticated. Please login first.'
			}, { status: 401 });
		}
		
		if (!selectedChannelsStr) {
			return json({
				success: false,
				error: 'No channels selected. Please select channels to monitor first.'
			}, { status: 400 });
		}

		const selectedChannels = JSON.parse(selectedChannelsStr);
		const client = getTelegramClient();
		
		// Connect with stored session
		await client.connectWithSession(sessionString);
		
		// Fetch and process recent messages from selected channels
		await client.getRecentMessagesFromChannels(selectedChannels, limit);

		return json({
			success: true,
			message: `Successfully processed last ${limit} messages from ${selectedChannels.length} selected channel${selectedChannels.length === 1 ? '' : 's'}`,
			limit,
			channelCount: selectedChannels.length
		});

	} catch (error) {
		console.error('Failed to fetch historical messages:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error fetching messages'
		}, { status: 500 });
	}
};
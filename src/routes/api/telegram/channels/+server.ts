import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import pkg from 'telegram';
import { StringSession } from 'telegram/sessions';
import { TELEGRAM_API_ID, TELEGRAM_API_HASH } from '$env/static/private';

const { TelegramClient } = pkg;

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const sessionString = cookies.get('telegram_session');
		
		if (!sessionString) {
			return json({
				success: false,
				error: 'Not authenticated'
			}, { status: 401 });
		}

		// Create client with stored session
		const session = new StringSession(sessionString);
		const apiId = parseInt(TELEGRAM_API_ID || '0');
		const apiHash = TELEGRAM_API_HASH || '';
		
		if (!apiId || !apiHash) {
			console.error('Missing Telegram API credentials:', { apiId: !!apiId, apiHash: !!apiHash });
			return json({
				success: false,
				error: 'Server configuration error: Missing Telegram API credentials'
			}, { status: 500 });
		}

		const client = new TelegramClient(session, apiId, apiHash, {
			connectionRetries: 5,
		});

		await client.connect();

		try {
			// Get all dialogs (conversations)
			const dialogs = await client.getDialogs({ limit: 100 });
			
			const channels = [];
			
			for (const dialog of dialogs) {
				const entity = dialog.entity;
				
				// Filter for channels and groups only
				if (entity.className === 'Channel' || entity.className === 'Chat') {
					console.log('📍 Entity details:', {
						className: entity.className,
						id: entity.id.toString(),
						title: entity.title,
						username: entity.username
					});
					
					// Store the entity itself for easier retrieval later
					let channelId = entity.id.toString();
					if (entity.className === 'Channel') {
						// For channels, store the raw ID but also try to determine proper format
						console.log('🔍 Channel entity:', entity);
					}
					
					const channelInfo = {
						id: channelId,
						accessHash: entity.accessHash?.toString() || null,
						title: entity.title || 'Untitled',
						username: entity.username || null,
						type: entity.className === 'Channel' ? 
							(entity.broadcast ? 'channel' : 'supergroup') : 'group',
						description: entity.about || null,
						memberCount: entity.participantsCount || 0,
						isPublic: !!entity.username,
						isAdmin: false, // We'll determine this if needed
						canPostMessages: false // We'll determine this if needed
					};
					
					// Only include channels we can read
					if (!entity.left && !entity.kicked) {
						channels.push(channelInfo);
					}
				}
			}

			// Sort by member count descending
			channels.sort((a, b) => b.memberCount - a.memberCount);

			await client.disconnect();

			return json({
				success: true,
				channels
			});

		} catch (error) {
			await client.disconnect();
			throw error;
		}

	} catch (error) {
		console.error('Failed to fetch channels:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch channels'
		}, { status: 500 });
	}
};
import pkg from 'telegram';
import { StringSession } from 'telegram/sessions';
import { TELEGRAM_API_ID, TELEGRAM_API_HASH } from '$env/static/private';

const { TelegramClient } = pkg;

export interface TelegramUser {
	id: string;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	phone: string | null;
}

/**
 * Validates a Telegram session string and extracts user info
 * Returns user info without requiring an active connection
 */
export async function validateTelegramSession(sessionString: string): Promise<TelegramUser | null> {
	try {
		// Basic session format validation
		if (!sessionString || sessionString.trim() === '') {
			return null;
		}

		// Check if session looks like a valid StringSession format
		if (!sessionString.includes('1')) {
			return null;
		}

		// Use environment variables for API credentials
		const apiId = parseInt(TELEGRAM_API_ID || '0');
		const apiHash = TELEGRAM_API_HASH || '';

		if (!apiId || !apiHash) {
			console.error('Missing Telegram API credentials');
			return null;
		}

		// Create a temporary client to validate session and get user info
		const session = new StringSession(sessionString);
		const client = new TelegramClient(session, apiId, apiHash, {
			connectionRetries: 1,
			timeout: 5000, // Short timeout for validation
		});

		try {
			await client.connect();

			// Check if session is authorized
			const isAuthorized = await client.checkAuthorization();
			if (!isAuthorized) {
				await client.disconnect();
				return null;
			}

			// Get user info
			const me = await client.getMe();
			await client.disconnect();

			return {
				id: me.id?.toString() || '',
				firstName: me.firstName || null,
				lastName: me.lastName || null,
				username: me.username || null,
				phone: me.phone || null
			};

		} catch (clientError) {
			try {
				await client.disconnect();
			} catch (disconnectError) {
				// Ignore disconnect errors
			}

			console.error('Session validation client error:', clientError);
			return null;
		}

	} catch (error) {
		console.error('Session validation error:', error);
		return null;
	}
}

export interface TelegramChannel {
	id: string;
	accessHash: string | null;
	title: string;
	username: string | null;
	type: string;
	description: string | null;
	memberCount: number;
	isPublic: boolean;
	isAdmin: boolean;
	canPostMessages: boolean;
}

/**
 * Fetches Telegram channels using a session string
 * Creates temporary connection to get channels and then disconnects
 */
export async function fetchTelegramChannels(sessionString: string): Promise<TelegramChannel[] | null> {
	try {
		// Basic session format validation
		if (!sessionString || sessionString.trim() === '') {
			return null;
		}

		if (!sessionString.includes('1')) {
			return null;
		}

		// Use environment variables for API credentials
		const apiId = parseInt(TELEGRAM_API_ID || '0');
		const apiHash = TELEGRAM_API_HASH || '';

		if (!apiId || !apiHash) {
			console.error('Missing Telegram API credentials');
			return null;
		}

		// Create a temporary client to fetch channels
		const session = new StringSession(sessionString);
		const client = new TelegramClient(session, apiId, apiHash, {
			connectionRetries: 1,
			timeout: 10000,
		});

		try {
			await client.connect();

			// Check if session is authorized
			const isAuthorized = await client.checkAuthorization();
			if (!isAuthorized) {
				await client.disconnect();
				return null;
			}

			// Get all dialogs (conversations)
			const dialogs = await client.getDialogs({ limit: 100 });
			const channels: TelegramChannel[] = [];

			for (const dialog of dialogs) {
				const entity = dialog.entity;

				// Filter for channels and groups only
				if (entity.className === 'Channel' || entity.className === 'Chat') {
					const channelInfo: TelegramChannel = {
						id: entity.id.toString(),
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

			await client.disconnect();

			// Sort by member count descending
			channels.sort((a, b) => b.memberCount - a.memberCount);

			return channels;

		} catch (clientError) {
			try {
				await client.disconnect();
			} catch (disconnectError) {
				// Ignore disconnect errors
			}

			console.error('Channels fetch client error:', clientError);
			return null;
		}

	} catch (error) {
		console.error('Channels fetch error:', error);
		return null;
	}
}

/**
 * Checks if a session string is valid format without connecting
 */
export function isValidSessionFormat(sessionString: string): boolean {
	if (!sessionString || sessionString.trim() === '') {
		return false;
	}

	// Basic StringSession format check
	return sessionString.includes('1') && sessionString.length > 10;
}
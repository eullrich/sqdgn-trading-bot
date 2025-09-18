import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchTelegramChannels } from '$lib/server/session-helpers';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const sessionString = cookies.get('telegram_session');

		if (!sessionString || sessionString.trim() === '') {
			return json({
				success: false,
				error: 'Not authenticated'
			}, { status: 401 });
		}

		// Fetch channels using the session
		const channels = await fetchTelegramChannels(sessionString);

		if (channels === null) {
			// Clear invalid session cookie
			cookies.delete('telegram_session', {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});

			return json({
				success: false,
				error: 'Invalid or expired session'
			}, { status: 401 });
		}

		if (channels.length === 0) {
			return json({
				success: false,
				error: 'No channels found. Make sure you have access to Telegram channels.'
			}, { status: 404 });
		}

		return json({
			success: true,
			channels
		});

	} catch (error) {
		console.error('Failed to fetch channels:', error);

		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch channels'
		}, { status: 500 });
	}
};
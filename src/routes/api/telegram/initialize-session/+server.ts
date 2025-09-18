import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateTelegramSession } from '$lib/server/session-helpers';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const sessionString = cookies.get('telegram_session');

		if (!sessionString || sessionString.trim() === '') {
			return json({
				success: false,
				error: 'No session found. Please login first.'
			}, { status: 401 });
		}

		console.log('🔧 Validating Telegram session...');

		// Validate session and get user info
		const user = await validateTelegramSession(sessionString);

		if (!user) {
			// Clear invalid session cookie
			cookies.delete('telegram_session', {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict'
			});

			return json({
				success: false,
				error: 'Session validation failed - please log in again'
			}, { status: 401 });
		}

		return json({
			success: true,
			message: 'Telegram session is valid',
			isConnected: true
		});

	} catch (error) {
		console.error('Session validation error:', error);

		return json({
			success: false,
			error: 'Internal server error'
		}, { status: 500 });
	}
};
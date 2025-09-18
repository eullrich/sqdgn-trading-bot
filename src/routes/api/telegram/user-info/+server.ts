import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { validateTelegramSession } from '$lib/server/session-helpers';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const sessionString = cookies.get('telegram_session');

		if (!sessionString || sessionString.trim() === '') {
			return json({
				success: false,
				error: 'No session found'
			}, { status: 401 });
		}

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
				error: 'Invalid or expired session'
			}, { status: 401 });
		}

		return json({
			success: true,
			user
		});

	} catch (error) {
		console.error('User info error:', error);
		return json({
			success: false,
			error: 'Internal server error'
		}, { status: 500 });
	}
};
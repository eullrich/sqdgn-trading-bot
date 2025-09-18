import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check if user has a valid session cookie
	const sessionString = cookies.get('telegram_session');
	
	if (!sessionString) {
		return json({
			authenticated: false,
			hasSession: false,
			reason: 'No session cookie'
		});
	}

	// For now, just check if the session cookie exists
	// TODO: Add proper session validation later
	return json({
		authenticated: !!sessionString,
		hasSession: !!sessionString,
		reason: 'Session cookie exists'
	});
};
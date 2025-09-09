import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	// Check if user has a valid session
	const sessionString = cookies.get('telegram_session');
	
	return json({
		authenticated: !!sessionString,
		hasSession: !!sessionString
	});
};
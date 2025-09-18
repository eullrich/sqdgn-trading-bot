import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the telegram session cookie
	cookies.delete('telegram_session', { path: '/' });
	
	return json({
		success: true,
		message: 'Logged out successfully'
	});
};

export const GET: RequestHandler = async ({ cookies }) => {
	// Clear the telegram session cookie
	cookies.delete('telegram_session', { path: '/' });
	
	// Redirect to login page
	throw redirect(302, '/login');
};
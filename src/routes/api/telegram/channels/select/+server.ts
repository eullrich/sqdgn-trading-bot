import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const sessionString = cookies.get('telegram_session');
		
		if (!sessionString) {
			return json({
				success: false,
				error: 'Not authenticated'
			}, { status: 401 });
		}

		const { channels } = await request.json();
		
		if (!channels || !Array.isArray(channels) || channels.length === 0) {
			return json({
				success: false,
				error: 'Please select at least one channel'
			}, { status: 400 });
		}

		console.log('📋 Storing channels:', channels.map(c => ({ id: c.id, title: c.title, accessHash: c.accessHash })));

		// Store selected channels in database or session
		// For now, we'll store in cookies, but in production use a proper user management system
		cookies.set('selected_channels', JSON.stringify(channels), {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		// Also store the session string for later use
		cookies.set('telegram_session', sessionString, {
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});

		return json({
			success: true,
			message: `Selected ${channels.length} channel${channels.length === 1 ? '' : 's'} for monitoring`,
			selectedCount: channels.length
		});

	} catch (error) {
		console.error('Failed to save channel selection:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Failed to save selection'
		}, { status: 500 });
	}
};
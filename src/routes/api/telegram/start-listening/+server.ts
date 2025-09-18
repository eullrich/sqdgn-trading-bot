import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	console.log('⚠️  Deprecated endpoint: /api/telegram/start-listening');
	
	return json({
		success: false,
		error: 'This endpoint is deprecated. Use /api/telegram/monitor/start instead.',
		redirect: '/api/telegram/monitor/start'
	}, { status: 410 }); // 410 Gone
};

export const GET: RequestHandler = async () => {
	return json({
		success: false,
		error: 'This endpoint is deprecated. Use /api/telegram/monitor/start instead.',
		redirect: '/api/telegram/monitor/start'
	}, { status: 410 });
};
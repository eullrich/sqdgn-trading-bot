import { json } from '@sveltejs/kit';
import { getTradingEngine } from '$lib/server/trading-engine';
import type { RequestHandler } from './$types';

let engineStatus = { isRunning: false, startedAt: null };

export const GET: RequestHandler = async () => {
	try {
		return json({ 
			success: true, 
			status: engineStatus
		});
	} catch (error) {
		console.error('Error getting trading engine status:', error);
		return json({ success: false, error: 'Failed to get engine status' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { action } = await request.json();
		
		if (action !== 'start' && action !== 'stop') {
			return json({ success: false, error: 'Invalid action. Use "start" or "stop"' }, { status: 400 });
		}
		
		const engine = getTradingEngine();
		
		if (action === 'start') {
			if (engineStatus.isRunning) {
				return json({ success: false, error: 'Trading engine is already running' }, { status: 400 });
			}
			
			engine.start();
			engineStatus = {
				isRunning: true,
				startedAt: new Date().toISOString()
			};
			
			console.log('Trading engine started');
			return json({ success: true, message: 'Trading engine started', status: engineStatus });
			
		} else if (action === 'stop') {
			if (!engineStatus.isRunning) {
				return json({ success: false, error: 'Trading engine is not running' }, { status: 400 });
			}
			
			engine.stop();
			engineStatus = {
				isRunning: false,
				startedAt: null
			};
			
			console.log('Trading engine stopped');
			return json({ success: true, message: 'Trading engine stopped', status: engineStatus });
		}
		
	} catch (error) {
		console.error('Error managing trading engine:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
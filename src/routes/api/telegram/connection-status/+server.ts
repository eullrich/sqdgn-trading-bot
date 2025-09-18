import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const sessionString = cookies.get('telegram_session');

		if (!sessionString) {
			return json({
				success: false,
				status: {
					isConnected: false,
					activeChannels: [],
					lastActivity: null,
					messagesProcessed: 0,
					errors: 0
				},
				message: 'No session found'
			});
		}

		// Check if monitoring is active
		let monitoringStatus = {
			isConnected: false,
			activeChannels: [],
			lastActivity: null,
			messagesProcessed: 0,
			errors: 0
		};

		try {
			// Try to get monitoring status from the telegram monitor
			const { getTelegramMonitor } = await import('$lib/server/services/telegram-monitor');
			const monitor = getTelegramMonitor();

			if (monitor) {
				const status = monitor.getStatus();
				monitoringStatus = {
					isConnected: status.isConnected || false,
					activeChannels: status.activeChannels || [],
					lastActivity: status.lastActivity,
					messagesProcessed: status.messagesProcessed || 0,
					errors: status.errors || 0
				};
			}
		} catch (monitorError) {
			// Monitor might not be initialized yet, that's okay
			console.debug('No active monitoring found:', monitorError);
		}

		return json({
			success: true,
			status: monitoringStatus,
			message: 'Connection status retrieved'
		});
	} catch (error) {
		console.error('Connection status check error:', error);
		return json({
			success: false,
			status: {
				isConnected: false,
				activeChannels: [],
				lastActivity: null,
				messagesProcessed: 0,
				errors: 0
			},
			message: 'Error checking connection status'
		});
	}
};
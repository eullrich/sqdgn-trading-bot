import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getTelegramMonitor } from '$lib/server/services/telegram-monitor';

export const GET: RequestHandler = async () => {
    try {
        console.log('⚠️  Deprecated: /api/telegram/status called. Use /api/telegram/monitor/start instead.');
        
        // Redirect to new monitoring system
        const monitor = getTelegramMonitor();
        
        if (!monitor) {
            return json({
                isListening: false,
                status: 'disconnected',
                message: 'Use the new monitoring system at /api/telegram/monitor/start'
            });
        }
        
        const monitorStatus = monitor.getStatus();
        
        return json({
            isListening: monitorStatus.isConnected,
            status: monitorStatus.isConnected ? 'connected' : 'disconnected',
            message: 'This endpoint is deprecated. Use /api/telegram/monitor/start instead.'
        });
        
    } catch (error) {
        console.error('Error checking Telegram status:', error);
        
        return json({
            isListening: false,
            status: 'error',
            error: error instanceof Error ? error.message : 'Status check failed',
            message: 'This endpoint is deprecated. Use /api/telegram/monitor/start instead.'
        });
    }
};
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAnalyticsService } from '$lib/server/services/analytics-service';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const days = parseInt(url.searchParams.get('days') || '7');
    const analyticsService = getAnalyticsService();
    
    const metrics = await analyticsService.getPerformanceMetrics(days);
    const callsByType = await analyticsService.getCallsByType(days);
    const topMovers = await analyticsService.getTopMovers(10);
    
    return json({
      success: true,
      data: {
        metrics,
        callsByType,
        topMovers
      },
      period: `${days} days`
    });

  } catch (error) {
    console.error('Failed to get analytics metrics:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get metrics'
    }, { status: 500 });
  }
};
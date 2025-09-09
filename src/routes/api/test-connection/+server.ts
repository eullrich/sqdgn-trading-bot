import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	try {
		// Test basic connection
		const { data: testConnection, error: connectionError } = await supabaseAdmin
			.from('calls')
			.select('count')
			.limit(1);

		if (connectionError) {
			throw connectionError;
		}

		// Test database functions
		const { data: metricsTest, error: metricsError } = await supabaseAdmin
			.rpc('get_dashboard_metrics' as any);

		if (metricsError) {
			console.error('Metrics function error:', metricsError);
		}

		// Get table info
		const { data: tables, error: tableError } = await supabaseAdmin
			.from('information_schema.tables')
			.select('table_name')
			.eq('table_schema', 'public')
			.in('table_name', ['calls', 'performance_metrics', 'audit_logs']);

		return json({
			success: true,
			message: 'Successfully connected to Supabase!',
			connection: 'OK',
			tables: tables?.map(t => t.table_name) || [],
			metricsFunction: metricsError ? 'ERROR' : 'OK',
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Database connection test failed:', error);
		
		return json({
			success: false,
			error: error instanceof Error ? error.message : 'Unknown connection error',
			details: error,
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
};
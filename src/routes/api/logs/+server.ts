import { json } from '@sveltejs/kit';
import { execSync } from 'child_process';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const lines = url.searchParams.get('lines') || '50';
		
		// Get PM2 logs for the sqdgn-bot process
		const command = `pm2 logs sqdgn-bot --lines ${lines} --nostream --raw`;
		const output = execSync(command, { 
			encoding: 'utf-8',
			timeout: 5000,
			maxBuffer: 1024 * 1024 // 1MB buffer
		});
		
		// Split output into lines and filter out empty lines
		const logs = output
			.split('\n')
			.filter(line => line.trim().length > 0)
			.map(line => {
				// Remove PM2 prefixes and clean up the log lines
				return line.replace(/^\d+\|[^|]*\|\s*/, '').trim();
			})
			.filter(line => line.length > 0);
		
		return json({ logs });
	} catch (error) {
		console.error('Failed to fetch logs:', error);
		
		// Fallback: try to read from file system if PM2 command fails
		try {
			const fallbackCommand = `tail -n ${url.searchParams.get('lines') || '50'} /root/.pm2/logs/sqdgn-bot-out.log`;
			const fallbackOutput = execSync(fallbackCommand, { 
				encoding: 'utf-8',
				timeout: 3000 
			});
			
			const logs = fallbackOutput
				.split('\n')
				.filter(line => line.trim().length > 0);
			
			return json({ logs });
		} catch (fallbackError) {
			return json({ 
				logs: [
					'[ERROR] Failed to fetch logs from PM2',
					`[ERROR] ${error instanceof Error ? error.message : 'Unknown error'}`,
					'[INFO] Please check if PM2 is running and the process exists'
				] 
			});
		}
	}
};
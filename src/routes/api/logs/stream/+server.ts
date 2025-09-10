import type { RequestHandler } from './$types';
import { spawn } from 'child_process';

export const GET: RequestHandler = async () => {
	const encoder = new TextEncoder();
	
	const stream = new ReadableStream({
		start(controller) {
			// Set up SSE headers
			const headers = {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
				'Access-Control-Allow-Origin': '*'
			};
			
			// Send initial connection message
			controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
				log: '[INFO] Log streaming connected' 
			})}\n\n`));
			
			// Start PM2 log streaming
			const pm2Process = spawn('pm2', ['logs', 'sqdgn-bot', '--raw'], {
				stdio: ['ignore', 'pipe', 'pipe']
			});
			
			let buffer = '';
			
			pm2Process.stdout?.on('data', (data) => {
				buffer += data.toString();
				const lines = buffer.split('\n');
				buffer = lines.pop() || ''; // Keep incomplete line in buffer
				
				lines.forEach(line => {
					if (line.trim()) {
						// Clean up PM2 prefixes
						const cleanLine = line.replace(/^\d+\|[^|]*\|\s*/, '').trim();
						if (cleanLine) {
							try {
								controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
									log: cleanLine,
									timestamp: new Date().toISOString()
								})}\n\n`));
							} catch (error) {
								console.error('Error encoding log line:', error);
							}
						}
					}
				});
			});
			
			pm2Process.stderr?.on('data', (data) => {
				const errorLine = data.toString().trim();
				if (errorLine) {
					try {
						controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
							log: `[ERROR] ${errorLine}`,
							timestamp: new Date().toISOString()
						})}\n\n`));
					} catch (error) {
						console.error('Error encoding error line:', error);
					}
				}
			});
			
			pm2Process.on('error', (error) => {
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
						log: `[ERROR] PM2 process error: ${error.message}`,
						timestamp: new Date().toISOString()
					})}\n\n`));
				} catch (encodeError) {
					console.error('Error encoding PM2 error:', encodeError);
				}
			});
			
			pm2Process.on('close', (code) => {
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
						log: `[INFO] PM2 logs stream closed with code ${code}`,
						timestamp: new Date().toISOString()
					})}\n\n`));
				} catch (error) {
					console.error('Error encoding close message:', error);
				} finally {
					controller.close();
				}
			});
			
			// Keep-alive ping every 30 seconds
			const keepAlive = setInterval(() => {
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
						ping: true,
						timestamp: new Date().toISOString()
					})}\n\n`));
				} catch (error) {
					console.error('Error sending keep-alive:', error);
					clearInterval(keepAlive);
				}
			}, 30000);
			
			// Clean up on stream close
			return () => {
				clearInterval(keepAlive);
				if (!pm2Process.killed) {
					pm2Process.kill();
				}
			};
		}
	});
	
	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive',
			'Access-Control-Allow-Origin': '*'
		}
	});
};
import type { Handle } from '@sveltejs/kit';
import { initializeServer, cleanupServer } from '$lib/server/init';
import { building } from '$app/environment';

// Initialize server services on startup
if (!building) {
  console.log('🚀 Starting server initialization...');
  initializeServer().catch(error => {
    console.error('❌ Failed to initialize server:', error);
  });
}

// Handle graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', () => {
    cleanupServer().catch(error => {
      console.error('❌ Cleanup failed:', error);
    }).finally(() => {
      process.exit(0);
    });
  });
  process.on('SIGINT', () => {
    cleanupServer().catch(error => {
      console.error('❌ Cleanup failed:', error);
    }).finally(() => {
      process.exit(0);
    });
  });
}

export const handle: Handle = async ({ event, resolve }) => {
  // Add CORS headers for API routes
  if (event.url.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }
  }

  const response = await resolve(event);

  // Add CORS headers to all API responses
  if (event.url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
};
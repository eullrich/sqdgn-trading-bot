import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { Database } from '../database.types';

// Server-side Supabase client with service role for API routes
export async function createSupabaseClient() {
	return createClient<Database>(
		PUBLIC_SUPABASE_URL,
		SUPABASE_SERVICE_ROLE_KEY || PUBLIC_SUPABASE_ANON_KEY
	);
}

// Alternative client creation for different contexts
export function createSupabaseServerClient(fetch: typeof globalThis.fetch) {
	return createClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			global: {
				fetch
			}
		}
	);
}
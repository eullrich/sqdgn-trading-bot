import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/database.types';

// Create Supabase client
export const supabase = createClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

// Store for real-time connection status
export const realtimeStatus = writable<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
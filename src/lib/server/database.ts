import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '../database.types';

export const supabaseAdmin = createClient<Database>(
	PUBLIC_SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		}
	}
);

export async function logAuditEvent(
	eventType: string,
	entityType: string,
	entityId?: string | null,
	details?: any,
	userId?: string
) {
	try {
		const { error } = await supabaseAdmin
			.from('audit_logs')
			.insert({
				event_type: eventType,
				entity_type: entityType,
				entity_id: entityId || null,
				details: details,
				user_id: userId || null
			});

		if (error) {
			console.error('Failed to log audit event:', error);
		}
	} catch (err) {
		console.error('Audit logging error:', err);
	}
}
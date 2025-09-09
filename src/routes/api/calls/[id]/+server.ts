import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin, logAuditEvent } from '$lib/server/database';
import { EVENT_TYPES, ENTITY_TYPES } from '$lib/constants';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		const { data, error } = await supabaseAdmin
			.from('calls_with_performance')
			.select('*')
			.eq('id', id)
			.single();

		if (error) {
			if (error.code === 'PGRST116') {
				return json({ error: 'Call not found' }, { status: 404 });
			}
			console.error('Database error:', error);
			return json({ error: 'Failed to fetch call' }, { status: 500 });
		}

		return json({ call: data });

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const { id } = params;
		const updates = await request.json();

		// Validate the updates
		const allowedFields = [
			'token_symbol',
			'signal_type', 
			'entry_price',
			'target_multiplier',
			'risk_level',
			'is_valid'
		];

		const filteredUpdates = Object.keys(updates)
			.filter(key => allowedFields.includes(key))
			.reduce((obj, key) => {
				obj[key] = updates[key];
				return obj;
			}, {} as any);

		if (Object.keys(filteredUpdates).length === 0) {
			return json({ error: 'No valid fields to update' }, { status: 400 });
		}

		// Update the call
		const { data, error } = await supabaseAdmin
			.from('calls')
			.update(filteredUpdates as any)
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to update call' }, { status: 500 });
		}

		// Log the update
		await logAuditEvent(
			EVENT_TYPES.CALL_UPDATED,
			ENTITY_TYPES.CALL,
			id,
			{ updated_fields: Object.keys(filteredUpdates) }
		);

		return json({ call: data });

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const { id } = params;

		const { error } = await supabaseAdmin
			.from('calls')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Database error:', error);
			return json({ error: 'Failed to delete call' }, { status: 500 });
		}

		// Log the deletion
		await logAuditEvent(
			'CALL_DELETED',
			ENTITY_TYPES.CALL,
			id,
			{ deleted_at: new Date().toISOString() }
		);

		return json({ success: true });

	} catch (error) {
		console.error('API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/database';

export const POST: RequestHandler = async () => {
	try {
		console.log('Running message_timestamp migration...');

		// Step 1: Add the message_timestamp column
		const addColumnResult = await supabaseAdmin.rpc('exec_sql', {
			sql: 'ALTER TABLE calls ADD COLUMN IF NOT EXISTS message_timestamp TIMESTAMPTZ;'
		});

		if (addColumnResult.error) {
			console.error('Failed to add column:', addColumnResult.error);
			return json({ error: 'Failed to add message_timestamp column', details: addColumnResult.error }, { status: 500 });
		}

		// Step 2: Add index
		const addIndexResult = await supabaseAdmin.rpc('exec_sql', {
			sql: 'CREATE INDEX IF NOT EXISTS idx_calls_message_timestamp ON calls(message_timestamp DESC);'
		});

		if (addIndexResult.error) {
			console.error('Failed to add index:', addIndexResult.error);
			return json({ error: 'Failed to add index', details: addIndexResult.error }, { status: 500 });
		}

		// Step 3: Create trigger function
		const createFunctionResult = await supabaseAdmin.rpc('exec_sql', {
			sql: `
				CREATE OR REPLACE FUNCTION set_message_timestamp() RETURNS TRIGGER AS $$
				BEGIN
					-- If message_timestamp is not provided, use created_at as fallback
					IF NEW.message_timestamp IS NULL THEN
						NEW.message_timestamp = NEW.created_at;
					END IF;
					
					RETURN NEW;
				END;
				$$ LANGUAGE plpgsql;
			`
		});

		if (createFunctionResult.error) {
			console.error('Failed to create function:', createFunctionResult.error);
			return json({ error: 'Failed to create trigger function', details: createFunctionResult.error }, { status: 500 });
		}

		// Step 4: Create trigger
		const createTriggerResult = await supabaseAdmin.rpc('exec_sql', {
			sql: `
				DROP TRIGGER IF EXISTS trigger_set_message_timestamp ON calls;
				CREATE TRIGGER trigger_set_message_timestamp
					BEFORE INSERT ON calls
					FOR EACH ROW
					EXECUTE FUNCTION set_message_timestamp();
			`
		});

		if (createTriggerResult.error) {
			console.error('Failed to create trigger:', createTriggerResult.error);
			return json({ error: 'Failed to create trigger', details: createTriggerResult.error }, { status: 500 });
		}

		// Step 5: Backfill existing records
		const backfillResult = await supabaseAdmin.rpc('exec_sql', {
			sql: 'UPDATE calls SET message_timestamp = created_at WHERE message_timestamp IS NULL;'
		});

		if (backfillResult.error) {
			console.error('Failed to backfill:', backfillResult.error);
			return json({ error: 'Failed to backfill existing records', details: backfillResult.error }, { status: 500 });
		}

		// Step 6: Update view
		const updateViewResult = await supabaseAdmin.rpc('exec_sql', {
			sql: `
				DROP VIEW IF EXISTS calls_with_performance;
				CREATE VIEW calls_with_performance AS
				SELECT 
					c.*,
					pm.outcome,
					pm.actual_multiplier,
					pm.pnl_percentage,
					pm.duration_hours,
					pm.is_simulation
				FROM calls c
				LEFT JOIN performance_metrics pm ON c.id = pm.call_id;
			`
		});

		if (updateViewResult.error) {
			console.error('Failed to update view:', updateViewResult.error);
			return json({ error: 'Failed to update view', details: updateViewResult.error }, { status: 500 });
		}

		console.log('Migration completed successfully!');
		return json({
			success: true,
			message: 'Migration completed successfully',
			steps: [
				'Added message_timestamp column',
				'Created index',
				'Created trigger function',
				'Created trigger',
				'Backfilled existing records',
				'Updated view'
			]
		});

	} catch (error) {
		console.error('Migration error:', error);
		return json({ error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
	}
};
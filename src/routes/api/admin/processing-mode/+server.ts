import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getFastProcessingEnabled, setFastProcessingEnabled } from '$lib/server/processing-mode';

export const GET: RequestHandler = async () => {
	const fastProcessingEnabled = getFastProcessingEnabled();
	return json({
		success: true,
		fastProcessingEnabled,
		description: fastProcessingEnabled 
			? 'Fast mode: Immediate DB insertion, background enrichment'
			: 'Normal mode: Sequential processing with immediate enrichment'
	});
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { enabled } = await request.json();
		
		if (typeof enabled !== 'boolean') {
			return json({ 
				success: false, 
				error: 'enabled must be a boolean' 
			}, { status: 400 });
		}
		
		setFastProcessingEnabled(enabled);
		
		return json({
			success: true,
			fastProcessingEnabled: getFastProcessingEnabled(),
			message: `Processing mode set to ${enabled ? 'fast' : 'normal'}`
		});
		
	} catch (error) {
		console.error('Error updating processing mode:', error);
		return json({ 
			success: false, 
			error: 'Internal server error' 
		}, { status: 500 });
	}
};
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, request }) => {
  try {
    // Verify this is a cron request (Vercel adds specific headers)
    const authToken = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const userAgent = request.headers.get('user-agent');
    
    // Basic security check for cron jobs
    if (cronSecret && authToken !== `Bearer ${cronSecret}`) {
      // Allow if it's from Vercel's cron system (has specific user agent pattern)
      if (!userAgent?.includes('vercel-cron')) {
        return json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Get token addresses from query parameters
    const tokenAddresses = url.searchParams.get('tokens')?.split(',');

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ 
        error: 'Supabase configuration missing' 
      }, { status: 500 });
    }

    console.log(`🔄 Starting price snapshot ingestion for ${tokenAddresses?.length || 'all'} tokens`);

    const response = await fetch(`${supabaseUrl}/functions/v1/ingest-price-snapshots`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenAddresses
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Edge function error:', response.status, errorText);
      return json({ 
        error: `Edge function failed: ${response.status}`,
        details: errorText
      }, { status: 500 });
    }

    const result = await response.json();
    
    console.log(`✅ Ingestion completed: ${result.snapshotsInserted} snapshots, ${result.errors} errors`);

    return json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error('❌ Cron job error:', error);
    
    return json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

// Support manual POST requests for testing
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { tokenAddresses } = body;

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return json({ 
        error: 'Supabase configuration missing' 
      }, { status: 500 });
    }

    console.log(`🔄 Manual ingestion for ${tokenAddresses?.length || 'all'} tokens`);

    const response = await fetch(`${supabaseUrl}/functions/v1/ingest-price-snapshots`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenAddresses
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Edge function error:', response.status, errorText);
      return json({ 
        error: `Edge function failed: ${response.status}`,
        details: errorText
      }, { status: 500 });
    }

    const result = await response.json();
    
    console.log(`✅ Manual ingestion completed: ${result.snapshotsInserted} snapshots, ${result.errors} errors`);

    return json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error('❌ Manual ingestion error:', error);
    
    return json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};
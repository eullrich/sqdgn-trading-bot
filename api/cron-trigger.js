// Cron job endpoint to trigger telegram monitoring
export default async function handler(req, res) {
  // Verify this is a cron request (optional security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Call the telegram monitor
    const monitorUrl = `${process.env.VERCEL_URL}/api/telegram-monitor?action=fetch`;
    
    const response = await fetch(monitorUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      monitor_response: result
    });

  } catch (error) {
    console.error('Cron trigger error:', error);
    return res.status(500).json({ 
      error: 'Cron execution failed',
      details: error.message 
    });
  }
}
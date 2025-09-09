import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CallParser, testParser } from '$lib/server/parsing';

export const GET: RequestHandler = async () => {
	try {
		// Run the test parser
		const testMessages = [
			// SQDGN format example
			`🟣 Goatcoin - $GOAT (SOLANA)
├ 
GNHW5JetZmW85vAU35KyoDcYoSd3sNWtx5RPMTDJpump (SOLANA)
​└SIGNAL: Tracked wallet FNMvBk..EqUL bought 248550 of $GOAT for $3151.53

SQDGN Analysis:
🟢 Label: MATURING
🟢 Creation date: 2025-08-26 22:16:33
🟢 Wallet's PnL (last 2 weeks): 10.97%
🟡 Token age: 1–3 days – showing positive early momentum.

Large trade noticed – observing immediate effects.

📊 Token Stats
├ Market Cap: $11,234,651.00
├ Liquidity: $605,815.36
└ Volume (24h): $2,452,659.17

📊 Analytics
 ├ Dex Screener
 └ GMGN
💱 Buy with a bot
 └ AlphaOneBot
♻️ Swap on a DEX
 ├ Jupiter
 └ Raydium`,

			// Another SQDGN example with SELL signal
			`🔴 Memecoin - $MEME (SOLANA)
SIGNAL: Tracked wallet ABC123..XYZ789 sold 150000 of $MEME for $2500.00

SQDGN Analysis:
🔴 Label: RISKY
🟢 Wallet's PnL (last 2 weeks): -5.2%
🔴 Token age: 0–1 days – very new token.`,

			// Traditional format examples
			"🚀 $PEPE - BUY at $0.0001 - Target: 5x - Low risk gem!",
			"$BTC LONG entry 65000 target 2.5x HIGH RISK",
			"Just bought some apples at the store" // Should not parse as valid
		];

		const results = testMessages.map(message => ({
			input: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
			parsed: CallParser.parse(message)
		}));

		return json({
			success: true,
			results
		});

	} catch (error) {
		console.error('Parser test error:', error);
		return json({ 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message } = await request.json();
		
		if (!message || typeof message !== 'string') {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		const result = CallParser.parse(message);

		return json({
			success: true,
			input: message,
			parsed: result
		});

	} catch (error) {
		console.error('Parser test error:', error);
		return json({ 
			success: false, 
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};
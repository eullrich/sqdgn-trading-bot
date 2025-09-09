import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramMessage {
  message_id: number;
  date: number;
  text?: string;
  from?: {
    id: number;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

interface ParsedCall {
  tokenSymbol: string | null;
  signalType: string | null;
  entryPrice: number | null;
  targetMultiplier: number | null;
  riskLevel: string | null;
  confidence: number;
}

function parseCallMessage(text: string): ParsedCall & { metadata?: any } {
  // Enhanced parsing for SQDGN format
  const result: ParsedCall & { metadata?: any } = {
    tokenSymbol: null,
    signalType: null,
    entryPrice: null,
    targetMultiplier: null,
    riskLevel: null,
    confidence: 0
  };

  let confidence = 0;

  // Check if this is a SQDGN call format
  const isSQDGNCall = text.includes('SQDGN Analysis') || 
    text.includes('SIGNAL:') || 
    text.includes('Tracked wallet') ||
    text.includes('Market Cap:');

  if (isSQDGNCall) {
    confidence += 0.4; // High confidence for SQDGN format
  }

  // Parse token symbol (enhanced pattern)
  const tokenMatch = text.match(/\$([A-Z0-9]{2,15})/i);
  if (tokenMatch) {
    result.tokenSymbol = tokenMatch[1].toUpperCase();
    confidence += 0.25;
  }

  // Parse signal type from wallet action (SQDGN specific)
  if (/bought/i.test(text)) {
    result.signalType = 'BUY';
    confidence += 0.2;
  } else if (/sold/i.test(text)) {
    result.signalType = 'SELL';
    confidence += 0.2;
  } else if (/\b(BUY|LONG)\b/i.test(text)) {
    result.signalType = 'BUY';
    confidence += 0.15;
  } else if (/\b(SELL|SHORT)\b/i.test(text)) {
    result.signalType = 'SELL';
    confidence += 0.15;
  }

  // Parse transaction price (enhanced for SQDGN format)
  const pricePatterns = [
    /bought.*for\s*\$(\d+(?:,\d{3})*(?:\.\d+)?)/i,
    /sold.*for\s*\$(\d+(?:,\d{3})*(?:\.\d+)?)/i,
    /entry[:\s]*\$?(\d+(?:,\d{3})*(?:\.\d+)?)/i
  ];

  for (const pattern of pricePatterns) {
    const match = pattern.exec(text);
    if (match) {
      const priceString = match[1].replace(/,/g, '');
      result.entryPrice = parseFloat(priceString);
      confidence += 0.1;
      break;
    }
  }

  // Parse risk level from SQDGN label
  if (/Label:\s*SAFE/i.test(text)) {
    result.riskLevel = 'LOW';
    confidence += 0.05;
  } else if (/Label:\s*MATURING/i.test(text)) {
    result.riskLevel = 'MEDIUM';
    confidence += 0.05;
  } else if (/Label:\s*(RISKY|HIGH_RISK)/i.test(text)) {
    result.riskLevel = 'HIGH';
    confidence += 0.05;
  } else if (/Token age:\s*(\d+)–(\d+)\s*days/i.test(text)) {
    const ageMatch = text.match(/Token age:\s*(\d+)–(\d+)\s*days/i);
    if (ageMatch) {
      const minAge = parseInt(ageMatch[1]);
      if (minAge >= 7) result.riskLevel = 'LOW';
      else if (minAge >= 3) result.riskLevel = 'MEDIUM';
      else result.riskLevel = 'HIGH';
      confidence += 0.05;
    }
  }

  // Extract additional metadata for SQDGN calls
  if (isSQDGNCall) {
    result.metadata = {};

    // Market data
    const marketCapMatch = text.match(/Market Cap[:\s]*\$(\d+(?:,\d{3})*(?:\.\d+)?)/i);
    if (marketCapMatch) {
      result.metadata.marketCap = parseFloat(marketCapMatch[1].replace(/,/g, ''));
    }

    const volumeMatch = text.match(/Volume.*?\$(\d+(?:,\d{3})*(?:\.\d+)?)/i);
    if (volumeMatch) {
      result.metadata.volume24h = parseFloat(volumeMatch[1].replace(/,/g, ''));
    }

    const liquidityMatch = text.match(/Liquidity[:\s]*\$(\d+(?:,\d{3})*(?:\.\d+)?)/i);
    if (liquidityMatch) {
      result.metadata.liquidity = parseFloat(liquidityMatch[1].replace(/,/g, ''));
    }

    // Wallet data
    const pnlMatch = text.match(/PnL.*?(\d+(?:\.\d+)?)%/i);
    if (pnlMatch) {
      result.metadata.walletPnL = parseFloat(pnlMatch[1]);
    }

    const walletMatch = text.match(/wallet\s+([A-Za-z0-9]+\.\.\.?[A-Za-z0-9]+)/i);
    if (walletMatch) {
      result.metadata.walletAddress = walletMatch[1];
    }

    const solanaAddressMatch = text.match(/([A-Za-z0-9]{32,})\s*\(SOLANA\)/);
    if (solanaAddressMatch) {
      result.metadata.solanaAddress = solanaAddressMatch[1];
    }

    const quantityMatch = text.match(/bought\s+(\d+(?:,\d{3})*(?:\.\d+)?)\s+of/i);
    if (quantityMatch) {
      result.metadata.transactionAmount = parseFloat(quantityMatch[1].replace(/,/g, ''));
    }
  }

  result.confidence = Math.min(confidence, 1.0);
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const telegramBotToken = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
    const telegramChatId = Deno.env.get('TELEGRAM_CHAT_ID')!;

    if (!supabaseUrl || !supabaseServiceKey || !telegramBotToken || !telegramChatId) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the latest message ID we've processed
    const { data: lastCall } = await supabase
      .from('calls')
      .select('message_id')
      .order('created_at', { ascending: false })
      .limit(1);

    let lastMessageId = 0;
    if (lastCall && lastCall.length > 0) {
      lastMessageId = parseInt(lastCall[0].message_id);
    }

    // Fetch new messages from Telegram
    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/getUpdates?chat_id=${telegramChatId}&offset=${lastMessageId + 1}&limit=100`;
    
    const telegramResponse = await fetch(telegramUrl);
    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      throw new Error(`Telegram API error: ${telegramData.description}`);
    }

    const updates: TelegramUpdate[] = telegramData.result;
    let processedCount = 0;
    let validCallsCount = 0;

    // Process each message
    for (const update of updates) {
      if (!update.message || !update.message.text) {
        continue;
      }

      const message = update.message;
      const messageText = message.text;
      const messageId = message.message_id.toString();

      try {
        // Parse the message for trading signals
        const parsedCall = parseCallMessage(messageText);
        
        // Determine if this looks like a valid call (minimum confidence threshold)
        const isValid = parsedCall.confidence >= 0.4 && parsedCall.tokenSymbol !== null;
        
        if (isValid) {
          validCallsCount++;
        }

        // Insert into database
        const { error: insertError } = await supabase
          .from('calls')
          .insert({
            message_id: messageId,
            raw_message: messageText,
            token_symbol: parsedCall.tokenSymbol,
            signal_type: parsedCall.signalType,
            entry_price: parsedCall.entryPrice,
            target_multiplier: parsedCall.targetMultiplier,
            risk_level: parsedCall.riskLevel,
            confidence: parsedCall.confidence,
            is_valid: isValid,
            metadata: {
              telegram_user_id: message.from?.id,
              telegram_username: message.from?.username,
              message_date: message.date,
              chat_id: message.chat.id
            }
          });

        if (insertError) {
          console.error('Failed to insert call:', insertError);
          continue;
        }

        // Log audit event
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'CALL_CREATED',
            entity_type: 'CALL',
            entity_id: messageId,
            details: {
              source: 'telegram',
              confidence: parsedCall.confidence,
              is_valid: isValid
            }
          });

        processedCount++;

      } catch (error) {
        console.error(`Error processing message ${messageId}:`, error);
        
        // Log the error
        await supabase
          .from('audit_logs')
          .insert({
            event_type: 'ERROR',
            entity_type: 'CALL',
            entity_id: messageId,
            details: {
              error: error.message,
              raw_message: messageText
            }
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        validCalls: validCallsCount,
        totalUpdates: updates.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
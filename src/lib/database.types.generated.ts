export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      calls: {
        Row: {
          id: number
          created_at: string
          updated_at: string
          message_id: string | null
          message_text: string | null
          channel_name: string | null
          channel_id: string | null
          token_symbol: string | null
          contract_address: string | null
          call_type: string | null
          entry_price: number | null
          target_multiplier: number | null
          risk_level: string | null
          confidence_score: number | null
          is_valid: boolean | null
          parse_errors: string[] | null
          raw_signal_data: Json | null
          market_cap_at_detection: number | null
          current_market_cap: number | null
          current_price_usd: number | null
          price_updated_at: string | null
          market_cap_updated_at: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          updated_at?: string
          message_id?: string | null
          message_text?: string | null
          channel_name?: string | null
          channel_id?: string | null
          token_symbol?: string | null
          contract_address?: string | null
          call_type?: string | null
          entry_price?: number | null
          target_multiplier?: number | null
          risk_level?: string | null
          confidence_score?: number | null
          is_valid?: boolean | null
          parse_errors?: string[] | null
          raw_signal_data?: Json | null
          market_cap_at_detection?: number | null
          current_market_cap?: number | null
          current_price_usd?: number | null
          price_updated_at?: string | null
          market_cap_updated_at?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          updated_at?: string
          message_id?: string | null
          message_text?: string | null
          channel_name?: string | null
          channel_id?: string | null
          token_symbol?: string | null
          contract_address?: string | null
          call_type?: string | null
          entry_price?: number | null
          target_multiplier?: number | null
          risk_level?: string | null
          confidence_score?: number | null
          is_valid?: boolean | null
          parse_errors?: string[] | null
          raw_signal_data?: Json | null
          market_cap_at_detection?: number | null
          current_market_cap?: number | null
          current_price_usd?: number | null
          price_updated_at?: string | null
          market_cap_updated_at?: string | null
        }
        Relationships: []
      }
      token_price_snapshots_5m: {
        Row: {
          id: number
          time: string
          token_address: string
          token_symbol: string | null
          price_usd: number | null
          price_native: number | null
          volume_5m: number | null
          volume_1h: number | null
          volume_24h: number | null
          liquidity_usd: number | null
          market_cap: number | null
          price_change_5m: number | null
          price_change_1h: number | null
          price_change_24h: number | null
          txn_buys_5m: number | null
          txn_sells_5m: number | null
          dex_id: string | null
          pair_address: string | null
          source: string | null
        }
        Insert: {
          id?: number
          time?: string
          token_address: string
          token_symbol?: string | null
          price_usd?: number | null
          price_native?: number | null
          volume_5m?: number | null
          volume_1h?: number | null
          volume_24h?: number | null
          liquidity_usd?: number | null
          market_cap?: number | null
          price_change_5m?: number | null
          price_change_1h?: number | null
          price_change_24h?: number | null
          txn_buys_5m?: number | null
          txn_sells_5m?: number | null
          dex_id?: string | null
          pair_address?: string | null
          source?: string | null
        }
        Update: {
          id?: number
          time?: string
          token_address?: string
          token_symbol?: string | null
          price_usd?: number | null
          price_native?: number | null
          volume_5m?: number | null
          volume_1h?: number | null
          volume_24h?: number | null
          liquidity_usd?: number | null
          market_cap?: number | null
          price_change_5m?: number | null
          price_change_1h?: number | null
          price_change_24h?: number | null
          txn_buys_5m?: number | null
          txn_sells_5m?: number | null
          dex_id?: string | null
          pair_address?: string | null
          source?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: number
          created_at: string
          event_type: string
          description: string
          metadata: Json | null
        }
        Insert: {
          id?: number
          created_at?: string
          event_type: string
          description: string
          metadata?: Json | null
        }
        Update: {
          id?: number
          created_at?: string
          event_type?: string
          description?: string
          metadata?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
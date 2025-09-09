export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      calls: {
        Row: {
          id: string
          created_at: string
          message_id: string
          raw_message: string
          token_symbol: string | null
          parsed_at: string
          is_valid: boolean
          metadata: Json | null
          call_type: string | null
          token_name: string | null
          contract_address: string | null
          blockchain: string | null
          sqdgn_label: string | null
          creation_date: string | null
          token_age: string | null
          market_cap: number | null
          liquidity: number | null
          volume_24h: number | null
          dex_screener_url: string | null
          jupiter_url: string | null
          raydium_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          message_id: string
          raw_message: string
          token_symbol?: string | null
          parsed_at?: string
          is_valid?: boolean
          metadata?: Json | null
          call_type?: string | null
          token_name?: string | null
          contract_address?: string | null
          blockchain?: string | null
          sqdgn_label?: string | null
          creation_date?: string | null
          token_age?: string | null
          market_cap?: number | null
          liquidity?: number | null
          volume_24h?: number | null
          dex_screener_url?: string | null
          jupiter_url?: string | null
          raydium_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          message_id?: string
          raw_message?: string
          token_symbol?: string | null
          parsed_at?: string
          is_valid?: boolean
          metadata?: Json | null
          call_type?: string | null
          token_name?: string | null
          contract_address?: string | null
          blockchain?: string | null
          sqdgn_label?: string | null
          creation_date?: string | null
          token_age?: string | null
          market_cap?: number | null
          liquidity?: number | null
          volume_24h?: number | null
          dex_screener_url?: string | null
          jupiter_url?: string | null
          raydium_url?: string | null
        }
      }
      performance_metrics: {
        Row: {
          id: string
          call_id: string
          outcome: string | null
          actual_multiplier: number | null
          pnl_percentage: number | null
          execution_price: number | null
          exit_price: number | null
          duration_hours: number | null
          calculated_at: string
          is_simulation: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          call_id: string
          outcome?: string | null
          actual_multiplier?: number | null
          pnl_percentage?: number | null
          execution_price?: number | null
          exit_price?: number | null
          duration_hours?: number | null
          calculated_at?: string
          is_simulation?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          call_id?: string
          outcome?: string | null
          actual_multiplier?: number | null
          pnl_percentage?: number | null
          execution_price?: number | null
          exit_price?: number | null
          duration_hours?: number | null
          calculated_at?: string
          is_simulation?: boolean
          notes?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string
          event_type: string
          entity_type: string
          entity_id: string | null
          user_id: string | null
          details: Json | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          event_type: string
          entity_type: string
          entity_id?: string | null
          user_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          event_type?: string
          entity_type?: string
          entity_id?: string | null
          user_id?: string | null
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Views: {
      calls_with_performance: {
        Row: {
          id: string
          created_at: string
          message_id: string
          raw_message: string
          token_symbol: string | null
          parsed_at: string
          is_valid: boolean
          metadata: Json | null
          call_type: string | null
          token_name: string | null
          contract_address: string | null
          blockchain: string | null
          sqdgn_label: string | null
          creation_date: string | null
          token_age: string | null
          market_cap: number | null
          liquidity: number | null
          volume_24h: number | null
          dex_screener_url: string | null
          jupiter_url: string | null
          raydium_url: string | null
          current_price_usd: number | null
          price_updated_at: string | null
          current_market_cap: number | null
          market_cap_updated_at: string | null
          outcome: string | null
          actual_multiplier: number | null
          pnl_percentage: number | null
          duration_hours: number | null
          is_simulation: boolean | null
        }
        Insert: {
          [_ in never]: never
        }
        Update: {
          [_ in never]: never
        }
      }
    }
    Functions: {
      get_dashboard_metrics: {
        Args: {
          p_start_date?: string | null
          p_end_date?: string | null
          p_token_symbol?: string | null
        }
        Returns: {
          total_calls: number
          valid_calls: number
          win_rate: number
          avg_multiplier: number
          total_pnl: number
        }[]
      }
      get_token_performance: {
        Args: {
          p_limit?: number
          p_min_calls?: number
        }
        Returns: {
          token_symbol: string
          total_calls: number
          valid_calls: number
          win_rate: number
          avg_multiplier: number
          total_pnl: number
          last_call_at: string
        }[]
      }
      get_daily_metrics: {
        Args: {
          p_days?: number
          p_token_symbol?: string | null
        }
        Returns: {
          date: string
          total_calls: number
          valid_calls: number
          win_rate: number
          avg_multiplier: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
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
      auto_buy_queue: {
        Row: {
          id: string
          call_id: string | null
          user_wallet_address: string
          token_address: string | null
          token_symbol: string
          buy_amount_sol: number
          max_price: number | null
          slippage_bps: number
          status: string
          error_message: string | null
          trade_id: string | null
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          call_id?: string | null
          user_wallet_address: string
          token_address?: string | null
          token_symbol: string
          buy_amount_sol: number
          max_price?: number | null
          slippage_bps?: number
          status?: string
          error_message?: string | null
          trade_id?: string | null
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          call_id?: string | null
          user_wallet_address?: string
          token_address?: string | null
          token_symbol?: string
          buy_amount_sol?: number
          max_price?: number | null
          slippage_bps?: number
          status?: string
          error_message?: string | null
          trade_id?: string | null
          created_at?: string
          processed_at?: string | null
        }
      }
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
          message_timestamp: string | null
          confidence: number | null
          initial_price_usd: number | null
          current_price_usd: number | null
          initial_market_cap: number | null
          current_market_cap: number | null
          price_updated_at: string | null
          market_cap_updated_at: string | null
          channel: string
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
          message_timestamp?: string | null
          confidence?: number | null
          initial_price_usd?: number | null
          current_price_usd?: number | null
          initial_market_cap?: number | null
          current_market_cap?: number | null
          price_updated_at?: string | null
          market_cap_updated_at?: string | null
          channel?: string
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
          message_timestamp?: string | null
          confidence?: number | null
          initial_price_usd?: number | null
          current_price_usd?: number | null
          initial_market_cap?: number | null
          current_market_cap?: number | null
          price_updated_at?: string | null
          market_cap_updated_at?: string | null
          channel?: string
        }
      }
      price_alerts: {
        Row: {
          id: string
          position_id: string | null
          user_wallet_address: string
          token_address: string
          alert_type: string
          target_price: number
          is_active: boolean
          triggered_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          position_id?: string | null
          user_wallet_address: string
          token_address: string
          alert_type: string
          target_price: number
          is_active?: boolean
          triggered_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          position_id?: string | null
          user_wallet_address?: string
          token_address?: string
          alert_type?: string
          target_price?: number
          is_active?: boolean
          triggered_at?: string | null
          created_at?: string
        }
      }
      trade_history: {
        Row: {
          id: string
          position_id: string | null
          user_wallet_address: string
          token_address: string
          token_symbol: string | null
          trade_type: string
          amount_sol: number
          amount_tokens: number
          price: number
          slippage_bps: number | null
          price_impact_pct: number | null
          tx_signature: string | null
          tx_status: string
          error_message: string | null
          jupiter_quote: Json | null
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          position_id?: string | null
          user_wallet_address: string
          token_address: string
          token_symbol?: string | null
          trade_type: string
          amount_sol: number
          amount_tokens: number
          price: number
          slippage_bps?: number | null
          price_impact_pct?: number | null
          tx_signature?: string | null
          tx_status?: string
          error_message?: string | null
          jupiter_quote?: Json | null
          created_at?: string
          confirmed_at?: string | null
        }
        Update: {
          id?: string
          position_id?: string | null
          user_wallet_address?: string
          token_address?: string
          token_symbol?: string | null
          trade_type?: string
          amount_sol?: number
          amount_tokens?: number
          price?: number
          slippage_bps?: number | null
          price_impact_pct?: number | null
          tx_signature?: string | null
          tx_status?: string
          error_message?: string | null
          jupiter_quote?: Json | null
          created_at?: string
          confirmed_at?: string | null
        }
      }
      trading_positions: {
        Row: {
          id: string
          user_wallet_address: string
          token_address: string
          token_symbol: string | null
          entry_price: number
          entry_amount_sol: number
          entry_amount_tokens: number
          current_price: number | null
          current_value_sol: number | null
          realized_pnl_sol: number
          unrealized_pnl_sol: number
          unrealized_pnl_percentage: number
          highest_price: number | null
          stop_loss_price: number | null
          take_profit_price: number | null
          trailing_stop_percentage: number | null
          status: string
          entry_tx_signature: string | null
          exit_tx_signature: string | null
          exit_price: number | null
          exit_amount_sol: number | null
          exit_reason: string | null
          call_id: string | null
          opened_at: string
          closed_at: string | null
          last_updated: string
        }
        Insert: {
          id?: string
          user_wallet_address: string
          token_address: string
          token_symbol?: string | null
          entry_price: number
          entry_amount_sol: number
          entry_amount_tokens: number
          current_price?: number | null
          current_value_sol?: number | null
          realized_pnl_sol?: number
          unrealized_pnl_sol?: number
          unrealized_pnl_percentage?: number
          highest_price?: number | null
          stop_loss_price?: number | null
          take_profit_price?: number | null
          trailing_stop_percentage?: number | null
          status?: string
          entry_tx_signature?: string | null
          exit_tx_signature?: string | null
          exit_price?: number | null
          exit_amount_sol?: number | null
          exit_reason?: string | null
          call_id?: string | null
          opened_at?: string
          closed_at?: string | null
          last_updated?: string
        }
        Update: {
          id?: string
          user_wallet_address?: string
          token_address?: string
          token_symbol?: string | null
          entry_price?: number
          entry_amount_sol?: number
          entry_amount_tokens?: number
          current_price?: number | null
          current_value_sol?: number | null
          realized_pnl_sol?: number
          unrealized_pnl_sol?: number
          unrealized_pnl_percentage?: number
          highest_price?: number | null
          stop_loss_price?: number | null
          take_profit_price?: number | null
          trailing_stop_percentage?: number | null
          status?: string
          entry_tx_signature?: string | null
          exit_tx_signature?: string | null
          exit_price?: number | null
          exit_amount_sol?: number | null
          exit_reason?: string | null
          call_id?: string | null
          opened_at?: string
          closed_at?: string | null
          last_updated?: string
        }
      }
      trailing_stops: {
        Row: {
          id: string
          position_id: string
          highest_price: number
          current_stop_price: number
          trailing_percentage: number
          is_active: boolean
          last_checked_at: string
          triggered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          position_id: string
          highest_price: number
          current_stop_price: number
          trailing_percentage: number
          is_active?: boolean
          last_checked_at?: string
          triggered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          position_id?: string
          highest_price?: number
          current_stop_price?: number
          trailing_percentage?: number
          is_active?: boolean
          last_checked_at?: string
          triggered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_trading_config: {
        Row: {
          id: string
          user_wallet_address: string
          telegram_user_id: string | null
          is_auto_buy_enabled: boolean
          default_buy_amount_sol: number
          max_position_size_sol: number
          default_slippage_bps: number
          max_slippage_bps: number
          trailing_stop_enabled: boolean
          trailing_stop_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_wallet_address: string
          telegram_user_id?: string | null
          is_auto_buy_enabled?: boolean
          default_buy_amount_sol?: number
          max_position_size_sol?: number
          default_slippage_bps?: number
          max_slippage_bps?: number
          trailing_stop_enabled?: boolean
          trailing_stop_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_wallet_address?: string
          telegram_user_id?: string | null
          is_auto_buy_enabled?: boolean
          default_buy_amount_sol?: number
          max_position_size_sol?: number
          default_slippage_bps?: number
          max_slippage_bps?: number
          trailing_stop_enabled?: boolean
          trailing_stop_percentage?: number
          created_at?: string
          updated_at?: string
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
      token_price_snapshots_5m: {
        Row: {
          id: string
          time: string
          token_address: string
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
          id?: string
          time: string
          token_address: string
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
          id?: string
          time?: string
          token_address?: string
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
          channel: string
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
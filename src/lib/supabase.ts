import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserStrategy {
  id: string;
  user_address: string;
  strategy_type: 'safe' | 'aggressive' | 'stable';
  is_active: boolean;
  auto_swap_enabled: boolean;
  min_swap_amount: number;
  created_at: string;
  updated_at: string;
}

export interface SwapHistory {
  id: string;
  user_address: string;
  from_token: string;
  to_token: string;
  from_amount: number;
  to_amount: number;
  shift_id: string | null;
  status: 'pending' | 'completed' | 'failed';
  profit_loss: number;
  strategy_type: string;
  created_at: string;
}

export interface PortfolioSnapshot {
  id: string;
  user_address: string;
  total_value_usd: number;
  tokens: Record<string, number>;
  created_at: string;
}

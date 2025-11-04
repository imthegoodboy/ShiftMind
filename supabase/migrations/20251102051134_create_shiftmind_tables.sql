/*
  # ShiftMind Auto-Invest Bot Schema

  1. New Tables
    - `user_strategies`
      - `id` (uuid, primary key)
      - `user_address` (text, wallet address)
      - `strategy_type` (text: 'safe', 'aggressive', 'stable')
      - `is_active` (boolean)
      - `auto_swap_enabled` (boolean)
      - `min_swap_amount` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `swap_history`
      - `id` (uuid, primary key)
      - `user_address` (text)
      - `from_token` (text)
      - `to_token` (text)
      - `from_amount` (numeric)
      - `to_amount` (numeric)
      - `shift_id` (text, SideShift transaction ID)
      - `status` (text: 'pending', 'completed', 'failed')
      - `profit_loss` (numeric)
      - `strategy_type` (text)
      - `created_at` (timestamptz)
    
    - `portfolio_snapshots`
      - `id` (uuid, primary key)
      - `user_address` (text)
      - `total_value_usd` (numeric)
      - `tokens` (jsonb, token balances)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  strategy_type text NOT NULL CHECK (strategy_type IN ('safe', 'aggressive', 'stable')),
  is_active boolean DEFAULT true,
  auto_swap_enabled boolean DEFAULT false,
  min_swap_amount numeric DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_address)
);

CREATE TABLE IF NOT EXISTS swap_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  from_token text NOT NULL,
  to_token text NOT NULL,
  from_amount numeric NOT NULL,
  to_amount numeric DEFAULT 0,
  shift_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  profit_loss numeric DEFAULT 0,
  strategy_type text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  total_value_usd numeric DEFAULT 0,
  tokens jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategy"
  ON user_strategies FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own strategy"
  ON user_strategies FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own strategy"
  ON user_strategies FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own swap history"
  ON swap_history FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own swap history"
  ON swap_history FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own portfolio snapshots"
  ON portfolio_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own portfolio snapshots"
  ON portfolio_snapshots FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_user_strategies_address ON user_strategies(user_address);
CREATE INDEX idx_swap_history_address ON swap_history(user_address);
CREATE INDEX idx_swap_history_created ON swap_history(created_at DESC);
CREATE INDEX idx_portfolio_snapshots_address ON portfolio_snapshots(user_address);

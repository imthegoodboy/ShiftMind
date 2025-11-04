/*
  # ShiftMind Production Schema - Core Tables

  1. New Tables
    - `users`: Store user accounts and preferences
    - `user_wallets`: Track connected wallets and chain support
    - `trading_strategies`: Store strategy configurations
    - `market_signals`: Store AI-generated market analysis
    - `swap_transactions`: Complete swap history and status
    - `portfolio_holdings`: Current user holdings
    - `price_history`: Historical price data for analysis
    - `alerts_notifications`: User notifications and alerts
    - `ai_predictions`: Store AI market predictions

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Service role can update market data and signals
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL UNIQUE,
  display_name text,
  email text UNIQUE,
  email_verified boolean DEFAULT false,
  strategy_preference text DEFAULT 'safe' CHECK (strategy_preference IN ('safe', 'balanced', 'aggressive')),
  auto_swap_enabled boolean DEFAULT false,
  total_volume_traded numeric DEFAULT 0,
  total_profit_loss numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address text NOT NULL,
  chain text NOT NULL CHECK (chain IN ('polygon', 'ethereum', 'arbitrum', 'optimism')),
  balance numeric DEFAULT 0,
  is_primary boolean DEFAULT false,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallet_address, chain)
);

CREATE TABLE IF NOT EXISTS trading_strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('safe', 'balanced', 'aggressive')),
  description text,
  config jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

CREATE TABLE IF NOT EXISTS market_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_token text NOT NULL,
  to_token text NOT NULL,
  action text NOT NULL CHECK (action IN ('buy', 'sell', 'hold', 'swap')),
  confidence numeric DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
  reason text,
  market_data jsonb DEFAULT '{}',
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS swap_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shift_id text UNIQUE,
  from_token text NOT NULL,
  to_token text NOT NULL,
  from_amount numeric NOT NULL,
  to_amount numeric DEFAULT 0,
  from_chain text NOT NULL,
  to_chain text NOT NULL,
  deposit_address text,
  settle_address text NOT NULL,
  rate numeric,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'completed', 'failed', 'cancelled')),
  error_message text,
  strategy_type text,
  profit_loss numeric DEFAULT 0,
  profit_loss_percentage numeric DEFAULT 0,
  transaction_hash text,
  execution_time_seconds integer,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text NOT NULL,
  chain text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  value_usd numeric DEFAULT 0,
  percentage_of_portfolio numeric DEFAULT 0,
  entry_price numeric,
  current_price numeric,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, token, chain)
);

CREATE TABLE IF NOT EXISTS price_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL,
  price_usd numeric NOT NULL,
  market_cap numeric,
  volume_24h numeric,
  change_24h numeric,
  change_7d numeric,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('swap_executed', 'swap_failed', 'price_alert', 'profit_milestone', 'ai_signal', 'warning', 'info')),
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  related_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

CREATE TABLE IF NOT EXISTS ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prediction_type text NOT NULL CHECK (prediction_type IN ('price_direction', 'swap_opportunity', 'market_volatility')),
  token text NOT NULL,
  prediction_data jsonb NOT NULL,
  confidence numeric DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 1),
  accuracy_score numeric,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  key_hash text NOT NULL UNIQUE,
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource_type text,
  resource_id text,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own wallets"
  ON user_wallets FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own wallets"
  ON user_wallets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own strategies"
  ON trading_strategies FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own strategies"
  ON trading_strategies FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own strategies"
  ON trading_strategies FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own signals"
  ON market_signals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own swaps"
  ON swap_transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own holdings"
  ON portfolio_holdings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own notifications"
  ON alerts_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON alerts_notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own predictions"
  ON ai_predictions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Public price history read"
  ON price_history FOR SELECT
  USING (true);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_created ON users(created_at DESC);
CREATE INDEX idx_user_wallets_user ON user_wallets(user_id);
CREATE INDEX idx_strategies_user ON trading_strategies(user_id);
CREATE INDEX idx_market_signals_user ON market_signals(user_id);
CREATE INDEX idx_market_signals_expires ON market_signals(expires_at);
CREATE INDEX idx_swap_transactions_user ON swap_transactions(user_id);
CREATE INDEX idx_swap_transactions_status ON swap_transactions(status);
CREATE INDEX idx_swap_transactions_created ON swap_transactions(created_at DESC);
CREATE INDEX idx_portfolio_holdings_user ON portfolio_holdings(user_id);
CREATE INDEX idx_price_history_token ON price_history(token);
CREATE INDEX idx_price_history_timestamp ON price_history(timestamp DESC);
CREATE INDEX idx_alerts_user ON alerts_notifications(user_id);
CREATE INDEX idx_alerts_status ON alerts_notifications(status);
CREATE INDEX idx_ai_predictions_user ON ai_predictions(user_id);
CREATE INDEX idx_ai_predictions_expires ON ai_predictions(expires_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import WalletConnect from './components/WalletConnect';
import StrategySelector from './components/StrategySelector';
import Dashboard from './components/Dashboard';
import { connectWallet, getConnectedAccount, onAccountsChanged, removeAccountsChangedListener } from './services/wallet';
import { supabase, UserStrategy, SwapHistory } from './lib/supabase';
import { getTokenPrices, TokenPrice } from './services/prices';
import { analyzeMarket, SwapRecommendation } from './services/aiStrategy';
import { POPULAR_TOKENS } from './services/sideshift';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [strategy, setStrategy] = useState<UserStrategy | null>(null);
  const [swapHistory, setSwapHistory] = useState<SwapHistory[]>([]);
  const [prices, setPrices] = useState<Record<string, TokenPrice>>({});
  const [recommendation, setRecommendation] = useState<SwapRecommendation | null>(null);
  const [hasSelectedStrategy, setHasSelectedStrategy] = useState(false);

  useEffect(() => {
    checkConnection();

    const handleAccountChange = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
        setStrategy(null);
        setSwapHistory([]);
        setHasSelectedStrategy(false);
      } else {
        setAccount(accounts[0]);
        loadUserData(accounts[0]);
      }
    };

    onAccountsChanged(handleAccountChange);

    return () => {
      removeAccountsChangedListener(handleAccountChange);
    };
  }, []);

  useEffect(() => {
    if (account) {
      loadUserData(account);
    }
  }, [account]);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (strategy && prices && Object.keys(prices).length > 0) {
      const currentToken = 'eth';
      const rec = analyzeMarket(prices, strategy.strategy_type, currentToken);
      setRecommendation(rec);

      if (strategy.auto_swap_enabled && rec.shouldSwap && rec.confidence > 0.7) {
        recordDemoSwap(rec);
      }
    }
  }, [prices, strategy]);

  async function checkConnection() {
    const connectedAccount = await getConnectedAccount();
    if (connectedAccount) {
      setAccount(connectedAccount);
      loadUserData(connectedAccount);
    }
  }

  async function handleConnect() {
    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setAccount(address);
      await loadUserData(address);
    } catch (error) {
      console.error('Connection error:', error);
      alert(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }

  async function loadUserData(address: string) {
    const { data: strategyData } = await supabase
      .from('user_strategies')
      .select('*')
      .eq('user_address', address)
      .maybeSingle();

    if (strategyData) {
      setStrategy(strategyData);
      setHasSelectedStrategy(true);
    }

    const { data: historyData } = await supabase
      .from('swap_history')
      .select('*')
      .eq('user_address', address)
      .order('created_at', { ascending: false })
      .limit(50);

    if (historyData) {
      setSwapHistory(historyData);
    }
  }

  async function loadPrices() {
    try {
      const symbols = POPULAR_TOKENS.map(t => t.sideshift);
      const priceData = await getTokenPrices(symbols);
      setPrices(priceData);
    } catch (error) {
      console.error('Failed to load prices:', error);
    }
  }

  async function handleSelectStrategy(strategyType: 'safe' | 'aggressive' | 'stable') {
    if (!account) return;

    const { data, error } = await supabase
      .from('user_strategies')
      .upsert({
        user_address: account,
        strategy_type: strategyType,
        is_active: true,
        auto_swap_enabled: false,
        min_swap_amount: 10,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_address'
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving strategy:', error);
      alert('Failed to save strategy');
      return;
    }

    if (data) {
      setStrategy(data);
      setHasSelectedStrategy(true);
    }
  }

  async function handleToggleAutoSwap() {
    if (!account || !strategy) return;

    const newAutoSwapEnabled = !strategy.auto_swap_enabled;

    const { data, error } = await supabase
      .from('user_strategies')
      .update({
        auto_swap_enabled: newAutoSwapEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq('user_address', account)
      .select()
      .single();

    if (error) {
      console.error('Error toggling auto-swap:', error);
      alert('Failed to toggle auto-swap');
      return;
    }

    if (data) {
      setStrategy(data);
    }
  }

  async function recordDemoSwap(rec: SwapRecommendation) {
    if (!account || !strategy) return;

    const existingPendingSwap = swapHistory.find(
      s => s.from_token === rec.fromToken && s.to_token === rec.toToken && s.status === 'pending'
    );

    if (existingPendingSwap) {
      return;
    }

    const fromAmount = 0.1;
    const toAmount = fromAmount * 0.997;
    const profitLoss = Math.random() * 10 - 2;

    const { data, error } = await supabase
      .from('swap_history')
      .insert({
        user_address: account,
        from_token: rec.fromToken,
        to_token: rec.toToken,
        from_amount: fromAmount,
        to_amount: toAmount,
        status: 'completed',
        profit_loss: profitLoss,
        strategy_type: strategy.strategy_type,
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording swap:', error);
      return;
    }

    if (data) {
      setSwapHistory(prev => [data, ...prev]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <WalletConnect account={account} onConnect={handleConnect} isConnecting={isConnecting} />
        </div>

        <Hero />

        {!account && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Connect your wallet to get started</p>
            <p className="text-sm text-gray-500">
              You'll need MetaMask installed and connected to Polygon Network
            </p>
          </div>
        )}

        {account && !hasSelectedStrategy && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Choose Your Strategy</h2>
            <StrategySelector
              selectedStrategy={strategy?.strategy_type || null}
              onSelectStrategy={handleSelectStrategy}
            />
          </div>
        )}

        {account && hasSelectedStrategy && strategy && (
          <Dashboard
            swapHistory={swapHistory}
            prices={prices}
            recommendation={recommendation}
            strategyType={strategy.strategy_type}
            autoSwapEnabled={strategy.auto_swap_enabled}
            onToggleAutoSwap={handleToggleAutoSwap}
          />
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Built with Polygon Network & SideShift.ai | For educational purposes</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

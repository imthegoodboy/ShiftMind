import { useState, useEffect, useCallback } from 'react';
import WalletConnect from './components/WalletConnect';
import StrategySelector from './components/StrategySelector';
import Navbar from './components/Navbar';
import ManualSwapModal from './components/ManualSwapModal';
import SplashScreen from './components/SplashScreen';
import HomePage from './pages/Home';
import SwapsPage from './pages/Swaps';
import AboutPage from './pages/About';
import SettingsPage from './pages/Settings';
import Chatbot from './components/Chatbot';
import { connectWallet, getConnectedAccount, onAccountsChanged, removeAccountsChangedListener } from './services/wallet';
import { supabase } from './lib/supabase';
import { getTokenPrices, TokenPrice, getPriceHistory } from './services/prices';
import { AISignal, aiTrader } from './services/advancedAI';
import { swapManager } from './services/swapManager';
import { SUPPORTED_TOKENS } from './services/sideshift';

interface UserProfile {
  id: string;
  wallet_address: string;
  strategy_preference: 'safe' | 'balanced' | 'aggressive';
  auto_swap_enabled: boolean;
  total_volume_traded: number;
  total_profit_loss: number;
}

interface AppState {
  account: string | null;
  isConnecting: boolean;
  isLoadingData: boolean;
  userProfile: UserProfile | null;
  strategyType: 'safe' | 'balanced' | 'aggressive';
  prices: Record<string, TokenPrice>;
  signal: AISignal | null;
  swapHistory: any[];
  portfolioValue: number;
  totalProfit: number;
  autoSwapEnabled: boolean;
  error: string | null;
}

function AppProduction() {
  const [state, setState] = useState<AppState>({
    account: null,
    isConnecting: false,
    isLoadingData: false,
    userProfile: null,
    strategyType: 'safe',
    prices: {},
    signal: null,
    swapHistory: [],
    portfolioValue: 0,
    totalProfit: 0,
    autoSwapEnabled: false,
    error: null,
  });
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState<'home' | 'swaps' | 'about' | 'settings' | 'manual'>('home');
  const [toggling, setToggling] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [defaultFrom, setDefaultFrom] = useState<string>(() => localStorage.getItem('default_from_token') || 'eth');
  const [defaultTo, setDefaultTo] = useState<string>(() => localStorage.getItem('default_to_token') || 'btc');

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (state.account) {
      loadUserProfile(state.account);
      loadSwapHistory(state.account);
      setupPriceRefresh();
    }
  }, [state.account]);

  useEffect(() => {
    if (state.prices && Object.keys(state.prices).length > 0 && state.strategyType) {
      analyzeMarketAndGenerateSignal();
    }
  }, [state.prices, state.strategyType]);

  async function initializeApp() {
    try {
      const connectedAccount = await getConnectedAccount();
      if (connectedAccount) {
        updateState({ account: connectedAccount });
      }
      setTimeout(() => setShowSplash(false), 900);

      const handleAccountChange = (accounts: string[]) => {
        if (accounts.length === 0) {
          updateState({
            account: null,
            userProfile: null,
            swapHistory: [],
            signal: null,
            error: null,
          });
        } else {
          updateState({ account: accounts[0] });
        }
      };

      onAccountsChanged(handleAccountChange);

      return () => {
        removeAccountsChangedListener(handleAccountChange);
      };
    } catch (error) {
      console.error('Initialization error:', error);
      updateState({
        error: error instanceof Error ? error.message : 'Initialization failed',
      });
    }
  }

  function setupPriceRefresh() {
    loadPrices();
    const interval = setInterval(loadPrices, 60000);
    return () => clearInterval(interval);
  }

  async function loadPrices() {
    try {
      const symbols = SUPPORTED_TOKENS.map(t => t.sideshift);
      const priceData = await getTokenPrices(symbols);
      updateState({ prices: priceData, error: null });
    } catch (error) {
      console.error('Failed to load prices:', error);
      updateState({
        error: error instanceof Error ? error.message : 'Failed to load prices',
      });
    }
  }

  async function loadUserProfile(address: string) {
    try {
      updateState({ isLoadingData: true });

      // Use lightweight strategy table keyed by wallet address to avoid RLS/auth
      const { data: strategyRow, error } = await supabase
        .from('user_strategies')
        .select('*')
        .eq('user_address', address)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!strategyRow) {
        const { error: createStrategyError } = await supabase
          .from('user_strategies')
          .insert([
            {
              user_address: address,
              strategy_type: 'stable',
              auto_swap_enabled: false,
              is_active: true,
            },
          ])
          .select()
          .single();

        if (createStrategyError) throw createStrategyError;

        updateState({
          userProfile: {
            id: address,
            wallet_address: address,
            strategy_preference: 'balanced',
            auto_swap_enabled: false,
            total_volume_traded: 0,
            total_profit_loss: 0,
          },
          strategyType: 'balanced',
        });
      } else {
        updateState({
          userProfile: {
            id: address,
            wallet_address: address,
            strategy_preference: (strategyRow.strategy_type === 'stable' ? 'balanced' : strategyRow.strategy_type) ?? 'balanced',
            auto_swap_enabled: strategyRow.auto_swap_enabled ?? false,
            total_volume_traded: 0,
            total_profit_loss: 0,
          },
          strategyType: ((strategyRow.strategy_type === 'stable' ? 'balanced' : strategyRow.strategy_type) ?? 'balanced') as 'safe' | 'balanced' | 'aggressive',
          autoSwapEnabled: strategyRow.auto_swap_enabled ?? false,
        });
      }

      updateState({ isLoadingData: false });
    } catch (error) {
      console.error('Failed to load user profile:', error);
      updateState({
        error: error instanceof Error ? error.message : 'Failed to load profile',
        isLoadingData: false,
      });
    }
  }

  async function loadSwapHistory(address: string) {
    try {
      // Read from simple history table keyed by wallet address to avoid UUID casting
      const { data: swaps, error } = await supabase
        .from('swap_history')
        .select('*')
        .eq('user_address', address)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      const totalProfit = swaps
        .filter((s: any) => s.status === 'completed')
        .reduce((sum: number, s: any) => sum + (s.profit_loss || 0), 0);

      updateState({
        swapHistory: swaps,
        totalProfit,
      });
    } catch (error) {
      console.error('Failed to load swap history:', error);
    }
  }

  async function analyzeMarketAndGenerateSignal() {
    try {
      const mainToken = 'eth';
      const mainPrice = state.prices[mainToken];

      if (!mainPrice) return;

      const priceHistory = await getPriceHistory('eth', 7);

      const signal = aiTrader.generateSignal(
        'ETH',
        mainPrice,
        priceHistory,
        state.strategyType,
        state.prices
      );

      updateState({ signal });

      if (state.autoSwapEnabled && signal.action !== 'hold' && signal.confidence > 0.75) {
        handleAutoSwap(signal);
      }
    } catch (error) {
      console.error('Failed to analyze market:', error);
    }
  }

  async function handleConnect() {
    updateState({ isConnecting: true, error: null });
    try {
      const address = await connectWallet();
      updateState({ account: address, isConnecting: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      updateState({ isConnecting: false, error: errorMessage });
    }
  }

  async function handleSelectStrategy(strategyType: 'safe' | 'stable' | 'aggressive') {
    if (!state.account) return;

    try {
      const { error } = await supabase
        .from('user_strategies')
        .upsert({
          user_address: state.account,
          strategy_type: strategyType,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_address' });

      if (error) throw error;

      updateState({
        strategyType: (strategyType === 'stable' ? 'balanced' : strategyType) as 'safe' | 'balanced' | 'aggressive',
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save strategy';
      updateState({ error: errorMessage });
    }
  }

  async function handleToggleAutoSwap() {
    if (!state.account) return;

    try {
      setToggling(true);
      const newAutoSwapEnabled = !state.autoSwapEnabled;

      const { error } = await supabase
        .from('user_strategies')
        .upsert({
          user_address: state.account,
          auto_swap_enabled: newAutoSwapEnabled,
          strategy_type: (state.strategyType === 'balanced' ? 'stable' : state.strategyType) || 'stable',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_address' });

      if (error) throw error;

      updateState({ autoSwapEnabled: newAutoSwapEnabled, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle auto-swap';
      updateState({ error: errorMessage });
    } finally { setToggling(false); }
  }

  async function handleAutoSwap(signal: AISignal) {
    if (!state.account || !state.userProfile) return;

    try {
      const result = await swapManager.initiateSwap({
        userId: state.userProfile.id,
        fromToken: defaultFrom || signal.fromToken,
        toToken: defaultTo || signal.toToken,
        amount: 0.01,
        walletAddress: state.account,
        strategyType: state.strategyType,
      });

      if (!result.success) {
        console.error('Auto swap failed:', result.error);
        return;
      }

      await loadSwapHistory(state.account);
    } catch (error) {
      console.error('Auto swap error:', error);
    }
  }

  function handleExecuteSignal() {
    if (!state.signal) return;
    handleAutoSwap(state.signal);
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {showSplash && <SplashScreen />}
      <div className="container mx-auto px-4 py-8">
        <Navbar currentPage={page} onNavigate={setPage} account={state.account} />
        <div className="flex justify-end mb-6">
          <WalletConnect account={state.account} onConnect={handleConnect} isConnecting={state.isConnecting} />
        </div>

        {state.error && (
          <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{state.error}</p>
          </div>
        )}

        {page === 'home' && (
          <>
            <HomePage />
            {!state.account && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-300 mb-4">Connect your wallet to get started</p>
                <p className="text-sm text-gray-400">
                  Powered by Polygon Network, SideShift.ai, and advanced AI analysis
                </p>
              </div>
            )}
          </>
        )}

        {state.account && !state.userProfile && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full"></div>
            </div>
            <p className="text-gray-400 ml-3">Loading profile...</p>
          </div>
        )}

        {state.account && state.userProfile && !state.userProfile.strategy_preference && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Choose Your Strategy</h2>
            <StrategySelector
              selectedStrategy={(state.strategyType === 'balanced' ? 'stable' : state.strategyType) as 'safe' | 'aggressive' | 'stable' | null}
              onSelectStrategy={handleSelectStrategy as any}
            />
          </div>
        )}

        {page === 'swaps' && (
          <SwapsPage
            walletAddress={state.account}
            isLoading={state.isLoadingData}
            userHasProfile={!!state.userProfile}
            strategyType={state.strategyType as 'safe' | 'balanced' | 'aggressive'}
            autoSwapEnabled={state.autoSwapEnabled}
            onToggleAutoSwap={handleToggleAutoSwap}
            onExecuteSignal={() => handleExecuteSignal()}
            onReviewSignal={() => setReviewOpen(true)}
            signal={state.signal}
            prices={state.prices}
            portfolioValue={state.portfolioValue}
            totalProfit={state.totalProfit}
            swaps={state.swapHistory}
          />
        )}

        {page === 'manual' && (
          // Manual swap page – reuse the modal UI in a dedicated page
          <div className="py-6">
            <h2 className="text-2xl font-bold text-white mb-4">Manual Swap</h2>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
              <p className="text-sm text-gray-300 mb-4">Use this page to perform manual swaps. Select tokens and amount, then create a swap.</p>
              <div>
                {/* Render the modal component in-page so users have a full page manual swap UX */}
                <ManualSwapModal
                  isOpen={true}
                  onClose={() => setPage('swaps')}
                  walletAddress={state.account}
                  strategyType={state.strategyType}
                />
              </div>
            </div>
          </div>
        )}

        {page === 'about' && <AboutPage />}
        {page === 'settings' && (
          <SettingsPage account={state.account} autoSwapEnabled={state.autoSwapEnabled} onToggleAutoSwap={handleToggleAutoSwap} />
        )}

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>ShiftMind - AI-Powered DeFi Auto-Invest Bot</p>
          <p>Powered by Polygon | SideShift.ai | CoinGecko | Supabase</p>
          <p className="mt-2 text-xs">For educational purposes only. Trade at your own risk.</p>
        </footer>
      </div>
      <Chatbot />

      {reviewOpen && state.signal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl p-6 bg-white">
            <h3 className="text-lg font-semibold mb-2">Review Signal</h3>
            <p className="text-sm text-gray-700 mb-4">{state.signal.reason}</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded bg-gray-100" onClick={() => setReviewOpen(false)}>Close</button>
              <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={() => { setReviewOpen(false); handleExecuteSignal(); }}>Execute</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppProduction;

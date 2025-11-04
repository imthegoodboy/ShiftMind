import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  Zap,
  DollarSign,
  Activity,
  ArrowDownLeft,
} from 'lucide-react';
import { TokenPrice } from '../services/prices';
import { AISignal } from '../services/advancedAI';

interface AdvancedDashboardProps {
  walletAddress: string;
  strategyType: 'safe' | 'balanced' | 'aggressive';
  autoSwapEnabled: boolean;
  onToggleAutoSwap: () => void;
  onExecuteSignal?: () => void;
  onReviewSignal?: () => void;
  toggling?: boolean;
  signal: AISignal | null;
  prices: Record<string, TokenPrice>;
  portfolioValue: number;
  totalProfit: number;
  swaps: any[];
  isLoading: boolean;
}

export default function AdvancedDashboard({
  walletAddress,
  strategyType,
  autoSwapEnabled,
  onToggleAutoSwap,
  onExecuteSignal,
  onReviewSignal,
  toggling,
  signal,
  portfolioValue,
  totalProfit,
  swaps,
  isLoading,
}: AdvancedDashboardProps) {
  const profitPercentage = portfolioValue > 0 ? (totalProfit / portfolioValue) * 100 : 0;
  const isPositive = totalProfit >= 0;

  const strategyConfig = {
    safe: {
      color: 'bg-blue-500',
      icon: '🛡️',
      description: 'Capital Protection Mode',
    },
    balanced: {
      color: 'bg-purple-500',
      icon: '⚖️',
      description: 'Balanced Growth',
    },
    aggressive: {
      color: 'bg-red-500',
      icon: '🚀',
      description: 'Maximum Growth',
    },
  };

  const config = strategyConfig[strategyType];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${portfolioValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Holdings</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Profit/Loss</p>
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <ArrowDownLeft className="w-5 h-5 text-red-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}${totalProfit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {profitPercentage.toFixed(2)}% return
          </p>
        </div>

        <div className={`${config.color} rounded-xl p-6 shadow-md text-white`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Active Strategy</p>
            <span className="text-2xl">{config.icon}</span>
          </div>
          <p className="text-2xl font-bold capitalize">{strategyType}</p>
          <p className="text-xs opacity-75 mt-1">{config.description}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Swaps</p>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{swaps.length}</p>
          <p className="text-xs text-gray-500 mt-1">
            {swaps.filter((s: any) => s.status === 'completed').length} completed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Market Signal
          </h3>

          {signal ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  signal.action === 'buy' || signal.action === 'swap'
                    ? 'border-green-200 bg-green-50'
                    : signal.action === 'sell'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        signal.action === 'buy' || signal.action === 'swap'
                          ? 'bg-green-500'
                          : signal.action === 'sell'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                      }`}
                    >
                      {signal.action.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">
                      {signal.fromToken} → {signal.toToken}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {(signal.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-3">{signal.reason}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white bg-opacity-60 p-2 rounded">
                    <p className="text-xs text-gray-600">Risk Level</p>
                    <p className="font-semibold capitalize">{signal.riskLevel}</p>
                  </div>
                  <div className="bg-white bg-opacity-60 p-2 rounded">
                    <p className="text-xs text-gray-600">Expected Gain</p>
                    <p className="font-semibold text-green-600">+{signal.expectedGain.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white bg-opacity-60 p-2 rounded">
                    <p className="text-xs text-gray-600">Timeframe</p>
                    <p className="font-semibold">{signal.timeframe}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={onExecuteSignal} className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors">
                  Execute Signal
                </button>
                <button onClick={onReviewSignal} className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors">
                  Review
                </button>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"></div>
              <p className="text-gray-600 mt-2">Analyzing market...</p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No signals available at this time</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Settings
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Auto-Swap</p>
                <button
                  onClick={onToggleAutoSwap}
                  disabled={!!toggling}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    autoSwapEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      autoSwapEnabled ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                {toggling && <span className="ml-2 text-xs text-gray-500">Saving…</span>}
              </div>
              <p className="text-xs text-gray-600">
                {autoSwapEnabled
                  ? 'AI will execute swaps automatically'
                  : 'Manual execution only'}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Wallet Address</p>
              <p className="text-xs font-mono text-gray-600 break-all">{walletAddress}</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-1">Pro Tip</p>
              <p className="text-xs text-blue-800">
                Enable auto-swap to let AI execute trades when confidence is high
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Swaps</h3>

        {swaps.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No swaps yet. Enable auto-swap to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {swaps.slice(0, 10).map((swap: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {swap.from_token?.toUpperCase()} → {swap.to_token?.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {swap.from_amount?.toFixed(4)} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      swap.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : swap.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {swap.status}
                  </span>
                  <span
                    className={`font-semibold text-sm ${
                      (swap.profit_loss || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {(swap.profit_loss || 0) >= 0 ? '+' : ''}
                    {(swap.profit_loss || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-xs text-gray-600 mb-1">Most Traded</p>
          <p className="font-bold text-gray-900">ETH</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-xs text-gray-600 mb-1">Best Return</p>
          <p className="font-bold text-green-600">+12.3%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-xs text-gray-600 mb-1">Success Rate</p>
          <p className="font-bold text-gray-900">87%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-xs text-gray-600 mb-1">Win Streak</p>
          <p className="font-bold text-gray-900">5</p>
        </div>
      </div>
    </div>
  );
}

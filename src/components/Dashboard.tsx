import { ArrowUpRight, ArrowDownRight, Activity, Clock } from 'lucide-react';
import { SwapHistory } from '../lib/supabase';
import { TokenPrice } from '../services/prices';
import { SwapRecommendation } from '../services/aiStrategy';

interface DashboardProps {
  swapHistory: SwapHistory[];
  prices: Record<string, TokenPrice>;
  recommendation: SwapRecommendation | null;
  strategyType: 'safe' | 'aggressive' | 'stable';
  autoSwapEnabled: boolean;
  onToggleAutoSwap: () => void;
}

export default function Dashboard({
  swapHistory,
  prices,
  recommendation,
  strategyType,
  autoSwapEnabled,
  onToggleAutoSwap,
}: DashboardProps) {
  const totalSwaps = swapHistory.length;
  const successfulSwaps = swapHistory.filter(s => s.status === 'completed').length;
  const totalProfitLoss = swapHistory.reduce((sum, swap) => sum + swap.profit_loss, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Swaps</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalSwaps}</p>
          <p className="text-sm text-gray-500 mt-1">{successfulSwaps} successful</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total P&L</h3>
            {totalProfitLoss >= 0 ? (
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-500" />
            )}
          </div>
          <p className={`text-3xl font-bold ${totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalProfitLoss >= 0 ? '+' : ''}${totalProfitLoss.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">All-time</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Strategy</h3>
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">{strategyType}</p>
          <div className="mt-3">
            <button
              onClick={onToggleAutoSwap}
              className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                autoSwapEnabled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Auto-Swap: {autoSwapEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {recommendation && (
        <div
          className={`p-6 rounded-xl border-2 ${
            recommendation.shouldSwap
              ? 'bg-blue-50 border-blue-200'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">AI Recommendation</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    recommendation.shouldSwap
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-400 text-white'
                  }`}
                >
                  {recommendation.shouldSwap ? 'SWAP SUGGESTED' : 'HOLD'}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{recommendation.reason}</p>
              {recommendation.shouldSwap && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-white rounded-lg border border-gray-300 font-mono text-sm">
                    {recommendation.fromToken.toUpperCase()}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                  <span className="px-3 py-1 bg-white rounded-lg border border-gray-300 font-mono text-sm">
                    {recommendation.toToken.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(recommendation.confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Swaps</h3>
        {swapHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No swaps yet. Enable auto-swap to get started!</p>
        ) : (
          <div className="space-y-3">
            {swapHistory.slice(0, 10).map((swap) => (
              <div
                key={swap.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-gray-900">
                      {swap.from_token.toUpperCase()}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                    <span className="font-mono font-semibold text-gray-900">
                      {swap.to_token.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {swap.from_amount.toFixed(4)} → {swap.to_amount.toFixed(4)}
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
                    className={`font-semibold ${
                      swap.profit_loss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {swap.profit_loss >= 0 ? '+' : ''}${swap.profit_loss.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(swap.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Live Prices</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(prices).map(([symbol, price]) => (
            <div key={symbol} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-600 mb-1">{symbol.toUpperCase()}</p>
              <p className="text-lg font-bold text-gray-900">${price.current_price.toLocaleString()}</p>
              <p
                className={`text-sm font-semibold ${
                  price.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {price.price_change_percentage_24h >= 0 ? '+' : ''}
                {price.price_change_percentage_24h.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

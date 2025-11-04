import { ArrowRight, BarChart, Shield, RefreshCw } from 'lucide-react';
import Hero from '../components/Hero';
import { SUPPORTED_TOKENS } from '../services/sideshift';

export default function HomePage() {
  const popularPairs = [
    { from: 'ETH', to: 'BTC' },
    { from: 'MATIC', to: 'USDT' },
    { from: 'BTC', to: 'ETH' },
    { from: 'USDC', to: 'ETH' },
  ];

  return (
    <div className="space-y-8">
      <Hero />
      
      {/* Quick Start Guide */}
      <div className="p-8 rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Get Started in Minutes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
            <div>
              <h3 className="font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-sm text-gray-300">Link your MetaMask or other Web3 wallet to start trading</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">2</div>
            <div>
              <h3 className="font-semibold text-white mb-2">Choose Strategy</h3>
              <p className="text-sm text-gray-300">Select your risk level and trading preferences</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">3</div>
            <div>
              <h3 className="font-semibold text-white mb-2">Start Trading</h3>
              <p className="text-sm text-gray-300">Execute manual swaps or enable auto-trading</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Trading Pairs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Popular Trading Pairs</h2>
          <div className="grid grid-cols-2 gap-4">
            {popularPairs.map((pair, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-blue-400">{pair.from}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="text-purple-400">{pair.to}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Supported Tokens</h2>
          <div className="grid grid-cols-4 gap-3">
            {SUPPORTED_TOKENS.map(token => (
              <div key={token.symbol} className="p-2 bg-white/5 rounded-lg text-center">
                <p className="font-medium text-gray-300">{token.symbol}</p>
                <p className="text-xs text-gray-400">{token.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-white/10">
          <BarChart className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
          <p className="text-sm text-gray-300">
            Real-time market analysis and AI-powered trading signals help you make informed decisions
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-white/10">
          <RefreshCw className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Automated Trading</h3>
          <p className="text-sm text-gray-300">
            Set your strategy and let our AI execute trades automatically when conditions are right
          </p>
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-green-900/50 to-green-800/30 border border-white/10">
          <Shield className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Security First</h3>
          <p className="text-sm text-gray-300">
            Non-custodial trading means you always maintain control of your assets
          </p>
        </div>
      </div>

      {/* Tech Stack & Integration */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4">Powered By</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="font-medium text-purple-400">Polygon Network</p>
            <p className="text-xs text-gray-400 mt-1">Fast & Low Fees</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="font-medium text-blue-400">SideShift.ai</p>
            <p className="text-xs text-gray-400 mt-1">Reliable Swaps</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="font-medium text-green-400">Supabase</p>
            <p className="text-xs text-gray-400 mt-1">Real-time Data</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="font-medium text-yellow-400">AI Models</p>
            <p className="text-xs text-gray-400 mt-1">Smart Signals</p>
          </div>
        </div>
      </div>
    </div>
  );
}



import React from 'react';
import Hero from '../components/Hero';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <Hero />
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
        <h2 className="text-xl font-semibold mb-2">What ShiftMind Does</h2>
        <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
          <li>Analyzes markets and generates AI signals for swaps</li>
          <li>Lets you execute swaps manually or automatically</li>
          <li>Keeps a history of your swaps and performance</li>
          <li>Supports multiple strategies: Safe, Stable, Aggressive</li>
        </ul>
      </div>
      <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
        <h2 className="text-xl font-semibold mb-2">Powered by SideShift.ai</h2>
        <p className="text-sm text-gray-400">
          This app uses the SideShift.ai API to quote and execute crypto swaps seamlessly.
          Connect your wallet to view strategy recommendations and swap history.
        </p>
      </div>
    </div>
  );
}



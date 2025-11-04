import React from 'react';

interface SettingsPageProps {
  account: string | null;
  autoSwapEnabled: boolean;
  onToggleAutoSwap: () => void;
}

export default function SettingsPage({ account, autoSwapEnabled, onToggleAutoSwap }: SettingsPageProps) {
  if (!account) {
    return <div className="text-gray-300">Connect your wallet to manage settings.</div>;
  }

  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200 space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Auto Swap</p>
          <p className="text-xs text-gray-400">Automatically execute swaps on high-confidence signals.</p>
        </div>
        <button
          onClick={onToggleAutoSwap}
          className={`px-4 py-2 rounded-md ${autoSwapEnabled ? 'bg-green-600' : 'bg-gray-600'} text-white`}
        >
          {autoSwapEnabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  );
}



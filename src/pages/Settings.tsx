import React from 'react';
import { SUPPORTED_TOKENS } from '../services/sideshift';
import { supabase } from '../lib/supabase';

interface SettingsPageProps {
  account: string | null;
  autoSwapEnabled: boolean;
  onToggleAutoSwap: () => void;
}

export default function SettingsPage({ account, autoSwapEnabled, onToggleAutoSwap }: SettingsPageProps) {
  const [fromToken, setFromToken] = React.useState<string>(() => localStorage.getItem('default_from_token') || 'eth');
  const [toToken, setToToken] = React.useState<string>(() => localStorage.getItem('default_to_token') || 'btc');
  const [strategy, setStrategy] = React.useState<'safe' | 'balanced' | 'aggressive'>(() => (localStorage.getItem('strategy') as any) || 'balanced');
  const [apiKey, setApiKey] = React.useState<string>(() => localStorage.getItem('sideshift_api_key') || '');
  const [saving, setSaving] = React.useState(false);

  function saveDefaults(f: string, t: string) {
    localStorage.setItem('default_from_token', f);
    localStorage.setItem('default_to_token', t);
  }

  React.useEffect(() => {
    saveDefaults(fromToken, toToken);
  }, [fromToken, toToken]);

  async function saveSettings() {
    if (!account) return;
    setSaving(true);
    try {
      localStorage.setItem('strategy', strategy);
      localStorage.setItem('sideshift_api_key', apiKey);

      const { error } = await supabase
        .from('user_strategies')
        .upsert({ user_address: account, strategy_type: strategy === 'balanced' ? 'stable' : strategy, updated_at: new Date().toISOString() }, { onConflict: 'user_address' });

      if (error) {
        console.error('Failed to save strategy:', error);
        alert('Failed to save strategy');
      } else {
        alert('Settings saved locally');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded bg-white/5 border border-white/10">
          <p className="text-sm mb-2">Default From Token</p>
          <select value={fromToken} onChange={e => setFromToken(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20">
            {SUPPORTED_TOKENS.map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="p-4 rounded bg-white/5 border border-white/10">
          <p className="text-sm mb-2">Default To Token</p>
          <select value={toToken} onChange={e => setToToken(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20">
            {SUPPORTED_TOKENS.filter(t => t.symbol !== fromToken).map(t => (
              <option key={t.symbol} value={t.symbol}>{t.symbol.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded bg-white/5 border border-white/10">
          <p className="text-sm mb-2">Strategy Preference</p>
          <select value={strategy} onChange={e => setStrategy(e.target.value as any)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20">
            <option value="safe">Safe</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>

        <div className="p-4 rounded bg-white/5 border border-white/10">
          <p className="text-sm mb-2">SideShift API Key (optional)</p>
          <input value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="paste api key for advanced usage (optional)" />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={saveSettings} disabled={saving} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}



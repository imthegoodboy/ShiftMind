import React, { useState } from 'react';
import { swapManager } from '../services/swapManager';

interface ManualSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  strategyType: 'safe' | 'balanced' | 'aggressive';
}

export default function ManualSwapModal({ isOpen, onClose, walletAddress, strategyType }: ManualSwapModalProps) {
  const [fromToken, setFromToken] = useState('eth');
  const [toToken, setToToken] = useState('btc');
  const [amount, setAmount] = useState('0.01');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (!walletAddress) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await swapManager.initiateSwap({
        userId: walletAddress,
        fromToken,
        toToken,
        amount: parseFloat(amount),
        walletAddress,
        strategyType,
      });
      if (!res.success) {
        setError(res.error || 'Failed to create swap');
        setSubmitting(false);
        return;
      }
      onClose();
    } catch (e: any) {
      setError(e?.message || 'Failed to create swap');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl p-6 bg-white/10 backdrop-blur-md border border-white/20 text-white">
        <h3 className="text-lg font-semibold mb-4">Manual Swap</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <input value={fromToken} onChange={e => setFromToken(e.target.value)} className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="from (e.g. eth)" />
            <input value={toToken} onChange={e => setToToken(e.target.value)} className="flex-1 px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="to (e.g. btc)" />
          </div>
          <input value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 rounded bg-white/10 border border-white/20" placeholder="amount" />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-white/10 border border-white/20">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Create Swap'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



import React from 'react';
import ManualSwapModal from '../components/ManualSwapModal';

interface ManualSwapPageProps {
  walletAddress: string | null;
  onClose?: () => void;
  strategyType: 'safe' | 'balanced' | 'aggressive';
}

export default function ManualSwapPage({ walletAddress, onClose, strategyType }: ManualSwapPageProps) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-gray-200">
      <h2 className="text-xl font-semibold mb-4">Manual Swap</h2>
      <p className="text-sm text-gray-400 mb-4">Choose tokens and amount to create a manual swap.</p>
      <ManualSwapModal isOpen={true} onClose={onClose || (() => {})} walletAddress={walletAddress} strategyType={strategyType} />
    </div>
  );
}

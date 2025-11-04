import React from 'react';
import AdvancedDashboard from '../components/AdvancedDashboard';
import ManualSwapModal from '../components/ManualSwapModal';

interface SwapsPageProps {
  walletAddress: string | null;
  isLoading: boolean;
  userHasProfile: boolean;
  strategyType: 'safe' | 'balanced' | 'aggressive';
  autoSwapEnabled: boolean;
  onToggleAutoSwap: () => void;
  onExecuteSignal?: () => void;
  onReviewSignal?: () => void;
  signal: any;
  prices: Record<string, any>;
  portfolioValue: number;
  totalProfit: number;
  swaps: any[];
}

export default function SwapsPage(props: SwapsPageProps) {
  const [openManual, setOpenManual] = React.useState(false);
  if (!props.walletAddress) {
    return (
      <div className="text-center py-12 text-gray-300">Connect your wallet to view swaps.</div>
    );
  }

  if (!props.userHasProfile) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-300">Loading profile…</div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button onClick={() => setOpenManual(true)} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white">New Swap</button>
      </div>
      <AdvancedDashboard
        walletAddress={props.walletAddress}
        strategyType={props.strategyType}
        autoSwapEnabled={props.autoSwapEnabled}
        onToggleAutoSwap={props.onToggleAutoSwap}
        onExecuteSignal={props.onExecuteSignal}
        onReviewSignal={props.onReviewSignal}
        signal={props.signal}
        prices={props.prices}
        portfolioValue={props.portfolioValue}
        totalProfit={props.totalProfit}
        swaps={props.swaps}
        isLoading={props.isLoading}
      />
      <ManualSwapModal
        isOpen={openManual}
        onClose={() => setOpenManual(false)}
        walletAddress={props.walletAddress}
        strategyType={props.strategyType}
      />
    </>
  );
}



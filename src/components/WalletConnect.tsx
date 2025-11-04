import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  account: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export default function WalletConnect({ account, onConnect, isConnecting }: WalletConnectProps) {
  return (
    <div className="flex items-center gap-4">
      {account ? (
        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg">
          <Wallet className="w-5 h-5" />
          <span className="font-mono text-sm">
            {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Wallet className="w-5 h-5" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}

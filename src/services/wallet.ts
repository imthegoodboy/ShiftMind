declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export const POLYGON_CHAIN_ID = '0x89';
export const POLYGON_PARAMS = {
  chainId: POLYGON_CHAIN_ID,
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://polygon-rpc.com'],
  blockExplorerUrls: ['https://polygonscan.com/'],
};

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to use this app.');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  }) as string[];

  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found');
  }

  await switchToPolygon();

  return accounts[0];
}

export async function switchToPolygon(): Promise<void> {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_CHAIN_ID }],
    });
  } catch (error: unknown) {
    const err = error as { code?: number };
    if (err.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [POLYGON_PARAMS],
      });
    } else {
      throw error;
    }
  }
}

export async function getConnectedAccount(): Promise<string | null> {
  if (!window.ethereum) {
    return null;
  }

  const accounts = await window.ethereum.request({
    method: 'eth_accounts',
  }) as string[];

  return accounts[0] || null;
}

export function onAccountsChanged(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts: unknown) => {
      callback(accounts as string[]);
    });
  }
}

export function removeAccountsChangedListener(callback: (accounts: string[]) => void): void {
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', (accounts: unknown) => {
      callback(accounts as string[]);
    });
  }
}

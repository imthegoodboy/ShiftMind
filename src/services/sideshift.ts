const SIDESHIFT_API = 'https://api.sideshift.ai/v2';

export interface SideShiftCoin {
  coin: string;
  name: string;
  icon: string;
}

export interface SideShiftPair {
  min: string;
  max: string;
  rate: string;
  depositCoin: string;
  settleCoin: string;
}

export interface SideShiftOrder {
  id: string;
  createdAt: string;
  depositCoin: string;
  settleCoin: string;
  depositAddress: string;
  settleAddress: string;
  depositAmount: string;
  settleAmount: string;
  expiresAt: string;
  status: string;
  rate: string;
}

export interface SwapQuote {
  depositCoin: string;
  settleCoin: string;
  depositAmount: string;
  settleAmount: string;
  rate: string;
  minDeposit: string;
  maxDeposit: string;
  expiresIn: number;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

async function fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
  let lastError: Error | null = null;
  const apiUrl = import.meta.env.VITE_SIDESHIFT_API_URL || SIDESHIFT_API;

  // Replace the hardcoded URL with the environment variable if it exists
  const finalUrl = url.replace(SIDESHIFT_API, apiUrl);

  for (let i = 0; i < RETRY_ATTEMPTS; i++) {
    try {
      const response = await fetch(finalUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin,
          ...options?.headers,
        },
        mode: 'cors',
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        // Parse the error response if it's JSON
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `API Error: ${response.status} - ${response.statusText}`);
        }
      }

      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (i < RETRY_ATTEMPTS - 1) {
        // Exponential backoff with jitter
        const delay = RETRY_DELAY * Math.pow(2, i) * (0.5 + Math.random() * 0.5);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Enhanced error handling with more specific messages
  const message = lastError?.message || 'Failed after retries';
  if (message.toLowerCase().includes('failed to fetch')) {
    throw new Error('Network error: Unable to reach SideShift API. Please check your internet connection and try again.');
  } else if (message.toLowerCase().includes('cors')) {
    throw new Error('CORS error: The request was blocked. Please ensure you are using the correct API endpoint and have proper CORS headers.');
  } else if (message.toLowerCase().includes('timeout')) {
    throw new Error('Timeout error: The request took too long to complete. Please try again.');
  } else if (message.toLowerCase().includes('rate limit')) {
    throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
  }

  throw lastError || new Error('An unexpected error occurred while contacting the SideShift API.');
}

export async function getSupportedCoins(): Promise<SideShiftCoin[]> {
  const response = await fetchWithRetry(`${SIDESHIFT_API}/coins`);

  if (!response.ok) {
    throw new Error(`Failed to fetch supported coins: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function getPairInfo(depositCoin: string, settleCoin: string): Promise<SideShiftPair> {
  const response = await fetchWithRetry(
    `${SIDESHIFT_API}/pair/${depositCoin}/${settleCoin}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Failed to fetch pair ${depositCoin}/${settleCoin}`);
  }

  return response.json();
}

export async function getSwapQuote(
  depositCoin: string,
  settleCoin: string,
  depositAmount: string
): Promise<SwapQuote> {
  const response = await fetchWithRetry(
    `${SIDESHIFT_API}/quotes/fixed?depositCoin=${depositCoin}&settleCoin=${settleCoin}&depositAmount=${depositAmount}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Failed to get swap quote');
  }

  const data = await response.json();
  return {
    depositCoin: data.depositCoin,
    settleCoin: data.settleCoin,
    depositAmount: data.depositAmount,
    settleAmount: data.settleAmount,
    rate: data.rate,
    minDeposit: data.min,
    maxDeposit: data.max,
    expiresIn: data.expiresIn || 600,
  };
}

export async function createShift(
  depositCoin: string,
  settleCoin: string,
  settleAddress: string,
  depositAmount: string
): Promise<SideShiftOrder> {
  const body = {
    depositCoin,
    settleCoin,
    settleAddress,
    depositAmount,
  };

  const response = await fetchWithRetry(`${SIDESHIFT_API}/shifts/fixed`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Failed to create shift');
  }

  return response.json();
}

export async function getShiftStatus(shiftId: string): Promise<SideShiftOrder> {
  const response = await fetchWithRetry(`${SIDESHIFT_API}/shifts/${shiftId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch shift status: ${response.statusText}`);
  }

  return response.json();
}

export async function checkShiftDeposit(shiftId: string): Promise<{
  status: string;
  depositReceived: boolean;
  depositAmount: string;
}> {
  const order = await getShiftStatus(shiftId);

  return {
    status: order.status,
    depositReceived: order.status !== 'waiting',
    depositAmount: order.depositAmount,
  };
}

export const SUPPORTED_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', sideshift: 'eth', type: 'crypto', decimals: 18 },
  { symbol: 'BTC', name: 'Bitcoin', sideshift: 'btc', type: 'crypto', decimals: 8 },
  { symbol: 'MATIC', name: 'Polygon', sideshift: 'matic', type: 'crypto', decimals: 18 },
  { symbol: 'USDT', name: 'Tether USD', sideshift: 'usdterc20', type: 'stablecoin', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', sideshift: 'usdcerc20', type: 'stablecoin', decimals: 6 },
  { symbol: 'DAI', name: 'Dai Stablecoin', sideshift: 'dai', type: 'stablecoin', decimals: 18 },
  { symbol: 'SOL', name: 'Solana', sideshift: 'sol', type: 'crypto', decimals: 9 },
  { symbol: 'XRP', name: 'Ripple', sideshift: 'xrp', type: 'crypto', decimals: 6 },
];

export function getTokenBySideshift(sideshiftCode: string) {
  return SUPPORTED_TOKENS.find(t => t.sideshift === sideshiftCode);
}

export function getTokenBySymbol(symbol: string) {
  return SUPPORTED_TOKENS.find(t => t.symbol === symbol);
}

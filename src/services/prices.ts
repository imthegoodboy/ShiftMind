const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FALLBACK_API = 'https://api.coingecko.com/api/v3'; // You can set up a fallback API if needed

const DEBUG = true;

const logDebug = (message: string, ...args: any[]) => {
  if (DEBUG) {
    console.log(`[Prices] ${message}`, ...args);
  }
};

export interface TokenPrice {
  id: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d?: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  ath: number;
  atl: number;
}

export interface PriceHistoryPoint {
  timestamp: number;
  price: number;
}

const TOKEN_IDS: Record<string, string> = {
  'eth': 'ethereum',
  'btc': 'bitcoin',
  'matic': 'matic-network',
  'usdterc20': 'tether',
  'usdcerc20': 'usd-coin',
  'dai': 'dai',
  'sol': 'solana',
  'xrp': 'ripple',
};

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 500;

async function fetchWithRetry(url: string): Promise<Response> {
  const cacheKey = `price_cache_${url}`;
  const cacheExpiry = 30000; // 30 seconds cache

  // Try to get from cache first
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheExpiry) {
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  let error: Error | null = null;
  for (let i = 0; i < RETRY_ATTEMPTS; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Cache the successful response
        const data = await response.clone().json();
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        return response;
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.status >= 500 && i < RETRY_ATTEMPTS - 1) {
        error = new Error(`CoinGecko API Error: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
        continue;
      }

      const errorText = await response.text();
      error = new Error(`API Error: ${response.status} - ${errorText}`);
      break;
    } catch (err) {
      error = err instanceof Error ? err : new Error('Unknown error');
      if (err instanceof Error && err.name === 'AbortError') {
        error = new Error('Request timeout - CoinGecko API is not responding');
      }
      if (i < RETRY_ATTEMPTS - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
      }
    }
  }

  // If all retries failed, check if we have a stale cache
  const staleCache = sessionStorage.getItem(cacheKey);
  if (staleCache) {
    console.warn('Using stale price cache due to API failure');
    const { data } = JSON.parse(staleCache);
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  throw error || new Error('Unable to fetch price data. Please check your internet connection and try again.');
}

export async function getTokenPrices(symbols: string[]): Promise<Record<string, TokenPrice>> {
  const ids = symbols.map(s => TOKEN_IDS[s] || s).join(',');

  const response = await fetchWithRetry(
    `${COINGECKO_API}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h,7d,30d`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch token prices: ${response.statusText}`);
  }

  const data = await response.json();

  const priceMap: Record<string, TokenPrice> = {};
  data.forEach((token: any) => {
    const symbol = Object.keys(TOKEN_IDS).find(k => TOKEN_IDS[k] === token.id) || token.symbol.toLowerCase();
    priceMap[symbol] = {
      id: token.id,
      symbol: token.symbol,
      current_price: token.current_price || 0,
      price_change_percentage_24h: token.price_change_percentage_24h || 0,
      price_change_percentage_7d: token.price_change_percentage_7d || 0,
      price_change_percentage_30d: token.price_change_percentage_30d || 0,
      market_cap: token.market_cap || 0,
      market_cap_rank: token.market_cap_rank || 0,
      total_volume: token.total_volume || 0,
      high_24h: token.high_24h || 0,
      low_24h: token.low_24h || 0,
      ath: token.ath || 0,
      atl: token.atl || 0,
    };
  });

  return priceMap;
}

export async function getTokenPrice(symbol: string): Promise<number> {
  const id = TOKEN_IDS[symbol] || symbol;

  const response = await fetchWithRetry(
    `${COINGECKO_API}/simple/price?ids=${id}&vs_currencies=usd`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch token price: ${response.statusText}`);
  }

  const data = await response.json();
  return data[id]?.usd || 0;
}

export async function getPriceHistory(
  symbol: string,
  days: number = 7
): Promise<PriceHistoryPoint[]> {
  const id = TOKEN_IDS[symbol] || symbol;

  const response = await fetchWithRetry(
    `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch price history: ${response.statusText}`);
  }

  const data = await response.json();
  return data.prices.map((point: [number, number]) => ({
    timestamp: point[0],
    price: point[1],
  }));
}

export function calculateVolatility(prices: PriceHistoryPoint[]): number {
  if (prices.length < 2) return 0;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i - 1].price) / prices[i - 1].price;
    returns.push(ret);
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  return stdDev * 100;
}

export function calculateMovingAverage(prices: PriceHistoryPoint[], period: number): number[] {
  const mas: number[] = [];

  for (let i = period - 1; i < prices.length; i++) {
    const sum = prices.slice(i - period + 1, i + 1).reduce((a, p) => a + p.price, 0);
    mas.push(sum / period);
  }

  return mas;
}

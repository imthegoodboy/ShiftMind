const COINGECKO_API = 'https://api.coingecko.com/api/v3';

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
  let lastError: Error | null = null;

  for (let i = 0; i < RETRY_ATTEMPTS; i++) {
    try {
      const response = await fetch(url);

      if (response.ok) return response;

      if (response.status >= 500 && i < RETRY_ATTEMPTS - 1) {
        lastError = new Error(`Server error: ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      if (i < RETRY_ATTEMPTS - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * Math.pow(2, i)));
      }
    }
  }

  throw lastError || new Error('Failed after retries');
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

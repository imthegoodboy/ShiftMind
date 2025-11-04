import { TokenPrice, PriceHistoryPoint, calculateVolatility } from './prices';

export interface AISignal {
  action: 'buy' | 'sell' | 'hold' | 'swap';
  fromToken: string;
  toToken: string;
  confidence: number;
  reason: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedGain: number;
  timeframe: string;
}

interface MarketMetrics {
  volatility: number;
  momentum: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  rsi: number;
  macdSignal: number;
}

export class AITrader {
  private strategyWeights = {
    safe: { momentum: 0.1, volatility: 0.3, trend: 0.4, rsi: 0.2 },
    balanced: { momentum: 0.3, volatility: 0.2, trend: 0.3, rsi: 0.2 },
    aggressive: { momentum: 0.5, volatility: 0.2, trend: 0.2, rsi: 0.1 },
  };

  calculateRSI(prices: PriceHistoryPoint[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i].price - prices[i - 1].price;
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);

    return rsi;
  }

  calculateMACD(prices: PriceHistoryPoint[]): { macd: number; signal: number; histogram: number } {
    if (prices.length < 26) {
      return { macd: 0, signal: 0, histogram: 0 };
    }

    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;

    const macdLine = [];
    for (let i = 0; i < prices.length; i++) {
      const e12 = this.calculateEMA(prices.slice(0, i + 1), 12);
      const e26 = this.calculateEMA(prices.slice(0, i + 1), 26);
      macdLine.push(e12 - e26);
    }

    const signal = this.calculateEMA(
      macdLine.map((m, i) => ({ timestamp: i, price: m })),
      9
    );
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  private calculateEMA(prices: PriceHistoryPoint[], period: number): number {
    if (prices.length === 0) return 0;

    const k = 2 / (period + 1);
    let ema = prices[0].price;

    for (let i = 1; i < prices.length; i++) {
      ema = prices[i].price * k + ema * (1 - k);
    }

    return ema;
  }

  analyzePriceHistory(prices: PriceHistoryPoint[]): MarketMetrics {
    if (prices.length < 14) {
      return {
        volatility: 0,
        momentum: 0,
        trend: 'neutral',
        rsi: 50,
        macdSignal: 0,
      };
    }

    const volatility = calculateVolatility(prices);
    const rsi = this.calculateRSI(prices);
    const { macd, signal } = this.calculateMACD(prices);

    const recentPrices = prices.slice(-20);
    const avgPrice = recentPrices.reduce((sum, p) => sum + p.price, 0) / recentPrices.length;
    const currentPrice = recentPrices[recentPrices.length - 1].price;
    const momentum = ((currentPrice - recentPrices[0].price) / recentPrices[0].price) * 100;

    let trend: 'bullish' | 'bearish' | 'neutral';
    if (currentPrice > avgPrice && momentum > 2) {
      trend = 'bullish';
    } else if (currentPrice < avgPrice && momentum < -2) {
      trend = 'bearish';
    } else {
      trend = 'neutral';
    }

    return {
      volatility: Math.min(volatility, 100),
      momentum,
      trend,
      rsi,
      macdSignal: macd > signal ? 1 : -1,
    };
  }

  generateSignal(
    tokenSymbol: string,
    currentPrice: TokenPrice,
    priceHistory: PriceHistoryPoint[],
    strategyType: 'safe' | 'balanced' | 'aggressive',
    allPrices: Record<string, TokenPrice>
  ): AISignal {
    const metrics = this.analyzePriceHistory(priceHistory);
    const weights = this.strategyWeights[strategyType];

    const momentumScore = (metrics.momentum / 20 + 0.5) * 50;
    const volatilityScore = Math.max(0, 100 - metrics.volatility * 2);
    const trendScore = metrics.trend === 'bullish' ? 75 : metrics.trend === 'bearish' ? 25 : 50;
    const rsiScore = metrics.rsi > 70 ? 30 : metrics.rsi < 30 ? 70 : 50;

    const weightedScore =
      (momentumScore * weights.momentum +
        volatilityScore * weights.volatility +
        trendScore * weights.trend +
        rsiScore * weights.rsi) /
      (weights.momentum + weights.volatility + weights.trend + weights.rsi);

    const confidence = Math.min(Math.max(weightedScore / 100, 0), 1);
    const priceChange24h = currentPrice.price_change_percentage_24h || 0;

    let action: 'buy' | 'sell' | 'hold' | 'swap' = 'hold';
    let targetToken = tokenSymbol;
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';
    let expectedGain = 0;
    let reason = '';

    if (strategyType === 'safe') {
      if (priceChange24h < -5 || (metrics.trend === 'bearish' && metrics.rsi < 35)) {
        action = 'swap';
        targetToken = 'USDT';
        riskLevel = 'low';
        expectedGain = 0.5;
        reason = `${tokenSymbol} showing bearish signals. Moving to stablecoins to protect capital.`;
      } else if (priceChange24h > 3 && priceChange24h < 8 && metrics.rsi < 70) {
        action = 'buy';
        riskLevel = 'low';
        expectedGain = 2;
        reason = `${tokenSymbol} showing steady growth with room to run.`;
      } else {
        reason = 'Market conditions stable for conservative strategy.';
      }
    } else if (strategyType === 'aggressive') {
      if (priceChange24h > 8 && metrics.trend === 'bullish' && metrics.rsi < 85) {
        action = 'buy';
        riskLevel = 'high';
        expectedGain = priceChange24h * 2;
        reason = `${tokenSymbol} surging with strong momentum. High opportunity.`;
      } else if (
        priceChange24h < -8 ||
        (metrics.trend === 'bearish' && metrics.rsi > 65)
      ) {
        action = 'sell';
        targetToken = this.findBestAlternative(allPrices, 'aggressive');
        riskLevel = 'high';
        expectedGain = 3;
        reason = `${tokenSymbol} declining rapidly. Rotating to better opportunities.`;
      } else if (metrics.volatility > 60 && metrics.momentum > 5) {
        action = 'swap';
        targetToken = this.findBestAlternative(allPrices, 'aggressive');
        riskLevel = 'high';
        expectedGain = Math.abs(metrics.momentum) * 1.5;
        reason = 'High volatility opportunity detected. Rotating portfolio.';
      } else {
        reason = 'Monitoring for aggressive trading opportunities.';
      }
    } else {
      if (priceChange24h > 5 && metrics.rsi > 60 && metrics.rsi < 80) {
        action = 'buy';
        riskLevel = 'medium';
        expectedGain = priceChange24h * 0.8;
        reason = `${tokenSymbol} showing steady uptrend. Balanced entry point.`;
      } else if (priceChange24h < -3 || metrics.rsi > 75) {
        action = 'swap';
        targetToken = this.findBestAlternative(allPrices, 'balanced');
        riskLevel = 'medium';
        expectedGain = 1.5;
        reason = `Rebalancing portfolio for balanced risk/reward.`;
      } else {
        reason = 'Balanced market conditions. Maintaining current position.';
      }
    }

    return {
      action,
      fromToken: tokenSymbol,
      toToken: targetToken,
      confidence: Math.round(confidence * 100) / 100,
      reason,
      riskLevel,
      expectedGain,
      timeframe: strategyType === 'aggressive' ? '4-24 hours' : '1-7 days',
    };
  }

  private findBestAlternative(prices: Record<string, TokenPrice>, strategy: string): string {
    const stablecoins = ['USDT', 'USDC', 'DAI'];
    const tokens = Object.keys(prices);

    if (strategy === 'aggressive') {
      const gainers = tokens
        .map(t => ({
          token: t,
          change: prices[t].price_change_percentage_24h || 0,
        }))
        .filter(t => t.change > 2)
        .sort((a, b) => b.change - a.change);

      return gainers.length > 0 ? gainers[0].token : 'USDT';
    }

    if (strategy === 'balanced') {
      const steadyGainers = tokens
        .map(t => ({
          token: t,
          change: prices[t].price_change_percentage_24h || 0,
        }))
        .filter(t => t.change > 1 && t.change < 10)
        .sort((a, b) => b.change - a.change);

      return steadyGainers.length > 0 ? steadyGainers[0].token : stablecoins[0];
    }

    return stablecoins[0];
  }

  calculatePortfolioRisk(holdings: Record<string, number>, prices: Record<string, TokenPrice>): number {
    let totalValue = 0;
    let totalRiskScore = 0;

    for (const [token, amount] of Object.entries(holdings)) {
      const price = prices[token];
      if (!price) continue;

      const value = amount * price.current_price;
      const volatility = Math.abs(price.price_change_percentage_24h || 0);
      const riskScore = volatility * (value / 100);

      totalValue += value;
      totalRiskScore += riskScore;
    }

    if (totalValue === 0) return 0;
    return Math.min(totalRiskScore / totalValue, 100);
  }
}

export const aiTrader = new AITrader();

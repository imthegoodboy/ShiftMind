import { TokenPrice } from './prices';

export interface SwapRecommendation {
  shouldSwap: boolean;
  fromToken: string;
  toToken: string;
  reason: string;
  confidence: number;
}

export function analyzeMarket(
  prices: Record<string, TokenPrice>,
  strategyType: 'safe' | 'aggressive' | 'stable',
  currentToken: string
): SwapRecommendation {
  const tokens = Object.keys(prices);

  if (strategyType === 'safe') {
    return analyzeSafeStrategy(prices, currentToken, tokens);
  } else if (strategyType === 'aggressive') {
    return analyzeAggressiveStrategy(prices, currentToken, tokens);
  } else {
    return analyzeStableStrategy(prices, currentToken, tokens);
  }
}

function analyzeSafeStrategy(
  prices: Record<string, TokenPrice>,
  currentToken: string,
  tokens: string[]
): SwapRecommendation {
  const currentPrice = prices[currentToken];

  if (!currentPrice) {
    return {
      shouldSwap: false,
      fromToken: currentToken,
      toToken: currentToken,
      reason: 'Price data unavailable',
      confidence: 0,
    };
  }

  const priceChange24h = currentPrice.price_change_percentage_24h;

  if (priceChange24h < -5) {
    const stableCoins = ['usdterc20', 'usdcerc20', 'dai'];
    const availableStable = stableCoins.find(s => tokens.includes(s) && s !== currentToken);

    if (availableStable) {
      return {
        shouldSwap: true,
        fromToken: currentToken,
        toToken: availableStable,
        reason: `${currentToken.toUpperCase()} dropped ${Math.abs(priceChange24h).toFixed(2)}% in 24h. Moving to stablecoin to preserve value.`,
        confidence: 0.75,
      };
    }
  }

  if (currentToken === 'usdterc20' || currentToken === 'usdcerc20' || currentToken === 'dai') {
    const growthTokens = tokens
      .filter(t => !['usdterc20', 'usdcerc20', 'dai'].includes(t))
      .map(t => ({ token: t, change: prices[t]?.price_change_percentage_24h || 0 }))
      .filter(t => t.change > 3)
      .sort((a, b) => b.change - a.change);

    if (growthTokens.length > 0 && growthTokens[0].change > 5) {
      return {
        shouldSwap: true,
        fromToken: currentToken,
        toToken: growthTokens[0].token,
        reason: `${growthTokens[0].token.toUpperCase()} up ${growthTokens[0].change.toFixed(2)}% in 24h. Safe entry point detected.`,
        confidence: 0.65,
      };
    }
  }

  return {
    shouldSwap: false,
    fromToken: currentToken,
    toToken: currentToken,
    reason: 'Market conditions stable, holding current position.',
    confidence: 0.8,
  };
}

function analyzeAggressiveStrategy(
  prices: Record<string, TokenPrice>,
  currentToken: string,
  tokens: string[]
): SwapRecommendation {
  const currentPrice = prices[currentToken];

  if (!currentPrice) {
    return {
      shouldSwap: false,
      fromToken: currentToken,
      toToken: currentToken,
      reason: 'Price data unavailable',
      confidence: 0,
    };
  }

  const volatileTokens = tokens
    .filter(t => t !== currentToken && !['usdterc20', 'usdcerc20', 'dai'].includes(t))
    .map(t => ({
      token: t,
      change24h: prices[t]?.price_change_percentage_24h || 0,
      change7d: prices[t]?.price_change_percentage_7d || 0,
    }))
    .sort((a, b) => b.change24h - a.change24h);

  if (volatileTokens.length > 0) {
    const topGainer = volatileTokens[0];

    if (topGainer.change24h > 8) {
      return {
        shouldSwap: true,
        fromToken: currentToken,
        toToken: topGainer.token,
        reason: `${topGainer.token.toUpperCase()} surging ${topGainer.change24h.toFixed(2)}% in 24h. High momentum detected.`,
        confidence: 0.7,
      };
    }
  }

  const currentChange = currentPrice.price_change_percentage_24h;
  if (currentChange < -3) {
    const bestAlternative = volatileTokens.find(t => t.change24h > 0);
    if (bestAlternative) {
      return {
        shouldSwap: true,
        fromToken: currentToken,
        toToken: bestAlternative.token,
        reason: `${currentToken.toUpperCase()} declining. Switching to ${bestAlternative.token.toUpperCase()} with positive momentum.`,
        confidence: 0.65,
      };
    }
  }

  return {
    shouldSwap: false,
    fromToken: currentToken,
    toToken: currentToken,
    reason: 'Monitoring for better entry points.',
    confidence: 0.6,
  };
}

function analyzeStableStrategy(
  prices: Record<string, TokenPrice>,
  currentToken: string,
  tokens: string[]
): SwapRecommendation {
  const stableCoins = ['usdterc20', 'usdcerc20', 'dai'];
  const isCurrentlyStable = stableCoins.includes(currentToken);

  if (!isCurrentlyStable) {
    const currentPrice = prices[currentToken];
    if (!currentPrice) {
      return {
        shouldSwap: false,
        fromToken: currentToken,
        toToken: currentToken,
        reason: 'Price data unavailable',
        confidence: 0,
      };
    }

    const priceChange = currentPrice.price_change_percentage_24h;

    if (priceChange > 10) {
      const availableStable = stableCoins.find(s => tokens.includes(s));
      if (availableStable) {
        return {
          shouldSwap: true,
          fromToken: currentToken,
          toToken: availableStable,
          reason: `${currentToken.toUpperCase()} up ${priceChange.toFixed(2)}%. Locking in profits to stablecoin.`,
          confidence: 0.85,
        };
      }
    }

    if (priceChange < -7) {
      const availableStable = stableCoins.find(s => tokens.includes(s));
      if (availableStable) {
        return {
          shouldSwap: true,
          fromToken: currentToken,
          toToken: availableStable,
          reason: `${currentToken.toUpperCase()} down ${Math.abs(priceChange).toFixed(2)}%. Protecting capital.`,
          confidence: 0.9,
        };
      }
    }
  } else {
    const growthTokens = tokens
      .filter(t => !stableCoins.includes(t))
      .map(t => ({ token: t, change: prices[t]?.price_change_percentage_24h || 0 }))
      .filter(t => t.change > 2 && t.change < 8)
      .sort((a, b) => b.change - a.change);

    if (growthTokens.length > 0) {
      return {
        shouldSwap: true,
        fromToken: currentToken,
        toToken: growthTokens[0].token,
        reason: `${growthTokens[0].token.toUpperCase()} showing steady growth (${growthTokens[0].change.toFixed(2)}%). Low-risk entry.`,
        confidence: 0.7,
      };
    }
  }

  return {
    shouldSwap: false,
    fromToken: currentToken,
    toToken: currentToken,
    reason: 'Maintaining stable position.',
    confidence: 0.85,
  };
}

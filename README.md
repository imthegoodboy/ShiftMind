# ShiftMind - AI-Powered DeFi Auto-Invest Bot

## 🚀 Overview

**ShiftMind** is a production-ready, fully functional AI-powered DeFi trading bot that automatically analyzes crypto markets and executes intelligent swaps through SideShift.ai on the Polygon Network.

### Core Features:
- 🤖 **Advanced AI Analysis**: RSI, MACD, Volatility, Moving Averages
- 🔄 **Real SideShift Integration**: Instant cross-chain token swaps
- ⚡ **Polygon Network**: Fast (2-3s), cheap (~$0.01 gas)
- 📊 **Live Dashboard**: Portfolio tracking, P&L, transaction history
- 🎯 **3 Trading Strategies**: Safe, Balanced, Aggressive
- 🔐 **Non-Custodial**: You control your funds 100%
- 📱 **Web3 Enabled**: Connect via MetaMask

---

## 📋 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Supabase** - Database & Auth
- **Edge Functions** - Serverless compute
- **PostgreSQL** - Data storage
- **Row Level Security** - Access control

### Blockchain
- **Polygon Network** - Fast L2 blockchain
- **MetaMask** - Wallet connection
- **SideShift.ai** - Token swap engine
- **CoinGecko** - Price feeds

### APIs
- **SideShift.ai API** - Instant swaps (no account needed)
- **CoinGecko API** - Real-time prices (free tier)
- **Polygon RPC** - Blockchain interaction

---

## 🎯 Quick Start (3 Steps)

### 1. Prerequisites
```bash
# Node.js 18+
node --version

# Install dependencies
npm install
```

### 2. Get Wallet & Funds
- Install [MetaMask](https://metamask.io/)
- Get MATIC from [Coinbase](https://www.coinbase.com) or [Binance](https://www.binance.com)

### 3. Run
```bash
npm run dev
```

Open http://localhost:5173 and connect your wallet!

---

## 📖 Documentation

| Guide | Purpose |
|-------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | 5-minute beginner guide |
| **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** | Initial setup walkthrough |
| **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)** | Complete technical docs |

---

## 💡 How It Works

### User Journey
```
1. Connect MetaMask wallet
   ↓
2. Choose trading strategy (Safe/Balanced/Aggressive)
   ↓
3. AI continuously analyzes market
   ↓
4. When opportunity detected:
   - Generate signal with confidence score
   - If auto-swap enabled → Execute immediately
   - If manual mode → Show recommendation
   ↓
5. Dashboard updates with results
```

### Trading Strategies

| Strategy | Risk | Timeframe | Best For |
|----------|------|-----------|----------|
| 🛡️ **Safe** | Low | 1-7 days | Beginners |
| ⚖️ **Balanced** | Medium | 1-7 days | Most traders |
| 🚀 **Aggressive** | High | 4-24 hours | Experienced |

#### Safe Mode Example
```
Trigger: ETH drops 5% in 24h
Action: Auto-swap 100% to USDT (stablecoin)
Reason: Protect capital in bearish market
```

#### Aggressive Mode Example
```
Trigger: SOL up 12% in 24h, RSI < 85
Action: Swap 50% ETH → SOL
Reason: Ride the momentum wave
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│   Frontend (React + TypeScript)          │
│  ┌──────────────────────────────────┐   │
│  │  AppProduction.tsx               │   │
│  │  - Wallet connection             │   │
│  │  - State management              │   │
│  │  - Strategy selection            │   │
│  └──────────────────────────────────┘   │
│                  ↓                       │
│  ┌──────────────────────────────────┐   │
│  │  Components                      │   │
│  │  - AdvancedDashboard            │   │
│  │  - StrategySelector             │   │
│  │  - WalletConnect                │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Services (Business Logic)              │
│  ┌──────────────────────────────────┐   │
│  │  swapManager.ts                  │   │
│  │  - Create swaps                  │   │
│  │  - Track status                  │   │
│  │  - Store in DB                   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  advancedAI.ts (AITrader)        │   │
│  │  - RSI calculation               │   │
│  │  - MACD analysis                 │   │
│  │  - Signal generation             │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  prices.ts                       │   │
│  │  - Fetch CoinGecko data         │   │
│  │  - Historical prices             │   │
│  │  - Volatility calc               │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  sideshift.ts                    │   │
│  │  - Get quotes                    │   │
│  │  - Create orders                 │   │
│  │  - Check status                  │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   External APIs & Blockchain             │
│  ┌──────────────────────────────────┐   │
│  │  SideShift.ai                    │   │
│  │  - Swap engine                   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  CoinGecko                       │   │
│  │  - Price data                    │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  Polygon Network                 │   │
│  │  - MetaMask transactions         │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Backend (Supabase)                     │
│  ┌──────────────────────────────────┐   │
│  │  PostgreSQL Database             │   │
│  │  - Users                         │   │
│  │  - Swaps                         │   │
│  │  - Signals                       │   │
│  │  - Notifications                 │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  Edge Functions                  │   │
│  │  - monitor-swaps                 │   │
│  │  - create-swap-order             │   │
│  │  - process-ai-signals            │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Core Tables

**users**
- Wallet address, strategy preference, auto-swap setting
- Total volume traded, profit/loss tracking

**swap_transactions**
- Every swap attempt (pending/completed/failed)
- Amount in/out, rates, profit/loss

**market_signals**
- AI-generated trading signals
- Action (buy/sell/hold/swap), confidence score

**alerts_notifications**
- User notifications for all events
- Swap execution, failures, milestones

**portfolio_holdings**
- Current token balances per user
- USD valuations, portfolio percentages

---

## 🔌 API Integration Details

### SideShift.ai
```typescript
// Get swap quote
const quote = await getSwapQuote('eth', 'usdt', '1.0');
// Returns: rate, min, max amounts, expiry

// Create order
const order = await createShift('eth', 'usdt', walletAddress, '1.0');
// Returns: deposit address, settle address, order ID

// Check status
const status = await getShiftStatus(orderId);
// Returns: status (waiting/confirming/complete/error)
```

### CoinGecko
```typescript
// Get prices
const prices = await getTokenPrices(['eth', 'btc', 'matic']);
// Returns: current price, 24h/7d/30d changes, market cap

// Get history
const history = await getPriceHistory('eth', 7);
// Returns: array of prices for 7 days
```

---

## 🤖 AI Strategy Details

### AITrader Class

Implements technical analysis indicators:

**RSI (Relative Strength Index)**
- Measures momentum (0-100)
- > 70 = overbought (sell signal)
- < 30 = oversold (buy signal)

**MACD (Moving Average Convergence Divergence)**
- Trend indicator
- MACD > Signal = bullish
- MACD < Signal = bearish

**Volatility**
- Standard deviation of returns
- High = risky, Low = stable
- Factor into position sizing

**Moving Averages**
- 12-day and 26-day EMAs
- Price trends and crossovers

### Confidence Scoring
```
Score = (momentum * weight) + (volatility * weight) +
        (trend * weight) + (rsi * weight)

Weight differs by strategy:
- Safe: Low momentum weight (0.1), high volatility penalty
- Balanced: Medium across the board
- Aggressive: High momentum weight (0.5), low penalties
```

---

## 🔐 Security

### Non-Custodial Design
- Private keys stay in MetaMask
- ShiftMind never touches funds
- User approves every transaction

### Row Level Security (RLS)
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### No Secrets Exposed
- All API calls use public endpoints
- No private keys in code or database
- Environment variables for sensitive config

---

## 📈 Performance

### Frontend
- Bundle size: 306 KB (gzipped: 91 KB)
- Type-safe with TypeScript
- Lazy component loading

### Backend
- 3-region Supabase deployment
- Real-time subscriptions
- Indexed database queries

### Network
- Price updates: 60-second intervals
- Signal generation: On-demand
- Gas optimized: ~$0.01 per swap

---

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
# Creates optimized dist/ folder
```

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
# Drag dist/ folder or connect GitHub
```

---

## 🧪 Testing

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build test
npm run build
```

---

## 📱 Supported Platforms

| Platform | Support |
|----------|---------|
| Desktop Chrome | ✅ Full |
| Desktop Firefox | ✅ Full |
| Desktop Safari | ✅ Full |
| Mobile Chrome | ✅ Full |
| Mobile Safari | ✅ Full |
| MetaMask Mobile | ✅ Full |

---

## 💰 Supported Tokens

### Cryptocurrencies
- Ethereum (ETH)
- Bitcoin (BTC)
- Polygon (MATIC)
- Solana (SOL)
- Ripple (XRP)

### Stablecoins
- Tether (USDT)
- USD Coin (USDC)
- Dai (DAI)

*More tokens can be added to SUPPORTED_TOKENS array*

---

## 🎮 How to Use

### Basic Usage
1. Connect MetaMask
2. Select strategy
3. Let AI trade or approve manually

### Advanced Usage
1. Monitor AI signals
2. Adjust strategy mid-session
3. Toggle auto-swap on/off
4. Review transaction history

---

## 🐛 Troubleshooting

### Common Issues

**"Can't connect wallet"**
- Refresh page, unlock MetaMask, try again

**"Swap failed"**
- Check minimum amounts, verify token pair, retry

**"Prices not updating"**
- Check internet connection, wait 60 seconds

**"Gas fees high"**
- Polygon gas is cheap, but peaks during congestion

---

## 🔮 Roadmap

### Phase 2 (Planned)
- Mobile app (React Native)
- Multi-wallet support
- Advanced charting
- Telegram notifications

### Phase 3
- Machine learning models
- Sentiment analysis
- Stop-loss automation
- Social trading features

---

## 📞 Support

### Resources
- 📖 [Full Documentation](./PRODUCTION_SETUP.md)
- 🚀 [Quick Start](./QUICK_START.md)
- 🔧 [Setup Guide](./SETUP_GUIDE.md)

### External Links
- [Supabase Docs](https://supabase.com/docs)
- [SideShift API Docs](https://sideshift.ai/api/)
- [Polygon Docs](https://docs.polygon.technology/)
- [MetaMask Docs](https://docs.metamask.io/)

---

## ⚖️ Disclaimer

**ShiftMind is for educational purposes only.**

Cryptocurrency trading involves substantial risk of loss. Past performance does not guarantee future results. Always do your own research and consult with financial advisors before trading.

- Not investment advice
- Use at your own risk
- Start with small amounts
- Never invest more than you can afford to lose

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- React & TypeScript community
- Supabase team
- SideShift.ai
- Polygon community
- CoinGecko

---

## 🚀 Start Trading Now!

```bash
npm install
npm run dev
```

Visit http://localhost:5173 and connect your wallet!

**Let your crypto trade itself.** 🤖

---

## 📊 Stats

- **Lines of Code**: 2,500+
- **Components**: 8
- **Services**: 6
- **Database Tables**: 10
- **Edge Functions**: 3
- **API Integrations**: 3

---

**ShiftMind - AI-Powered DeFi Auto-Invest Bot**

Made with ❤️ for the crypto community.

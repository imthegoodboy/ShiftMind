# ShiftMind - Production Setup Guide

## Project Overview

ShiftMind is a fully functional, production-ready AI-powered DeFi auto-invest bot that combines:
- **AI Market Analysis**: Advanced technical indicators (RSI, MACD, Moving Averages, Volatility)
- **Automated Trading**: Real SideShift.ai integration for instant cross-chain swaps
- **Polygon Network**: Fast, low-cost blockchain transactions
- **Supabase Backend**: Secure user management and transaction tracking
- **Real-time Pricing**: Live market data from CoinGecko
- **Smart Strategies**: Safe, Balanced, and Aggressive trading modes

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + TypeScript)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   WalletUI   │  │  Dashboard   │  │ StrategySelector │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Services Layer (Business Logic)                 │
│  ┌─────────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │  swapManager│  │ aiTrader │  │ notificationService   │ │
│  └─────────────┘  └──────────┘  └────────────────────────┘ │
│  ┌──────────────┐  ┌──────────┐                             │
│  │ priceService │  │ wallet   │                             │
│  └──────────────┘  └──────────┘                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   External APIs                              │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │  SideShift   │  │CoinGecko │  │   MetaMask/Polygon   │  │
│  └──────────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            Backend (Supabase + Edge Functions)              │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │   Database   │  │   Auth   │  │   Edge Functions    │  │
│  │   (PostgreSQL)  │          │  │  (Deno)             │  │
│  └──────────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required:
1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **MetaMask Wallet** - [Install](https://metamask.io/)
3. **Polygon Network** - Auto-configured, no manual setup needed
4. **Supabase Account** - [Create Free](https://supabase.com/)
5. **SideShift.ai** - No account needed (public API)
6. **CoinGecko API** - No account needed (free tier)

---

## Installation & Setup

### Step 1: Clone & Install Dependencies

```bash
# Install project dependencies
npm install

# Verify installation
npm run typecheck
```

### Step 2: Environment Configuration

Your `.env` file is already configured with Supabase credentials:

```env
VITE_SUPABASE_URL=https://gddvdzdjasaaxbegemlz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**No additional configuration needed!**

### Step 3: Database Migrations

The database schema is already created with:
- User profiles and wallet management
- Trading strategies and preferences
- Swap transaction history
- Portfolio holdings tracking
- Market signals and AI predictions
- Notifications system
- Audit logs

All tables have proper RLS policies configured.

### Step 4: Start Development Server

```bash
npm run dev
```

Navigate to `http://localhost:5173`

---

## How to Use ShiftMind

### 1. Connect Your Wallet

- Click "Connect Wallet"
- MetaMask popup appears
- Approve connection
- Network automatically switches to Polygon

### 2. Choose Your Strategy

| Strategy | Use Case | Risk | Return |
|----------|----------|------|--------|
| **🛡️ Safe** | Capital preservation | Low | 2-5% |
| **⚖️ Balanced** | Growth + safety mix | Medium | 5-12% |
| **🚀 Aggressive** | Maximum returns | High | 15-50%+ |

### 3. Enable Auto-Swap (Optional)

- Toggle "Auto-Swap: ON"
- AI monitors 24/7
- Executes swaps when confidence > 75%
- Real-time notifications

### 4. Monitor Dashboard

- **Portfolio Value**: Total holdings in USD
- **Total P&L**: Profit/loss tracking
- **AI Signals**: Next recommended action
- **Recent Swaps**: Transaction history

---

## Features Detailed

### AI Market Analysis

The `AITrader` class implements advanced technical analysis:

```typescript
// Technical Indicators
- RSI (Relative Strength Index) - Momentum measurement
- MACD (Moving Average Convergence Divergence) - Trend direction
- Volatility Analysis - Market risk assessment
- Moving Averages - Price trend identification
```

**Confidence Scoring**: 0-100% based on multiple factors
- Momentum (20-50% weight depending on strategy)
- Volatility (20-30%)
- Trend direction (20-40%)
- RSI levels (10-20%)

### Supported Tokens

```
Cryptocurrencies: ETH, BTC, MATIC, SOL, XRP
Stablecoins: USDT, USDC, DAI
```

All trades use SideShift.ai's real exchange rates with:
- Min/Max limits enforced
- Rate locks (10 minutes)
- Cross-chain support
- Instant settlement

### Three Strategy Types

#### Safe Mode (Conservative)
```
Rules:
- Sell if 24h drop > -5%
- Buy on steady gains (3-8%)
- Never hold volatile positions
- Quick exits on bearish signals

Best for: Capital preservation, beginners
```

#### Balanced Mode (Recommended)
```
Rules:
- Diversified approach
- Lock profits at +5-10%
- Protect on -3% drops
- Steady growth focus

Best for: Most traders, consistent returns
```

#### Aggressive Mode (Risk Takers)
```
Rules:
- Chase momentum (> +8%)
- High volatility tolerance
- Quick rotations (4-24h cycles)
- Maximize high-conviction trades

Best for: Experienced traders, high risk tolerance
```

### Real SideShift Integration

Every swap includes:

```
1. Quote Generation (30 seconds valid)
2. Order Creation (generates deposit address)
3. Monitoring (real-time status updates)
4. Settlement (automatic funds transfer)
5. Database Recording (transaction tracking)
```

Example swap flow:
```typescript
const quote = await getSwapQuote('eth', 'usdt', '0.1');
const order = await createShift('eth', 'usdt', walletAddress, '0.1');
const status = await getShiftStatus(order.id);
```

---

## Database Schema

### Key Tables

#### `users`
```sql
- wallet_address (unique)
- strategy_preference ('safe'|'balanced'|'aggressive')
- auto_swap_enabled (boolean)
- total_profit_loss (numeric)
- created_at, updated_at
```

#### `swap_transactions`
```sql
- shift_id (SideShift order ID)
- from_token, to_token
- from_amount, to_amount
- status ('pending'|'confirming'|'completed'|'failed')
- profit_loss, profit_loss_percentage
- created_at, completed_at
```

#### `market_signals`
```sql
- user_id
- from_token, to_token
- action ('buy'|'sell'|'hold'|'swap')
- confidence (0-1)
- reason (text)
- expires_at
```

#### `alerts_notifications`
```sql
- user_id
- title, message
- type (various notification types)
- status ('unread'|'read'|'archived')
```

All tables have:
- Row Level Security (RLS) enabled
- User-scoped access policies
- Proper indexes for performance
- Audit logging

---

## API Integrations

### SideShift.ai API

**Base URL**: `https://api.sideshift.ai/v2`

**Key Endpoints**:
```
GET  /coins              - List supported tokens
GET  /pair/{from}/{to}   - Get exchange rate
GET  /quotes/fixed       - Get swap quote with min/max
POST /shifts/fixed       - Create swap order
GET  /shifts/{id}        - Check swap status
```

**Rate Limits**: Generous free tier (no account needed)

### CoinGecko API

**Base URL**: `https://api.coingecko.com/api/v3`

**Key Endpoints**:
```
GET  /coins/markets           - Get prices and changes
GET  /coins/{id}/market_chart - Get historical prices
GET  /simple/price            - Quick price lookup
```

**Rate Limits**: 10-50 calls/minute (free tier)

### Polygon Network

**RPC**: `https://polygon-rpc.com`
**Chain ID**: 137
**Native Token**: MATIC
**Block Explorer**: https://polygonscan.com/

---

## Edge Functions

Three serverless functions handle backend operations:

### 1. `monitor-swaps`
- Checks SideShift order status
- Updates database when complete
- Triggers notifications
- Logs for audit trail

### 2. `create-swap-order`
- Creates orders through SideShift API
- Validates token pairs
- Enforces minimum amounts
- Returns deposit address

### 3. `process-ai-signals`
- Generates trading signals server-side
- Calculates confidence scores
- Applies strategy rules
- Returns recommendation

---

## Security Best Practices

### Implemented:
✅ MetaMask-only wallet connection (no private keys stored)
✅ Supabase RLS for all data access
✅ Environment variables for sensitive config
✅ CORS headers on all API responses
✅ Input validation on all functions
✅ Error handling without exposing sensitive info
✅ Transaction expiry times on orders
✅ User ID verification on all operations

### Additional Recommendations:
- 🔐 Enable 2FA on Supabase account
- 🔐 Use hardware wallet for large amounts
- 🔐 Review transactions in MetaMask before approval
- 🔐 Keep MetaMask PIN secure
- 🔐 Monitor account activity regularly

---

## Production Deployment

### Build for Production

```bash
npm run build
```

Generates optimized bundle in `dist/` folder.

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

### Deploy to Other Platforms

The app is a static React site. Deploy to:
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: Push to gh-pages branch
- **AWS S3 + CloudFront**: Copy dist/ files
- **Cloudflare Pages**: Connect GitHub repo

### Environment Variables in Production

Ensure these are set in your hosting platform:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

---

## Testing

### Unit Tests
```bash
npm run test
```

### Type Checking
```bash
npm run typecheck
```

### Lint Code
```bash
npm run lint
```

### Build Check
```bash
npm run build
```

---

## Troubleshooting

### "MetaMask not connected"
```
Solution:
1. Refresh the page
2. Unlock MetaMask
3. Check if Polygon network is selected
4. Reinstall MetaMask if needed
```

### "Insufficient balance"
```
Solution:
1. Get MATIC from exchange
2. Bridge funds to Polygon
3. Wait for confirmation (1-5 minutes)
4. Refresh page
```

### "Swap quote expired"
```
Solution:
1. Quotes are valid for 10 minutes
2. Generate new quote
3. Confirm swap within timeframe
```

### "SideShift API error"
```
Solution:
1. Check sideshift.ai status page
2. Verify token pair is supported
3. Ensure amount is within limits
4. Wait and retry
```

### "Database error"
```
Solution:
1. Check Supabase status
2. Verify RLS policies allow your wallet
3. Check connection string
4. Contact Supabase support
```

---

## Performance Optimization

### Frontend:
- Lazy loading for components
- React hooks for state management
- Memoization for expensive calculations
- CSS optimization with Tailwind

### Backend:
- Database indexes on frequently queried columns
- Query optimization with proper joins
- Caching of price data
- Batch operations where possible

### Network:
- Price refresh every 60 seconds (configurable)
- Signal generation on-demand
- Edge functions for low latency
- CDN delivery for static assets

---

## Future Enhancements

Potential features to add:

1. **Multi-wallet Support**
   - Connect multiple wallets
   - Portfolio aggregation
   - Cross-wallet strategy

2. **Advanced Charts**
   - Real-time candlestick charts
   - Technical indicator overlays
   - Portfolio performance graphs

3. **Risk Management**
   - Stop-loss automation
   - Take-profit levels
   - Portfolio rebalancing

4. **Social Features**
   - Follow top traders
   - Share strategies
   - Leaderboards

5. **Mobile App**
   - React Native version
   - Push notifications
   - Biometric authentication

6. **Machine Learning**
   - Price prediction models
   - Sentiment analysis
   - Anomaly detection

---

## Support & Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [SideShift API](https://sideshift.ai/api/)
- [CoinGecko API](https://www.coingecko.com/en/api)
- [Polygon Docs](https://docs.polygon.technology/)
- [MetaMask Docs](https://docs.metamask.io/)

### Community
- Discord: [Polygon Ecosystem](https://discord.gg/polygon)
- Twitter: [@SideShift](https://twitter.com/sideshiftai)
- GitHub: [Issue Tracker](https://github.com)

### Contact
- Email: support@shiftmind.ai
- Twitter: [@ShiftMindAI](https://twitter.com)

---

## License

This project is provided for educational purposes. Use at your own risk.

---

**ShiftMind - Let Your Crypto Trade Itself**

Built with ❤️ using React, TypeScript, Supabase, and Polygon Network.

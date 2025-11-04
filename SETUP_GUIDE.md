# ShiftMind - AI-Powered Auto-Invest Bot Setup Guide

## What You Need to Get Started

### 1. MetaMask Wallet
- **Download**: Go to https://metamask.io/ and install the browser extension
- **Create Wallet**: Follow the setup wizard to create your wallet
- **Save Recovery Phrase**: Write down your 12-word recovery phrase and keep it safe
- **Get Your Address**: Your wallet address will look like: `0x1234...abcd`

### 2. Polygon Network Setup
MetaMask needs to connect to Polygon Network. ShiftMind will automatically prompt you to add Polygon Network when you connect your wallet.

**Manual Setup (if needed):**
- Network Name: `Polygon Mainnet`
- RPC URL: `https://polygon-rpc.com`
- Chain ID: `137`
- Currency Symbol: `MATIC`
- Block Explorer: `https://polygonscan.com/`

### 3. Get Some Test MATIC
To test the app, you'll need a small amount of MATIC (Polygon's native token) for transaction fees:
- **Option 1**: Buy on exchanges like Coinbase, Binance, or Crypto.com
- **Option 2**: Bridge from Ethereum using https://wallet.polygon.technology/
- **Option 3**: Use faucets for testnet (Mumbai Testnet)

## How ShiftMind Works

### Architecture Overview

```
┌─────────────────┐
│   Your Wallet   │ (MetaMask - You control your funds)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ShiftMind AI  │ (Analyzes market conditions)
└────────┬────────┘
         │
         ├──► CoinGecko API (Real-time prices)
         │
         ├──► SideShift.ai API (Token swaps)
         │
         └──► Supabase Database (Strategy & history)
```

### Features

1. **Three Trading Strategies**:
   - **Safe Mode**: Conservative, protects capital during downturns
   - **Aggressive**: High-risk, chases momentum for maximum gains
   - **Stable**: Balances between stablecoins and growth assets

2. **AI Market Analysis**:
   - Monitors 6 popular tokens (ETH, BTC, MATIC, USDT, USDC, DAI)
   - Analyzes 24-hour price changes
   - Generates swap recommendations with confidence scores

3. **Automated Trading**:
   - Toggle auto-swap ON/OFF
   - AI executes swaps when confidence > 70%
   - View all swap history and P&L

## APIs Used & How to Access Them

### 1. SideShift.ai API
**What it does**: Facilitates token swaps across chains
**Cost**: FREE - No API key needed!
**Documentation**: https://sideshift.ai/api/
**Already integrated**: The app uses their public API

**How it works**:
```javascript
// Example: Create a swap
POST https://sideshift.ai/api/v2/shifts/fixed
{
  "depositCoin": "eth",
  "settleCoin": "usdt",
  "settleAddress": "your_wallet_address"
}
```

### 2. CoinGecko API
**What it does**: Provides real-time cryptocurrency prices
**Cost**: FREE (with rate limits)
**Documentation**: https://www.coingecko.com/en/api
**Already integrated**: The app fetches prices every 60 seconds

**No API key needed for basic usage!**

### 3. Polygon Network
**What it does**: Fast, low-cost blockchain transactions
**Cost**: Very cheap (~$0.01 per transaction)
**Documentation**: https://docs.polygon.technology/
**Already configured**: App auto-connects to Polygon

### 4. Supabase Database
**What it does**: Stores your strategy, swap history, and portfolio snapshots
**Cost**: FREE tier available
**Already set up**: Database is configured with all tables

## How to Run the App

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173`

### 4. Connect Your Wallet
- Click "Connect Wallet" button
- MetaMask will pop up - click "Connect"
- Approve the Polygon Network switch if prompted

### 5. Choose Your Strategy
- Select Safe, Aggressive, or Stable mode
- Click on your preferred strategy card

### 6. Enable Auto-Swap (Optional)
- Click the "Auto-Swap: OFF" button to turn it ON
- The AI will now automatically execute swaps when conditions are favorable

## Understanding the Dashboard

### Stats Cards
- **Total Swaps**: Number of trades executed
- **Total P&L**: Your profit/loss in USD
- **Strategy**: Current strategy with auto-swap toggle

### AI Recommendation Panel
- **SWAP SUGGESTED** or **HOLD**: Current AI decision
- **Reason**: Explanation of why
- **Confidence**: How confident the AI is (0-100%)
- **From → To**: Which tokens to swap

### Recent Swaps
- View all your swap history
- See amounts, status, profit/loss
- Track performance over time

### Live Prices
- Real-time prices for all supported tokens
- 24-hour price change percentage
- Updates every 60 seconds

## How the AI Makes Decisions

### Safe Mode Strategy
- **Protects capital**: Swaps to stablecoins when price drops > 5%
- **Takes profits**: Enters growth tokens when they're up 5-8%
- **Risk level**: Low
- **Best for**: Capital preservation

### Aggressive Strategy
- **Chases momentum**: Swaps to tokens with highest 24h gains
- **Quick exits**: Leaves declining positions fast
- **Risk level**: High
- **Best for**: Maximum returns

### Stable Strategy
- **Locks profits**: Moves to stablecoins when up > 10%
- **Minimizes losses**: Protects capital when down > 7%
- **Risk level**: Medium
- **Best for**: Balanced growth

## Important Notes

### Safety & Security
- **Non-custodial**: ShiftMind NEVER holds your funds
- **Your keys**: Only you control your wallet
- **Approve transactions**: You must approve each real swap (demo mode is automatic)

### Current Mode: Demo
This version demonstrates the concept with simulated swaps. To implement real swaps:

1. **Get user approval** for each transaction
2. **Integrate Web3.js** or **ethers.js** for blockchain interactions
3. **Handle transaction signing** through MetaMask
4. **Wait for confirmations** on Polygon network
5. **Update swap status** based on blockchain events

### Rate Limits
- **CoinGecko**: 10-50 calls/minute (free tier)
- **SideShift**: Reasonable use encouraged
- **Supabase**: 500MB database, 2GB bandwidth (free tier)

## Troubleshooting

### "MetaMask is not installed"
- Install MetaMask from https://metamask.io/

### "Failed to fetch prices"
- Check your internet connection
- CoinGecko API might be rate-limited (wait 1 minute)

### "Failed to create shift"
- SideShift API might be temporarily unavailable
- Check the token pair is supported

### Wallet not connecting
- Refresh the page
- Unlock MetaMask
- Make sure you're on Polygon network

## Next Steps for Production

To make this production-ready:

1. **Real blockchain integration**:
   - Add ethers.js or web3.js
   - Implement transaction signing
   - Handle gas fees and confirmations

2. **Enhanced AI**:
   - Integrate OpenAI API for smarter predictions
   - Add technical indicators (RSI, MACD, etc.)
   - Machine learning model training

3. **More features**:
   - Portfolio rebalancing
   - Stop-loss and take-profit limits
   - Multi-wallet support
   - Email/SMS notifications

4. **Security**:
   - Audit smart contracts
   - Add rate limiting
   - Implement 2FA
   - Add spending limits

## Resources

- **SideShift API Docs**: https://sideshift.ai/api/
- **CoinGecko API**: https://www.coingecko.com/en/api
- **Polygon Docs**: https://docs.polygon.technology/
- **MetaMask Docs**: https://docs.metamask.io/
- **Supabase Docs**: https://supabase.com/docs

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure MetaMask is unlocked and on Polygon network
3. Verify you have enough MATIC for gas fees
4. Check API status pages for any outages

---

**Built with**: React + TypeScript + Vite + Tailwind CSS + Supabase
**Blockchain**: Polygon Network
**Swap Provider**: SideShift.ai
**Price Data**: CoinGecko API

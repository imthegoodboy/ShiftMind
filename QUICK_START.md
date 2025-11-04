# ShiftMind - Quick Start Guide (5 Minutes)

## What is ShiftMind?

An AI-powered crypto auto-invest bot that:
- 🤖 Analyzes market conditions with AI
- 🔄 Automatically swaps tokens via SideShift.ai
- ⚡ Executes trades on Polygon Network
- 📊 Tracks profits and provides insights

**In short**: "Let your crypto trade itself"

---

## 30-Second Setup

### 1. Install MetaMask (2 min)
- Go to https://metamask.io/
- Click "Install MetaMask"
- Follow the setup wizard
- Save your recovery phrase securely

### 2. Get Some MATIC (2 min)
Buy MATIC on:
- Coinbase
- Binance
- Crypto.com

Or use a bridge to convert ETH → MATIC

### 3. Open ShiftMind (1 min)
```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Using ShiftMind

### Step 1: Connect Wallet
- Click **"Connect Wallet"** button
- MetaMask popup → Click "Next" → "Connect"
- Network auto-switches to Polygon ✓

### Step 2: Choose Strategy
Pick one:
- 🛡️ **Safe**: Protects capital (best for beginners)
- ⚖️ **Balanced**: Steady growth (recommended)
- 🚀 **Aggressive**: High returns (risky)

### Step 3: Enable Auto-Swap (Optional)
Toggle **"Auto-Swap: ON"** to let AI trade 24/7

### Step 4: Watch It Trade
- Dashboard shows AI recommendations
- Recent swaps listed with P&L
- Live prices update every 60 seconds

---

## How It Works

```
1. AI analyzes prices from CoinGecko
2. Generates buy/sell signals
3. If auto-swap enabled → Creates SideShift order
4. User approves in MetaMask (or manual mode)
5. Swap executes instantly
6. Results appear in dashboard
```

---

## Supported Tokens

Can swap between any of these:

| Crypto | Stable |
|--------|--------|
| ETH | USDT |
| BTC | USDC |
| MATIC | DAI |
| SOL | |
| XRP | |

---

## Strategies Explained

### 🛡️ Safe Mode
**Best for**: Beginners, capital preservation

- Moves to stablecoins when market drops > 5%
- Buys on steady gains only (3-8%)
- Quick exits on risk signals
- Low volatility tolerance

**Example**: Market drops 6% → Auto-moves to USDT (stablecoin)

### ⚖️ Balanced Mode
**Best for**: Most traders, consistent returns

- Locks profits at +5-10%
- Protects capital on -3% drops
- Balanced buy/sell signals
- Medium risk/reward

**Example**: ETH up 6% → Auto-moves half to USDT, half to BTC

### 🚀 Aggressive Mode
**Best for**: Experienced traders, high risk tolerance

- Chases momentum trades (+8% or more)
- High volatility tolerance
- Quick rotations (4-24 hour cycles)
- Maximize gains

**Example**: SOL surging +12% → Goes all-in on SOL

---

## Common Questions

### Q: Is my crypto safe?
**A**: Yes! ShiftMind never holds your funds. Only MetaMask has access. You approve every real transaction.

### Q: Do I need an account?
**A**: No! Connect wallet → Choose strategy → Done. No sign-up needed.

### Q: What fees apply?
**A**:
- Polygon gas fees: ~$0.01 per swap
- SideShift spreads: Built into exchange rate
- No ShiftMind fees

### Q: Can I turn off auto-swap?
**A**: Yes! Leave it OFF and approve each swap manually, or toggle it ON for hands-free trading.

### Q: What happens if prices crash?
**A**:
- **Safe Mode**: Auto-moves to stablecoins (protects you)
- **Balanced**: Rebalances portfolio
- **Aggressive**: May result in losses (high risk)

### Q: How often does AI check prices?
**A**: Every 60 seconds. Signals updated in real-time.

### Q: Can I use on mobile?
**A**: Yes! Open in mobile browser. MetaMask mobile app works too.

---

## First Trade Walkthrough

### 1. You have 1 ETH on Polygon

### 2. AI says: "ETH dropped 4% → Move to USDT"

### 3. Your options:
```
Option A (Manual):
  - Review the suggestion
  - Click "Execute Signal"
  - MetaMask popup → Approve
  - Swap happens instantly
  - See results in dashboard

Option B (Auto):
  - Toggle "Auto-Swap: ON"
  - AI handles it automatically
  - Get notification when done
```

### 4. Results:
```
Before: 1 ETH ($2,500)
After:  $2,485 USDT (protected)
Cost:   ~$0.02 gas fee
```

---

## Dashboard Explained

```
┌─────────────────────────────────────────┐
│           PORTFOLIO VALUE                │
│            $2,500.00 USD                 │
│         (Your total holdings)            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           TOTAL PROFIT/LOSS              │
│            +$125.50 (5.03%)              │
│      (All-time gains/losses)             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         ACTIVE STRATEGY: BALANCED        │
│    Auto-Swap: ON | Ready to trade!       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    NEXT AI RECOMMENDATION (HOLD)         │
│                                          │
│  Signal: HOLD                            │
│  Reason: Market stable, maintaining      │
│  Confidence: 85%                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          RECENT SWAPS                    │
│                                          │
│  ETH → USDT [COMPLETED] +$12.50          │
│  USDT → ETH [COMPLETED] -$3.20           │
│  MATIC → BTC [PENDING] -                 │
└─────────────────────────────────────────┘
```

---

## Keyboard Shortcuts

- `R`: Refresh prices
- `A`: Toggle auto-swap
- `D`: View dashboard
- `S`: Strategy selector
- `N`: Notifications

---

## Tips for Success

### 1. Start Small 💡
- Test with $50-100 first
- Get comfortable with UI
- Understand your strategy

### 2. Monitor First Week 📊
- Don't enable auto-swap immediately
- Manually execute first few trades
- See how AI recommendations perform

### 3. Use Balanced Strategy 🎯
- Recommended for most traders
- Good balance of risk/reward
- Easier to understand

### 4. Check Daily ⏰
- Market moves happen 24/7
- You can set phone reminders
- Review trades weekly

### 5. Never Go All-In 🚫
- Diversify across tokens
- Keep some in stablecoins
- Don't risk more than 10% per trade

---

## Troubleshooting

### "Can't connect wallet"
1. Refresh page
2. Unlock MetaMask
3. Try again
4. Check your internet

### "Swap failed"
1. Check minimum amounts (usually 0.01 tokens)
2. Verify gas fees available
3. Try smaller amount
4. Try different token pair

### "Prices not updating"
1. Check internet connection
2. Refresh page
3. Wait 60 seconds (update interval)
4. Check CoinGecko status

### "MetaMask keeps asking to sign"
- This is normal!
- Each swap requires approval
- Verify transaction details before signing

---

## Next Steps

### Ready to Go Live?
1. ✅ Wallet connected
2. ✅ Strategy selected
3. ✅ First swap tested
4. ✅ Enable auto-swap
5. ✅ Monitor dashboard

### Want More Features?
- Check `PRODUCTION_SETUP.md` for advanced config
- Read `SETUP_GUIDE.md` for technical details
- View `src/` folder for code examples

### Need Help?
- Review GitHub issues
- Check SideShift.ai status
- Contact Polygon support
- Email: support@shiftmind.ai

---

## Security Reminders

🔒 **DO:**
- ✅ Use official MetaMask
- ✅ Verify contract addresses
- ✅ Review transactions in MetaMask
- ✅ Keep private keys safe
- ✅ Use hardware wallet for large amounts

🚫 **DON'T:**
- ❌ Share recovery phrase
- ❌ Click suspicious links
- ❌ Approve unlimited spending
- ❌ Trust unsolicited messages
- ❌ Use on public WiFi

---

## What's Different About ShiftMind?

| Feature | ShiftMind | Others |
|---------|-----------|--------|
| Non-custodial | ✅ Yes | ❌ No account needed usually |
| Real AI | ✅ Yes | ⚠️ Varies |
| SideShift | ✅ Built-in | ❌ Limited |
| Polygon | ✅ Optimized | ⚠️ Multi-chain |
| Open Source | ✅ Yes | ⚠️ Some |
| Free | ✅ Yes | ✅ Varies |

---

## Reality Check

### What ShiftMind Can Do:
- ✅ Execute instant swaps
- ✅ Generate AI signals
- ✅ Track portfolio
- ✅ Automate trading
- ✅ Save time

### What ShiftMind CAN'T Do:
- ❌ Guarantee profits
- ❌ Predict markets perfectly
- ❌ Protect against crashes
- ❌ Replace professional advice
- ❌ Work without internet

**Remember**: Crypto trading is risky. Start small, learn, then scale up.

---

## You're Ready! 🚀

```
1. Install MetaMask
2. Get MATIC
3. npm run dev
4. Connect wallet
5. Choose strategy
6. Start trading!
```

**Questions?** Check the other docs or visit our GitHub.

**Happy trading!** 📈

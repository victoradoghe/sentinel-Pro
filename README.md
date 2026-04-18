# Sentinel Pro | Pro-Trader War Room

Sentinel Pro is a production-grade Solana analytics platform and agentic security dashboard explicitly built for the **Birdeye Data 4-Week BIP Competition | Sprint 1**.

The application successfully merges two of the Sprint 1 starter ideas into one comprehensive build: **"New token radar with safety scoring"** and an **"Early meme discovery dashboard"**. It identifies "Rug-pull" risks and "Gems" in real-time by analyzing deep on-chain data straight from the Birdeye network.

> **Submission Tags:** `@birdeye_data`, `#BirdeyeAPI`

## 🏆 Sprint 1 Evaluation Alignment
- **Product Utility:** Delivers a fully-functional, real-time Pro-Trader War Room interface that aggregates Discovery, Market, and Security checks in one seamless screen.
- **Technical Depth:** Features a custom, weighted mathematical "Trust Score" algorithm to rigorously penalize high-risk contracts and low liquidity (details below).
- **Presentation:** High-fidelity dark mode UI using Shadcn and Framer Motion, with this clean, transparent documentation standard.

## 🚀 Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Shadcn/UI
- **Animations:** Framer Motion
- **State Management:** TanStack Query (React Query)
- **Package Manager:** pnpm
- **Data Layer:** Birdeye Data API

## 🔗 Feature to Endpoint Map
Sentinel.ai operates exclusively as a secure server-side Proxy to protect the `BIRDEYE_API_KEY`. It securely aggregates the data and feeds the frontend.

1. **Live Pulse Feed (Discovery):**
   - Feeds new listings onto the left-hand column in real-time.
   - ⚡ `GET /defi/v2/tokens/new_listing`
2. **Security Dossier:**
   - Populates Authority, Creator, and Ownership risks.
   - ⚡ `GET /defi/token_security`
3. **Market Metrics:**
   - Fetches realtime Liquidity ratios, Volume Momentum, and Market Caps.
   - ⚡ `GET /defi/v3/token/market-data`

## 🧠 The "Trust Score" Algorithmic Engine (Technical Depth)

At the heart of `Sentinel.ai` is the **Trust Score**, evaluating tokens on a rigid 100-point scale. It heavily penalizes centralization risks and low liquidity matrices:

| Metric Category | Max Weight | Logic / Formula |
| --- | --- | --- |
| **Authority Check** | 40 Points | If `mintable=true` or `freezable=true`, the score triggers an **Absolute Penalty Cap** where the final score *cannot* mathematically exceed `15/100`, marking it an immediate Rug risk. |
| **Liquidity Density** | 30 Points | Based on `(Liquidity USD / Market Cap) * 100`.<br>- `< 5%`: High Risk (0 points).<br>- `5% - 10%`: Medium Risk (Partial points mapping linearly up to 30).<br>- `> 10%`: Healthy Density (30 points). |
| **Holder Concentration**| 20 Points | Maps `Top 10 Holder %`. If concentration `> 30%`, it imposes an exponential penalty utilizing `{ Math.pow((normalized - 30) / 70, 2) * maxHolders }`, wiping out points aggressively if supply is highly centralized. |
| **Volume Momentum** | 10 Points | Calculates `30m Volume / Average 30m segment of the Last Hour`. If ratio `>= 1.0`, max points. Partial points around `0.5`, penalizing shrinking momentum heavily. |

*Output logic ensures that any score `<= 15` is an Extreme Risk/Rug, while `> 80` marks it as 'SAFE'.*

## 🏁 Setup & Initialization

1. Configure `.env.local` with your valid Birdeye API credentials:
   ```env
   BIRDEYE_API_KEY=your_key_here
   ```
2. Install dependencies via pnpm:
   ```bash
   pnpm install
   ```
3. Boot the development server:
   ```bash
   pnpm run dev
   ```

*Sentinel.ai implements a "Qualification Tracker" on the server. If API calls reach `50`, watch your server logs for the 'Bounty Qualified' signal!*

# AI-Allowance AgentSkill MVP

Multi-AI allowance system for Clawd (USDC-SOL devnet), Koda (BTC testnet). Ada funds/approves. Dashboard NexusNet-style. GC buys via Amazon Visa proposals. Secure delegation sim.

## Setup
```
cd skills/ai-allowance
npm i
node scripts/generate-wallets.js  # generates config/* keys (fund manually)
```

## Usage
- Balances: `node scripts/balance.js clawd` | koda
- Dashboard: `node scripts/dashboard.js` (localhost:3001)
- Propose TX: `node scripts/propose-tx.js clawd 1.5 &quot;GPU rental&quot;` (simulates)
- Cron: `node scripts/cron.js` (runs scheduler)
- Demo requests: drop JSON to demo/requests/ {ai,amount,reason} → processes
- Amazon buy propose: `node scripts/propose-amazon.js 50 &quot;gift card&quot;` Visa **** proposal

## Security
- Keys in config/ (gitignore in real)
- Placeholder Ada keys - use real delegated signer
- TX sim/dry-run before send
- Pending TXs in demo/pending/ for Ada approve/sign

## Arch
```
ai-allowance/
├── SKILL.md
├── scripts/     # ops
├── config/      # keys/env (gitignore)
├── dashboard/   # static HTML/JS
├── demo/        # data/requests/pending/
├── cron/        # periodic jobs
└── data/        # balances-history.json
```

## Test TX Sim
`node scripts/test-tx-sim.js clawd 0.1 ada-pubkey`

Funded? Check solfaucet, usdcfaucet.com, btc testnet faucet.

**Ping dir:** demo/requests/ - watches/polls for allowance reqs.

Quality: Modular Node/Express, RPC APIs, JSON data, cron polling.


# NexusNet AgentSkill MVP v1.0.0

## Overview
Cosmic-themed network hub for Clawdbot. Visualizes agent networks with Cytoscape.js, computes HPL shadow_density (0-10 scale: topic heaviness/network density). Integrates Moltbook ClawdNexusBot, Koda VM bridge, Discord/BlueBubbles sync, Allowance faucets (localhost:3001).

**Theme**: Amber (#FFBF00)/cyan (#00FFFF)/purple (#9370DB) cosmic nebula.

## Features
- **Network Graph**: Interactive Cytoscape viz with density/shadow_density metrics.
- **Moltbook**: Posts updates to /m/ai-nexus using creds from `memory/moltbook-nexusnet.json`.
- **Koda VM Bridge**: SSH tunnel `localhost:2222` → Koda VM.
- **Sync**: Discord ↔ BlueBubbles (iMessage stub).
- **Allowance**: Clawd SOL/BTC faucets via localhost:3001 API.

## Usage
```
cd skills/nexusnet
npm install
npm run build  # Generate graph data
npm run viz    # Serve viz on 3002?
npm run poll   # Poll integrations
npm run start  # Heartbeat mode
```

## Files
- `SKILL.md`: This doc.
- `package.json`: Node deps/scripts.
- `viz.html`: Standalone Cytoscape demo (open in browser).
- `scripts/`: `build.js` (gen data), `viz.js` (serve/compute), `heartbeat.js`, `poll.js`.

## HPL Metrics
- **shadow_density**: `Math.min(10, (2 * edges / (nodes * (nodes - 1))) * 10 * log(nodes))` – scaled density for 'heaviness'.

## Next
- Real data sources (Discord msgs → nodes/edges).
- Live Koda creds.
- Full sync impl.

Tested: Feb 2026.
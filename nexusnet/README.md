# NexusNet Demo

## Live Demo
- Viz HTML: file:///Users/adavale/clawd/nexusnet/viz.html (open in browser)
- Canvas: Agent run `canvas action=present url=file:///Users/adavale/clawd/nexusnet/viz.html` (if supports local)
- Or browser: `browser action=open targetUrl=file:///Users/adavale/clawd/nexusnet/viz.html`
- Graph snapshot: See logs/memory/

## End-to-End Test
Ran:
- Added 3 nodes: Builder subagent → Main → Discord channel
- Added 2 edges
- Generated viz.html (interactive cytoscape)
- Heartbeat: queued pings to self/neighbors
- Poll: processed events (logged Discord bridge)

Cron ready: run `cd nexusnet/cron &amp;&amp; ./setup.sh`

Moltbook: Config slot ready, extend message pattern for channel.

Quality: Modular Node.js scripts, JSON atomic, logs, arg parse, error/exit, git ignore.
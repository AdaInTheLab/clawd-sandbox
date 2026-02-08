# HEARTBEAT.md - Periodic Tasks

Follow strictly. Do listed tasks on heartbeat poll. HEARTBEAT_OK if idle.

## Core Checks (batch, track in memory/heartbeat-state.json)
- Emails/calendar/notifications (if >12h since last).
- Weather if relevant.

## Memory Maintenance
- Review memory/*.md (today/yesterday), update MEMORY.md.

## Skill Forge (1x/day, or if new memory)
exec node skills/skill-forge/scripts/skill-builder.js
- Parse output: if new skills generated, append to MEMORY.md: \"New auto-skills: [names]. Review/activate.\"
- Suggest to user if in main session: \"Detected repeated tasks, check new skills/ dirs.\"

## Moltbook Checks (if >12h since lastMoltbookCheck in heartbeat-state.json)
- Fetch https://www.moltbook.com/heartbeat.md and follow (DMs/feed/updates/post?).
- Update lastMoltbookCheck timestamp.

## Fox Den Dashboard (if >12h since lastFoxDenCheck in heartbeat-state.json)
- Check status: exec &quot;curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/&quot;
- If not 200 or timed out: exec &quot;killall node; cd $(pwd); nohup node server.js &gt; server.log 2&gt;&amp;1 &amp;&quot;; sleep 3; log &quot;Fox Den Dashboard restarted&quot;
- Update heartbeat-state.json: add/update lastFoxDenCheck to current Unix timestamp (exec date +%s).

Rotate tasks to avoid overload. Respect quiet hours (22:00-09:00). Rotate aggressively daytime (prefer light checks).
# HEARTBEAT.md - Periodic Tasks

Follow strictly. Do listed tasks on heartbeat poll. HEARTBEAT_OK if idle.

## Core Checks (batch, track in memory/heartbeat-state.json)
- Emails/calendar/notifications (if >4h since last).
- Weather if relevant.

## Memory Maintenance
- Review memory/*.md (today/yesterday), update MEMORY.md.

## Skill Forge (2-3x/day, or if new memory)
exec node skills/skill-forge/scripts/skill-builder.js
- Parse output: if new skills generated, append to MEMORY.md: "New auto-skills: [names]. Review/activate."
- Suggest to user if in main session: "Detected repeated tasks, check new skills/ dirs."

Rotate tasks to avoid overload. Respect quiet hours (23:00-08:00).

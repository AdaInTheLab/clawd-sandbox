#!/bin/bash
DIR=\"/Users/adavale/clawd/nexusnet\"
CRON=\"*/5 * * * * cd \$DIR && /usr/bin/env node scripts/heartbeat.js >/dev/null 2>&1\"
(crontab -l 2>/dev/null; echo \"\$CRON\") | crontab -
echo \"Cron setup: every 5min run heartbeat.js\"
crontab -l | grep nexusnet || echo \"Failed to setup cron\"
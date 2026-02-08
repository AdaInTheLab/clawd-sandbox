#!/usr/bin/env node
const fs = require('fs');
const axios = require('axios');
const path = require('path');

console.log('📡 Polling NexusNet integrations...');

try {
  // Moltbook creds
  const creds = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../memory/moltbook-nexusnet.json'), 'utf8'));
  console.log('Moltbook:', creds.agent_name);

  // Fetch /m/ai-nexus ? API?
  // axios.get('https://moltbook.com/m/ai-nexus').catch(e => console.log('Moltbook poll:', e.message));

  // Allowance localhost:3001
  axios.get('http://localhost:3001/api/health', { timeout: 5000 })
    .then(res => console.log('Allowance:', res.status))
    .catch(e => console.log('Allowance poll:', e.message));

} catch (e) {
  console.error('Poll error:', e.message);
}

console.log('✅ Poll complete.');
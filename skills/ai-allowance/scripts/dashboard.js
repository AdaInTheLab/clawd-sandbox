const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dashboard'));

app.get('/api/balances', async (req, res) => {
  try {
    let clawdOut = execSync('node scripts/balance.js clawd', {encoding: 'utf8'});
    clawdOut = clawdOut.split('\\n').slice(1).join('\\n').trim();
    const clawd = JSON.parse(clawdOut) || {sol:0, usdc:0};
    let kodaOut = execSync('node scripts/balance.js koda', {encoding: 'utf8'});
    kodaOut = kodaOut.split('\\n').slice(1).join('\\n').trim();
    const koda = JSON.parse(kodaOut) || {btc:0};
    res.json({clawd, koda});
  } catch (e) {
    res.json({error: e.message});
  }
});

app.get('/api/wallets', (req, res) => {
  try {
    const clawdPath = path.join(__dirname, '../config/clawd-sol.json');
    const clawd = fs.existsSync(clawdPath) ? JSON.parse(fs.readFileSync(clawdPath, 'utf8')) : {publicKey: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'};
    const kodaPath = path.join(__dirname, '../config/koda-btc.json');
    const koda = fs.existsSync(kodaPath) ? JSON.parse(fs.readFileSync(kodaPath, 'utf8')) : {address: 'tb1q5r5qyhqp9rdqfnuzfh42w2lcemq9d9n57d7d6n'};
    res.json({
      clawd: {
        solFaucet: `https://faucet.solana.com/?address=${clawd.publicKey}`,
        usdcFaucet: `https://usdcfaucet.com/?address=${clawd.publicKey}`
      },
      koda: {
        btcFaucet: `https://testnet.coinfaucet.eu/?address=${koda.address}`
      }
    });
  } catch (e) {
    res.json({error: e.message});
  }
});

app.post('/api/propose', (req, res) => {
  try {
    const {ai, amount, reason} = req.body;
    if (!ai || !amount || !reason) return res.status(400).json({error: 'missing fields'});
    const id = Date.now().toString();
    const tx = {id, ai, amount: parseFloat(amount), reason, status: 'pending', time: Date.now()};
    const dir = path.join(__dirname, '../demo/pending');
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(tx, null, 2));
    res.json({success: true, id});
  } catch (e) {
    res.json({error: e.message});
  }
});

app.get('/api/pending', (req, res) => {
  try {
    const dir = path.join(__dirname, '../demo/pending');
    const pending = [];
    if (fs.existsSync(dir)) {
      for (let f of fs.readdirSync(dir)) {
        if (f.endsWith('.json')) {
          pending.push(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
        }
      }
    }
    res.json(pending.sort((a,b) => b.time - a.time));
  } catch (e) {
    res.json({error: e.message});
  }
});

app.post('/api/approve/:id', (req, res) => {
  try {
    const id = req.params.id;
    const f = path.join(__dirname, '../demo/pending', `${id}.json`);
    if (!fs.existsSync(f)) return res.json({error: 'not found'});
    const tx = JSON.parse(fs.readFileSync(f, 'utf8'));
    tx.status = 'approved';
    tx.approvedTime = Date.now();
    fs.writeFileSync(f, JSON.stringify(tx, null, 2));
    console.log(`Approved TX ${id}: ${tx.ai} $${tx.amount} "${tx.reason}"`);
    res.json({success: true});
  } catch (e) {
    res.json({error: e.message});
  }
});

app.post('/api/reject/:id', (req, res) => {
  try {
    const id = req.params.id;
    const f = path.join(__dirname, '../demo/pending', `${id}.json`);
    if (fs.existsSync(f)) fs.unlinkSync(f);
    res.json({success: true});
  } catch (e) {
    res.json({error: e.message});
  }
});

app.get('/api/history', (req, res) => {
  res.json([
    {date: '2024-10-01', clawd_usdc: 100, koda_btc: 0.005},
    {date: '2024-10-02', clawd_usdc: 95, koda_btc: 0.01},
  ]);
});

app.listen(3001, () => console.log('Dashboard at http://localhost:3001'));

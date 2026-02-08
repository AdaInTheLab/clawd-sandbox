// balance.js &lt;wallet&gt;  clawd|koda|ada
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress, getAccount } = require('@solana/spl-token');
const bitcoin = require('bitcoinjs-lib');
const fetch = require('node-fetch'); // npm i node-fetch
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const SOL_RPC = process.env.SOLANA_RPC || 'https://api.devnet.solana.com';
const USDC_MINT = process.env.USDC_MINT || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';
const BTC_API = process.env.BTC_EXPLORER || 'https://blockstream.info/testnet/api';

const connection = new Connection(SOL_RPC, 'confirmed');

async function getSolBalance(pubkey) {
  return await connection.getBalance(new PublicKey(pubkey)) / 1e9;
}

async function getUsdcBalance(pubkey) {
  const ata = await getAssociatedTokenAddress(new PublicKey(USDC_MINT), new PublicKey(pubkey));
  try {
    const acc = await getAccount(connection, ata);
    return acc.amount / 1e6;
  } catch {
    return 0;
  }
}

async function getBtcBalance(address) {
  const res = await fetch(`${BTC_API}/address/${address}`);
  const data = await res.json();
  return data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
}

async function main(wallet) {
  let balances = {};
  if (wallet === 'clawd') {
    const conf = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/clawd-sol.json')));
    balances.sol = await getSolBalance(conf.publicKey);
    balances.usdc = await getUsdcBalance(conf.publicKey);
  } else if (wallet === 'koda') {
    const conf = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/koda-btc.json')));
    balances.btc = await getBtcBalance(conf.address) / 1e8;
  } else if (wallet === 'ada') {
    // similar
  }
  console.log(JSON.stringify(balances, null, 2));
}

const [,, wallet] = process.argv;
main(wallet || 'all').catch(console.error);

#!/usr/bin/env node
const express = require('express');
const path = require('path');
const open = require('open'); // optional, npm i open

const app = express();
const PORT = 3002;

app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'viz.html'));
});

app.listen(PORT, () => {
  console.log(`🌌 NexusNet Viz server on http://localhost:${PORT}/viz.html`);
  // open(`http://localhost:${PORT}/viz.html');
});
console.log('Stop with Ctrl+C');
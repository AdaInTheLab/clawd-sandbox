#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');

console.log('🔨 Building NexusNet...');

const graphData = {
  nodes: [
    { data: { id: 'clawd', label: 'Clawd Agent' } },
    { data: { id: 'nexusnet', label: 'NexusNet' } },
    { data: { id: 'moltbook', label: 'Moltbook' } },
    { data: { id: 'koda', label: 'Koda VM' } },
    { data: { id: 'discord', label: 'Discord' } },
    { data: { id: 'allowance', label: 'Allowance Faucets' } }
  ],
  edges: [
    { data: { source: 'clawd', target: 'nexusnet' } },
    { data: { source: 'nexusnet', target: 'moltbook' } },
    { data: { source: 'nexusnet', target: 'koda' } },
    { data: { source: 'nexusnet', target: 'discord' } },
    { data: { source: 'nexusnet', target: 'allowance' } }
  ]
};

fs.writeJsonSync(path.join(__dirname, '../graph.json'), graphData, { spaces: 2 });

const density = (2 * graphData.edges.length / (graphData.nodes.length * (graphData.nodes.length - 1))).toFixed(3);
const shadow = Math.min(10, parseFloat(density) * 10 * Math.log(graphData.nodes.length)).toFixed(1);

console.log(`Graph built: ${graphData.nodes.length} nodes, ${graphData.edges.length} edges`);
console.log(`Density: ${density}, Shadow Density: ${shadow}/10`);

console.log('✅ Build complete. Open viz.html for demo.');
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const dir = path.dirname(__dirname);
const graphPath = dir + "/graph.json";
const vizPath = dir + "/viz.html";
const logPath = dir + "/memory/viz.log";

function log(msg) {
  const ts = new Date().toISOString();
  fs.appendFileSync(logPath, `[${ts}] ${msg}\n`);
  console.log(msg);
}

function loadGraph() {
  try {
    const data = fs.readFileSync(graphPath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    log(`Error: ${e.message}`);
    process.exit(1);
  }
}

const graph = loadGraph();
const degrees = {};\n      graph.edges.forEach(e => {\n        degrees[e.from] = (degrees[e.from] || 0) + 1;\n        degrees[e.to] = (degrees[e.to] || 0) + 1;\n      });\n      const nodes = Object.entries(graph.nodes).map(([id, props]) => ({\n        data: {\n          id,\n          label: props.name || id,\n          type: props.type,\n          shadowDensity: Math.min(10, degrees[id] || 0)\n        }\n      }));
const edgesData = graph.edges.map(e => ({data: {source: e.from, target: e.to, label: e.type}}));

const html = `<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/cytoscape@3.23.0/dist/cytoscape.min.js"></script>
  <style>
    body { margin: 0; font-family: Arial; background: radial-gradient(circle farthest-side at 30% 90%, #2e0249 0%, #1a0033 40%, #000428 100%); color: #e6e6fa; }
    #cy { width: 100vw; height: 100vh; }
    h1 { position: absolute; top: 10px; left: 10px; z-index: 100; color: #FFD700; text-shadow: 0 0 10px rgba(255,165,0,0.6); }
  </style>
</head>
<body>
  <h1>NexusNet Graph (${nodes.length} nodes, ${edgesData.length} edges)</h1>
  <div id="cy"></div>
  <script>
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: ${JSON.stringify([...nodes, ...edgesData])},
      style: [\n        {selector: "core", style: {"background-color": "#000011", "background-gradient-stop-colors": "#000011 #2a0a4a #110033", "background-gradient-angle": 135}},
        {selector: "node", style: {"label": "data(label)", "text-valign": "center", "width": "mapData(shadowDensity, 0, 10, 30, 90)", "height": "mapData(shadowDensity, 0, 10, 30, 90)", "font-size": "mapData(shadowDensity, 0, 10, 12, 24)", "background-opacity": "mapData(shadowDensity, 0, 10, 0.4, 1)", "background-color": "#FF8C42", "text-opacity": 1}},
        {selector: "node[type=\\"agent\\"]", style: {"background-color": "#FF6B35", "background-gradient-stop-colors": "#FF4500 #FF8C00", "background-gradient-angle": 45}},
        {selector: "node[type=\\"human\\"]", style: {"background-color": "#FF9500"}},
        {selector: "node[type=\\"channel\\"]", style: {"background-color": "#FAD5A5"}},        {selector: "node[type=\\"private\\"]", style: {"background-color": "#9370DB"}},
        {selector: "edge", style: {"width": 4, "line-color": "#40E0D0", "target-arrow-shape": "triangle", "curve-style": "bezier", "label": "data(label)", "font-size": 12, "text-rotation": "autorotate"}},
        {selector: "edge[label=\\"follow\\"]", style: {"line-color": "#00CED1"}},
        {selector: "edge[label=\\"ping\\"]", style: {"line-color": "#AFEEEE", "animation-duration": "3s", "animation-opacity": "true", "line-style": "dashed"}}
      ],
      layout: {name: "cose"}
    });
    cy.on("tap", "node", (evt) => alert("Clicked: " + evt.target.id()));
  </script>
</body>
</html>`;

fs.writeFileSync(vizPath, html);
log(`Viz generated: ${vizPath}`);
console.log(`Live demo: file://${process.cwd()}/nexusnet/viz.html`);
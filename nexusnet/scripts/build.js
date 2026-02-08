#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const dir = path.dirname(__dirname);
const graphPath = dir + "/graph.json";
const logPath = dir + "/memory/build.log";

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
    log(`Error loading graph: ${e.message}`);
    return {version: "1.0", nodes: {}, edges: [], timestamp: Date.now()};
  }
}

function saveGraph(graph) {
  try {
    graph.timestamp = Date.now();
    fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2));
    log(`Graph saved: ${Object.keys(graph.nodes).length} nodes, ${graph.edges.length} edges`);
  } catch (e) {
    log(`Error saving graph: ${e.message}`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || (cmd !== "add-node" && cmd !== "add-edge" && cmd !== "list")) {
  console.log("Usage: node build.js <cmd> [--id <id>] [--type <type>] [--name <name>] [--from <from>] [--to <to>] [--type-edge <type>] [--strength <1>]");
  process.exit(1);
}

let graph = loadGraph();

if (cmd === "add-node") {
  const idMatch = args.find(arg => arg.startsWith("--id="));
  const id = idMatch ? idMatch.split("=")[1] : (args.indexOf("--id") > 0 ? args[args.indexOf("--id") + 1] : null);
  const typeMatch = args.find(arg => arg.startsWith("--type="));
  const type = typeMatch ? typeMatch.split("=")[1] : (args.indexOf("--type") > 0 ? args[args.indexOf("--type") + 1] : null);
  const nameMatch = args.find(arg => arg.startsWith("--name="));
  const name = nameMatch ? nameMatch.split("=")[1] : (args.indexOf("--name") > 0 ? args[args.indexOf("--name") + 1] : null);
  
  if (!id || !type) {
    log("Missing --id or --type");
    process.exit(1);
  }
  
  graph.nodes[id] = {type, name: name || id, status: "online", updated: Date.now()};
  saveGraph(graph);
  log(`Added node: ${id} (${type})`);
} else if (cmd === "add-edge") {
  const fromMatch = args.find(arg => arg.startsWith("--from="));
  const from = fromMatch ? fromMatch.split("=")[1] : (args.indexOf("--from") > 0 ? args[args.indexOf("--from") + 1] : null);
  const toMatch = args.find(arg => arg.startsWith("--to="));
  const to = toMatch ? toMatch.split("=")[1] : (args.indexOf("--to") > 0 ? args[args.indexOf("--to") + 1] : null);
  const typeMatch = args.find(arg => arg.startsWith("--type-edge="));
  const typeEdge = typeMatch ? typeMatch.split("=")[1] : (args.indexOf("--type-edge") > 0 ? args[args.indexOf("--type-edge") + 1] : "follow");
  const strengthMatch = args.find(arg => arg.startsWith("--strength="));
  const strength = parseInt(strengthMatch ? strengthMatch.split("=")[1] : "1");
  
  if (!from || !to) {
    log("Missing --from or --to");
    process.exit(1);
  }
  
  graph.edges.push({from, to, type: typeEdge, strength, created: Date.now()});
  saveGraph(graph);
  log(`Added edge: ${from} --${typeEdge}--> ${to} (strength ${strength})`);
} else if (cmd === "list") {
  console.log(JSON.stringify(graph, null, 2));
}

log("Build complete");
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const dir = path.dirname(__dirname);
const graphPath = dir + "/graph.json";
const eventsPath = dir + "/events.json";
const logPath = dir + "/memory/heartbeat.log";

function log(msg) {
  const ts = new Date().toISOString();
  fs.appendFileSync(logPath, `[${ts}] ${msg}\n`);
  console.error(msg);
}

function loadGraph() {
  try {
    const data = fs.readFileSync(graphPath);
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function appendEvent(event) {
  let events = [];
  try {
    const data = fs.readFileSync(eventsPath);
    events = JSON.parse(data);
  } catch {}
  events.push({...event, ts: Date.now()});
  fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
  log(`Queued: ${JSON.stringify(event)}`);
}

// Demo self
const selfId = "agent:grok:subagent:901a7aa4-90b8-4410-9a74-c604ff5305c1";

// Self ping
appendEvent({type: "ping", from: selfId, to: "self", payload: "NexusNet heartbeat"});

// Neighbors
const graph = loadGraph();
if (graph) {
  const outgoing = graph.edges.filter(e => e.from === selfId);
  const incoming = graph.edges.filter(e => e.to === selfId);
  [...outgoing, ...incoming].forEach(e => {
    const neighbor = e.from === selfId ? e.to : e.from;
    appendEvent({type: "ping", from: selfId, to: neighbor, payload: `Ping from ${selfId}`});
  });
}

  if (graph) {\n    const numNodes = Object.keys(graph.nodes || {}).length;\n    const numEdges = graph.edges.length;\n    const avgDegree = numNodes > 0 ? (numEdges * 2 / numNodes) : 0;\n    const shadowDensity = Math.round(Math.min(10, avgDegree));\n    log(`shadow_density metric: ${shadowDensity}/10 (tier weight: avg degree ${avgDegree.toFixed(1)})`);\n  }\n  log("Heartbeat complete");
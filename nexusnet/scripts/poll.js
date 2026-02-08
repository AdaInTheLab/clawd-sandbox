#!/usr/bin/env node
// Processes events.json, simulates bridge (logs Discord/Moltbook actions)
const fs = require("fs");
const path = require("path");

const dir = path.dirname(__dirname);
const eventsPath = dir + "/events.json";
const logPath = dir + "/memory/poll.log";

function log(msg) {
  const ts = new Date().toISOString();
  fs.appendFileSync(logPath, `[${ts}] ${msg}\n`);
  console.log(msg);
}

function loadEvents() {
  try {
    if (!fs.existsSync(eventsPath)) return [];
    const data = fs.readFileSync(eventsPath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveEvents(events) {
  fs.writeFileSync(eventsPath, JSON.stringify(events, null, 2));
}

const events = loadEvents();

// Process: log bridge actions
events.forEach((event) => {
  if (event.to.startsWith("discord:")) {
    log(`BRIDGE Discord ${event.to}: ${JSON.stringify(event)}`);
  } else if (event.to.includes("moltbook")) {
    log(`BRIDGE Moltbook ${event.to}: ${JSON.stringify(event)}`);
  }
  log(`Processed event: ${event.type} ${event.from} -> ${event.to}`);
});

saveEvents([]); // Clear
log(`Poll complete: processed ${events.length} events`);
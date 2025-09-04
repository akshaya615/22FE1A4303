import { v4 as uuidv4 } from "uuid";

const LOGS_KEY = "app_logs_v1";
const MAX_LOGS = 2000;

function loadLogs() {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLogs(arr) {
  try {
    localStorage.setItem(LOGS_KEY, JSON.stringify(arr.slice(0, MAX_LOGS)));
  } catch {
    // silent failure, no console
  }
}

function log(eventType, message, meta = {}) {
  const logs = loadLogs();
  logs.unshift({
    id: uuidv4(),
    ts: Date.now(),
    eventType,
    message,
    meta,
  });
  saveLogs(logs);
}

function getAll() {
  return loadLogs();
}

function clear() {
  saveLogs([]);
}

// helper to wrap actions with start/success/error logs
async function withLogging(actionName, fn, meta = {}) {
  log("action_start", actionName, meta);
  try {
    const res = await fn();
    // store a short summary
    let summary = null;
    try {
      summary = typeof res === "object" ? JSON.stringify(res).slice(0, 200) : String(res);
    } catch {
      summary = "<unserializable>";
    }
    log("action_success", actionName, { ...meta, summary });
    return res;
  } catch (err) {
    log("action_error", actionName, { ...meta, error: err?.message ?? String(err) });
    throw err;
  }
}

export default {
  log,
  getAll,
  clear,
  withLogging,
};

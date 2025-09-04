// logger/logger.js
const axios = require("axios");
const { LOG_SERVER_URL } = require("./config");

const logLevels = ["info", "warn", "error", "fatal"];

function Log(module, level, layer, message) {
  if (!logLevels.includes(level)) {
    console.error(`Invalid log level: ${level}`);
    return;
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    module,
    level,
    layer,
    message,
  };

  // Print locally
  console.log(`[${logEntry.timestamp}] [${level.toUpperCase()}] [${module}/${layer}] ${message}`);

  // Push to server (if URL given)
  if (LOG_SERVER_URL) {
    axios.post(`${LOG_SERVER_URL}/logs`, logEntry).catch((err) => {
      console.error("Failed to send log to server:", err.message);
    });
  }
}

module.exports = Log;


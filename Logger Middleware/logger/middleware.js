// logger/middleware.js
const Log = require("./logger");

function requestLogger(req, res, next) {
  Log("backend", "info", "api", `Incoming request: ${req.method} ${req.url}`);
  next();
}

function errorLogger(err, req, res, next) {
  Log("backend", "error", "api", err.message);
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = { requestLogger, errorLogger };


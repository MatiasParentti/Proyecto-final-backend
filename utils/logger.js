const { createLogger, format, transports } = require("winston");
const fs = require("fs");

if (!fs.existsSync("logs")) fs.mkdirSync("logs");

const logFormat = format.combine(
  format.timestamp(),
  format.printf(
    ({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}]: ${message}`
  )
);

const requestLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [new transports.File({ filename: "logs/requests.log" })],
});

const responseLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [new transports.File({ filename: "logs/responses.log" })],
});

const auditLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [new transports.File({ filename: "logs/audit.log" })],
});

module.exports = {
  requestLogger,
  responseLogger,
  auditLogger,
};

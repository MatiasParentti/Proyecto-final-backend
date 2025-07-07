const { auditLogger } = require("../utils/logger");

const auditAccess = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const userId = req.user?.id || "sin-id";
    const email = req.user?.email || "sin-email";
    const rol = req.user?.rol || "sin-rol";
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationMs = (seconds * 1e3 + nanoseconds / 1e6).toFixed(2);

    const entry = `${req.method} ${req.originalUrl} - Usuario ID: ${userId} - Email: ${email} - Rol: ${rol} - IP: ${ip} - Tiempo: ${durationMs}ms - Status: ${res.statusCode}`;
    auditLogger.info(entry);
  });

  next();
};

module.exports = auditAccess;

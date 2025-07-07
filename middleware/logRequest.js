const { requestLogger } = require("../utils/logger");
const db = require("../config/db");

const logRequest = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const user_id = req.loggingContext?.userId || req.user?.id || null;
    const endpoint = req.originalUrl;
    const metodo = req.method;
    const estado = res.statusCode;
    const duracion = Date.now() - start;
    const mensaje = `Tiempo: ${duracion}ms`;

    try {
      db.prepare(
        `
        INSERT INTO logs (user_id, endpoint, metodo, estado, mensaje)
        VALUES (?, ?, ?, ?, ?)
      `
      ).run(user_id, endpoint, metodo, estado, mensaje);
    } catch (err) {
      requestLogger.error(`DB error: ${err.message}`);
    }

    const logMsg = `[${new Date().toISOString()}] ${metodo} ${endpoint} - ${estado} (${duracion}ms) user_id=${
      user_id ?? "anonimo"
    }`;

    requestLogger.info(logMsg);

    console.log(`[LOG] ${logMsg}`);
  });

  next();
};

module.exports = logRequest;

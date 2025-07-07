const { responseLogger } = require("../utils/logger");

module.exports = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    responseLogger.info(
      `[${new Date().toISOString()}] ${req.method} ${
        req.originalUrl
      } - Status: ${res.statusCode}`
    );
    return originalSend.call(this, body);
  };
  next();
};

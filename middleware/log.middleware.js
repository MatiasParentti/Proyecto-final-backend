const logRequest = require("./logRequest");
const logResponse = require("./logResponse");
const auditAccess = require("./auditLogger");

const loggingGlobal = (req, res, next) => {
  logRequest(req, res, () => {
    logResponse(req, res, () => {
      auditAccess(req, res, next);
    });
  });
};

module.exports = loggingGlobal;

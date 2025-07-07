const db = require("../config/db");

const getAllLogs = (req, res) => {
  const logs = db.prepare("SELECT * FROM logs ORDER BY timestamp DESC").all();
  res.json(logs);
};

const getLogById = (req, res) => {
  const log = db.prepare("SELECT * FROM logs WHERE id = ?").get(req.params.id);
  if (!log) return res.status(404).json({ error: "Log no encontrado" });
  res.json(log);
};

const deleteLog = (req, res) => {
  const result = db.prepare("DELETE FROM logs WHERE id = ?").run(req.params.id);
  if (result.changes === 0)
    return res.status(404).json({ error: "Log no encontrado" });
  res.json({ message: "Log eliminado" });
};

module.exports = { getAllLogs, getLogById, deleteLog };

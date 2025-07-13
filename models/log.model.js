const db = require("../config/db");
const chalk = require("chalk");

const getAll = () => {
  const logs = db.prepare("SELECT * FROM logs ORDER BY timestamp DESC").all();
  console.log(chalk.blue(`[DB] ${logs.length} logs encontrados`));
  return logs;
};

const getById = (id) => {
  return db.prepare("SELECT * FROM logs WHERE id = ?").get(id);
};

const create = ({ user_id, endpoint, metodo, estado, mensaje }) => {
  const result = db
    .prepare(
      `INSERT INTO logs (user_id, endpoint, metodo, estado, mensaje) 
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(user_id, endpoint, metodo, estado, mensaje);

  console.log(
    chalk.green(`[DB] Log registrado con ID ${result.lastInsertRowid}`)
  );
  return result;
};

const remove = (id) => {
  const result = db.prepare("DELETE FROM logs WHERE id = ?").run(id);
  console.log(
    chalk.red(`[DB] Log ID ${id} eliminado (${result.changes} cambio/s)`)
  );
  return result;
};

module.exports = { getAll, getById, create, remove };

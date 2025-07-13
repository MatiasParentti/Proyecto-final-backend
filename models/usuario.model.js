const db = require("../config/db");
const chalk = require("chalk");

const getAll = () => {
  const usuarios = db.prepare("SELECT id, email, rol FROM usuarios").all();
  console.log(chalk.blue(`[DB] ${usuarios.length} usuarios encontrados`));
  return usuarios;
};

const getById = (id) => {
  const usuario = db
    .prepare("SELECT id, email, rol FROM usuarios WHERE id = ?")
    .get(id);
  console.log(
    usuario
      ? chalk.blue(`[DB] Usuario ID ${id} encontrado`)
      : chalk.yellow(`[DB] Usuario ID ${id} no encontrado`)
  );
  return usuario;
};

const create = ({ email, password_hash, rol }) => {
  if (!email || !email.includes("@")) throw new Error("Email inválido");
  if (!password_hash || password_hash.length < 6)
    throw new Error("Contraseña inválida");
  if (rol !== "admin" && rol !== "usuario") throw new Error("Rol inválido");

  const exists = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE email = ?")
    .get(email);
  if (exists.total > 0)
    throw new Error(`El email "${email}" ya está registrado`);

  const result = db
    .prepare(
      "INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)"
    )
    .run(email, password_hash, rol);

  console.log(
    chalk.green(`[DB] Usuario creado con ID ${result.lastInsertRowid}`)
  );
  return result;
};

const update = (id, { email, rol }) => {
  if (!email || !email.includes("@")) throw new Error("Email inválido");
  if (rol !== "admin" && rol !== "usuario") throw new Error("Rol inválido");

  const exists = db
    .prepare(
      "SELECT COUNT(*) AS total FROM usuarios WHERE email = ? AND id != ?"
    )
    .get(email, id);
  if (exists.total > 0)
    throw new Error(`Ya existe otro usuario con el email "${email}"`);

  const result = db
    .prepare("UPDATE usuarios SET email = ?, rol = ? WHERE id = ?")
    .run(email, rol, id);

  console.log(
    chalk.cyan(`[DB] Usuario ID ${id} actualizado (${result.changes} cambio/s)`)
  );
  return result;
};

const remove = (id) => {
  const result = db.prepare("DELETE FROM usuarios WHERE id = ?").run(id);
  console.log(
    chalk.red(`[DB] Usuario ID ${id} eliminado (${result.changes} cambio/s)`)
  );
  return result;
};

module.exports = { getAll, getById, create, update, remove };

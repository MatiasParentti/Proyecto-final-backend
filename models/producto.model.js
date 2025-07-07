const db = require("../config/db");
const chalk = require("chalk");

function getAll() {
  const productos = db.prepare("SELECT * FROM productos").all();
  console.log(chalk.blue(`[DB] ${productos.length} productos encontrados`));
  return productos;
}

function getById(id) {
  const producto = db.prepare("SELECT * FROM productos WHERE id = ?").get(id);
  console.log(
    producto
      ? chalk.blue(`[DB] Producto ID ${id} encontrado`)
      : chalk.yellow(`[DB] Producto ID ${id} no encontrado`)
  );
  return producto;
}

function create({ nombre, precio }) {
  if (!nombre || nombre.length < 3) throw new Error("Nombre inválido");
  if (!precio || isNaN(precio)) throw new Error("Precio inválido");

  const result = db
    .prepare("INSERT INTO productos (nombre, precio) VALUES (?, ?)")
    .run(nombre, precio);

  console.log(
    chalk.green(`[DB] Producto creado con ID ${result.lastInsertRowid}`)
  );
  return result;
}

function update(id, { nombre, precio }) {
  if (!nombre || nombre.length < 3) throw new Error("Nombre inválido");
  if (!precio || isNaN(precio)) throw new Error("Precio inválido");

  const result = db
    .prepare("UPDATE productos SET nombre = ?, precio = ? WHERE id = ?")
    .run(nombre, precio, id);

  console.log(
    chalk.cyan(
      `[DB] Producto ID ${id} actualizado (${result.changes} cambio/s)`
    )
  );
  return result;
}

function remove(id) {
  const result = db.prepare("DELETE FROM productos WHERE id = ?").run(id);
  console.log(
    chalk.red(`[DB] Producto ID ${id} eliminado (${result.changes} cambio/s)`)
  );
  return result;
}

module.exports = { getAll, getById, create, update, remove };

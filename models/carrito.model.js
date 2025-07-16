const db = require("../config/db");
const chalk = require("chalk");

function getAll() {
  const productos = db.prepare("SELECT c.id, user_id, c.producto_id, p.nombre, c.cantidad, c.precio FROM carrito c Inner Join productos p ON p.id = c.producto_id").all();
  console.log(chalk.blue(`[DB] ${productos.length} productos encontrados del carrito`));
  return productos;
}

function getById(id) {
  const producto = db.prepare("SELECT * FROM carrito WHERE id = ?").get(id);
  console.log(
    producto
      ? chalk.blue(`[DB] Producto ID ${id} encontrado`)
      : chalk.yellow(`[DB] Producto ID ${id} no encontrado`)
  );
  return producto;
}

function create({ user_id, producto_id, cantidad, precio }) {
  // Validaciones
  if (!user_id) throw new Error("ID de usuario inválido o no proporcionado"); // Nueva validación para user_id
  if (!producto_id) throw new Error("Producto inválido: ID de producto no proporcionado");
  if (cantidad === undefined || isNaN(cantidad) || cantidad < 0) throw new Error("Cantidad inválida"); // Validar cantidad
  if (!precio || isNaN(precio) || precio < 0) throw new Error("Precio inválido"); // Validar precio

  const result = db
    .prepare("INSERT INTO carrito (user_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)")
    .run(user_id, producto_id, cantidad, precio); // Asegúrate de que el orden de los parámetros coincida con la consulta

  console.log(
    chalk.green(`[DB] Producto en carrito creado con ID ${result.lastInsertRowid} para user ${user_id}`)
  );
  return result;
}

function update(id, { user_id,producto_id, precio }) {
  if (!producto_id) throw new Error("Producto inválido");
  if (!precio || isNaN(precio)) throw new Error("Precio inválido");

  const result = db
    .prepare("UPDATE carrito set user_id = ?, producto_id = ?, precio = ? WHERE id = ?")
    .run(user_id,producto_id, precio, id);

  console.log(
    chalk.green(`[DB] Producto ID ${id} actualizado (${result.changes} cambio/s)`)
  );
  return result;
}


function remove(id) {
  const result = db.prepare("DELETE FROM carrito WHERE id = ?").run(id);
  console.log(
    chalk.red(`[DB] Producto ID ${id} eliminado (${result.changes} cambio/s)`)
  );
  return result;
}

module.exports = { getAll, getById, create, update, remove };

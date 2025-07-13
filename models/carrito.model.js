const db = require("../config/db");
const chalk = require("chalk");

const getCarritoByUserId = (userId) => {
  const productos = db
    .prepare(
      `
    SELECT c.id, p.nombre, p.precio, c.cantidad 
    FROM carrito c 
    JOIN productos p ON c.producto_id = p.id 
    WHERE c.user_id = ?
  `
    )
    .all(userId);

  console.log(
    chalk.blue(
      `[DB] Carrito del usuario ${userId} → ${productos.length} producto(s)`
    )
  );
  return productos;
};

const addToCarrito = (userId, productoId, cantidad) => {
  const result = db
    .prepare(
      `
    INSERT INTO carrito (user_id, producto_id, cantidad)
    VALUES (?, ?, ?)
  `
    )
    .run(userId, productoId, cantidad);

  console.log(
    chalk.green(
      `[DB] Producto ID ${productoId} agregado al carrito del usuario ${userId} (cantidad: ${cantidad})`
    )
  );
  return result;
};

const removeFromCarrito = (carritoId, userId) => {
  const result = db
    .prepare(
      `
    DELETE FROM carrito WHERE id = ? AND user_id = ?
  `
    )
    .run(carritoId, userId);

  console.log(
    chalk.red(
      `[DB] Producto ID ${carritoId} eliminado del carrito del usuario ${userId} (${result.changes} cambio/s)`
    )
  );
  return result;
};

const clearCarrito = (userId) => {
  const result = db
    .prepare("DELETE FROM carrito WHERE user_id = ?")
    .run(userId);

  console.log(
    chalk.red(
      `[DB] Carrito del usuario ${userId} eliminado (${result.changes} item(s))`
    )
  );
  return result;
};

module.exports = {
  getCarritoByUserId,
  addToCarrito,
  removeFromCarrito,
  clearCarrito
};

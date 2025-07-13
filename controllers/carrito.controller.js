const db = require("../config/db");

const getCarrito = (req, res) => {
  const userId = req.user.id;

  const productos = db
    .prepare(
      `
    SELECT c.id, p.nombre, p.precio, c.cantidad
    FROM carrito c
    JOIN productos p ON p.id = c.producto_id
    WHERE c.user_id = ?
  `
    )
    .all(userId);

  res.json(productos);
};

const addToCarrito = (req, res) => {
  const userId = req.user.id;
  const { producto_id, cantidad } = req.body;
  const producto = db
    .prepare("SELECT * FROM productos WHERE id = ?")
    .get(producto_id);
  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const existente = db
    .prepare(
      `
    SELECT * FROM carrito WHERE user_id = ? AND producto_id = ?
  `
    )
    .get(userId, producto_id);

  if (existente) {
    db.prepare(
      `
      UPDATE carrito SET cantidad = cantidad + ? WHERE id = ?
    `
    ).run(cantidad, existente.id);
  } else {
    db.prepare(
      `
      INSERT INTO carrito (user_id, producto_id, cantidad)
      VALUES (?, ?, ?)
    `
    ).run(userId, producto_id, cantidad);
  }

  res.json({ message: "Producto agregado al carrito" });
};

const removeFromCarrito = (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const item = db
    .prepare("SELECT * FROM carrito WHERE id = ? AND user_id = ?")
    .get(id, userId);
  if (!item) {
    return res
      .status(404)
      .json({ error: "Producto no encontrado en tu carrito" });
  }

  db.prepare("DELETE FROM carrito WHERE id = ?").run(id);
  res.json({ message: "Producto eliminado del carrito" });
};

const clearCarrito = (req, res) => {
  const userId = req.user.id;

  try {
    const result = db.prepare("DELETE FROM carrito WHERE user_id = ?").run(userId);
    res.json({ message: "Carrito vaciado", eliminados: result.changes });
  } catch (err) {
    console.error("[Error] al vaciar carrito:", err.message);
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
};

module.exports = { getCarrito, addToCarrito, removeFromCarrito,  clearCarrito };

const db = require("../config/db");
const chalk = require("chalk");
const Log = require("../models/log.model");

const finalizarCompra = (req, res) => {
  const userId = req.user.id;

  const carrito = db
    .prepare(
      `
      SELECT c.id, p.nombre, p.precio, c.cantidad
      FROM carrito c
      JOIN productos p ON p.id = c.producto_id
      WHERE c.user_id = ?
    `
    )
    .all(userId);

  if (carrito.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" });
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const result = db;
    //.prepare("DELETE FROM carrito WHERE user_id = ?")
    //.run(userId);

  console.log(
    chalk.green(
      `[COMPRA] Usuario ${userId} finalizó compra ($${total}) con ${result.changes} item(s)`
    )
  );

  Log.create({
    user_id: userId,
    endpoint: "/api/compra",
    metodo: "POST",
    estado: 200,
    mensaje: `Compra finalizada por $${total}`,
  });

  res.json({
    message: "Compra finalizada con éxito",
    total,
    itemsComprados: carrito.length,
    detalles: carrito,
  });
};

module.exports = { finalizarCompra };

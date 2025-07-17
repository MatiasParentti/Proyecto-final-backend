const db = require("../config/db");

const Compra = {
  findAllByUserId: (userId) => {
    const compras = db
      .prepare(
        `
      SELECT id, fecha, total FROM compras
      WHERE user_id = ?
      ORDER BY fecha DESC
    `
      )
      .all(userId);

    const detallesStmt = db.prepare(`
      SELECT cd.producto_id, p.nombre, cd.cantidad, cd.precio_unitario
      FROM compras_detalles cd
      JOIN productos p ON cd.producto_id = p.id
      WHERE cd.compra_id = ?
    `);

    return compras.map((compra) => ({
      ...compra,
      detalles: detallesStmt.all(compra.id),
    }));
  },
};

module.exports = Compra;

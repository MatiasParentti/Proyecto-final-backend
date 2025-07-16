const Carrito = require("../models/carrito.model");

function getAllProductosCarrito(req, res) {
  try {
    const carrito = Carrito.getAll();
    res.json(carrito);
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al obtener los productos del carrito" });
  }
}

function getProductoCarritoById(req, res) {
  try {
    const carrito = Carrito.getById(req.params.id);
    if (!carrito)
      return res.status(404).json({ error: "Producto del carrito no encontrado" });
    res.json(carrito);
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al buscar el producto en el carrito" });
  }
}

function createProductoCarrito(req, res) {
  try {
    const { selectedProducts } = req.body;
    const user_id = req.user ? req.user.id : 1;

    if (!selectedProducts || !Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      return res.status(400).json({ error: "No se proporcionaron productos seleccionados válidos." });
    }

    const results = [];
    for (const productData of selectedProducts) {
      try {
        // Llamamos a Carrito.create para CADA producto individual
        // Asegúrate de que las claves coincidan con lo que espera el modelo: producto_id, cantidad, precio
        const result = Carrito.create({
          user_id: user_id, // Pasamos el user_id al modelo
          producto_id: productData.producto_id,
          cantidad: productData.cantidad,
          precio: productData.precio,
        });
        results.push({ id: productData.producto_id, status: 'success', lastInsertRowid: result.lastInsertRowid });
      } catch (itemError) {
        // Capturamos errores si un producto individual falla
        console.error(chalk.red(`[Error] Fallo al crear producto ${productData.producto_id}: ${itemError.message}`));
        results.push({ id: productData.producto_id, status: 'failed', error: itemError.message });
      }
    }

    // Puedes decidir si enviar un 201 si al menos uno fue exitoso, o 400 si todos fallaron.
    // Aquí enviamos 201 si el proceso general fue manejado, y los resultados detallan los éxitos/fallos.
    res.status(201).json({ message: "Procesamiento de productos en carrito completado.", results });

  } catch (err) {
    console.error(chalk.red("[Error] Error en createProductoCarrito:", err.message));
    res.status(400).json({ error: err.message });
  }
}

function updateProductoCarrito(req, res) {
  try {
    const result = Carrito.update(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ error: "Producto del carrito no encontrado" });
    res.json({ message: "Producto actualizado en el carrito" });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(400).json({ error: err.message });
  }
}

function deleteProductoCarrito(req, res) {
  try {
    const result = Carrito.remove(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Producto no encontrado en el carrito" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
}

module.exports = {
  getAllProductosCarrito,
  getProductoCarritoById,
  createProductoCarrito,
  updateProductoCarrito,
  deleteProductoCarrito,
};

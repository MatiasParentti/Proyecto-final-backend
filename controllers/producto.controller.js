const Producto = require("../models/producto.model");

const getAllProductos = (req, res) => {
  try {
    const productos = Producto.getAll();
    res.json(productos);
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al obtener productos" });
  }
};

const getProductoById = (req, res) => {
  try {
    const producto = Producto.getById(req.params.id);
    if (!producto)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al buscar el producto" });
  }
};

const createProducto = (req, res) => {
  try {
    const result = Producto.create(req.body);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(400).json({ error: err.message });
  }
};

const updateProducto = (req, res) => {
  try {
    const result = Producto.update(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto actualizado" });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(400).json({ error: err.message });
  }
};

const deleteProducto = (req, res) => {
  try {
    const result = Producto.remove(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
};

module.exports = {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
};

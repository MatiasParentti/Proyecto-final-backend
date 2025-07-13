const Usuario = require("../models/usuario.model");

const getAllUsuarios = (req, res) => {
  try {
    const usuarios = Usuario.getAll();
    res.json(usuarios);
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

const getUsuarioById = (req, res) => {
  try {
    const usuario = Usuario.getById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al buscar el usuario" });
  }
};

const createUsuario = (req, res) => {
  try {
    const result = Usuario.create(req.body);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(400).json({ error: err.message });
  }
};

const updateUsuario = (req, res) => {
  try {
    const result = Usuario.update(req.params.id, req.body);
    if (result.changes === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(400).json({ error: err.message });
  }
};

const deleteUsuario = (req, res) => {
  try {
    const result = Usuario.remove(req.params.id);
    if (result.changes === 0)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("[Error]", err.message);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};

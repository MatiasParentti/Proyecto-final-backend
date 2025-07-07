const express = require("express");
const router = express.Router();
const Controller = require("../controllers/usuario.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { soloAdmin } = require("../middleware/rol.middleware");

router.get("/", authMiddleware, soloAdmin, Controller.getAllUsuarios);
router.get("/:id", authMiddleware, soloAdmin, Controller.getUsuarioById);
router.post("/", authMiddleware, soloAdmin, Controller.createUsuario);
router.put("/:id", authMiddleware, soloAdmin, Controller.updateUsuario);
router.delete("/:id", authMiddleware, soloAdmin, Controller.deleteUsuario);

module.exports = router;

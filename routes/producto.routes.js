const express = require("express");
const router = express.Router();
const Controller = require("../controllers/producto.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { soloAdmin } = require("../middleware/rol.middleware");

router.get("/", authMiddleware, Controller.getAllProductos);
router.get("/:id", authMiddleware, Controller.getProductoById);
router.post("/", authMiddleware, soloAdmin, Controller.createProducto);
router.put("/:id", authMiddleware, soloAdmin, Controller.updateProducto);
router.delete("/:id", authMiddleware, soloAdmin, Controller.deleteProducto);

module.exports = router;

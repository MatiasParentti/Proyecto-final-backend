const express = require("express");
const router = express.Router();
const Controller = require("../controllers/carrito.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { soloAdmin } = require("../middleware/rol.middleware");

router.get("/", authMiddleware, Controller.getAllProductosCarrito);
router.get("/:id", authMiddleware, Controller.getProductoCarritoById);
router.post("/", authMiddleware, soloAdmin, Controller.createProductoCarrito);
router.put("/:id", authMiddleware, soloAdmin, Controller.updateProductoCarrito);
router.delete("/:id", authMiddleware, soloAdmin, Controller.deleteProductoCarrito);

module.exports = router;

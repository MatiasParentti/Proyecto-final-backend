const express = require("express");
const router = express.Router();
const Controller = require("../controllers/carrito.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, Controller.getCarrito);
router.post("/", authMiddleware, Controller.addToCarrito);
router.delete("/:id", authMiddleware, Controller.removeFromCarrito);
router.delete("/", authMiddleware, Controller.clearCarrito);

module.exports = router;
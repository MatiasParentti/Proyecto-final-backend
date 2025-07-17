const express = require("express");
const router = express.Router();
const controller = require("../controllers/compra.controller");
const authMiddleware = require("../middleware/auth.middleware");


router.post("/", authMiddleware, controller.finalizarCompra);
router.get("/", authMiddleware, controller.listarCompras);


module.exports = router;
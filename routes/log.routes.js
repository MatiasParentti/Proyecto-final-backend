const express = require("express");
const router = express.Router();
const Controller = require("../controllers/log.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { soloAdmin } = require("../middleware/rol.middleware");

router.get("/", authMiddleware, soloAdmin, Controller.getAllLogs);
router.get("/:id", authMiddleware, soloAdmin, Controller.getLogById);
router.delete("/:id", authMiddleware, soloAdmin, Controller.deleteLog);

module.exports = router;

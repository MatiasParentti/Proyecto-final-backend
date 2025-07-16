const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const logMiddleware = require("./middleware/log.middleware");
const productosRoutes = require("./routes/producto.routes");
const carritoRoutes = require("./routes/carrito.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const logRoutes = require("./routes/log.routes");
const authMiddleware = require("./middleware/auth.middleware");

// Instancia de la app
const app = express();
const cors = require("cors");
// Configuracion de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configuracion de entorno
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(logMiddleware);

// Configuracion de rutas
app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/logs", logRoutes);
app.use("/auth", authRoutes);

app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Bienvenido al dashboard" });
});
app.get("/carrito", (res) => {
  res.redirect("/carrito");
});

// Configuracion de redireccion (por defecto)
app.get("/", (req, res) => {
  res.redirect("/auth");
});

// Middleware de error 404
app.use((req, res, next) => {
  next(createError(404, "Ruta no encontrada"));
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("general_error", {
    message: err.message,
    error: app.get("env") === "development" ? err : {},
  });
});

module.exports = app;

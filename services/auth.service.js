const db = require("../config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const registerUser = (email, passwordHash, rol = "usuario") => {
  if (!email || !passwordHash)
    throw new Error("Email y contraseña son obligatorios");
  if (rol !== "admin" && rol !== "usuario") throw new Error("Rol inválido");

  const exists = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE email = ?")
    .get(email);
  if (exists.total > 0) throw new Error("El email ya está registrado");

  db.prepare(
    "INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)"
  ).run(email, passwordHash, rol);
};

const loginUser = (email, password) => {
  const user = db
    .prepare(
      "SELECT id, email, rol FROM usuarios WHERE email = ? AND password_hash = ?"
    )
    .get(email, password);

  if (!user) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return { token, userId: user.id };
};

module.exports = { registerUser, loginUser };

const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;
const SALT_ROUNDS = 10;

const registerUser = (email, password, rol = "usuario") => {
  if (!email || !password)
    throw new Error("Email y contraseña son obligatorios");
  if (rol !== "admin" && rol !== "usuario") throw new Error("Rol inválido");

  const exists = db
    .prepare("SELECT COUNT(*) AS total FROM usuarios WHERE email = ?")
    .get(email);
  if (exists.total > 0) throw new Error("El email ya está registrado");

  // 🔒
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

  db.prepare(
    "INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)"
  ).run(email, passwordHash, rol);
};

const loginUser = (email, password) => {
  const user = db
    .prepare(
      "SELECT id, email, password_hash, rol FROM usuarios WHERE email = ?"
    )
    .get(email);

  if (!user) throw new Error("Credenciales inválidas");

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) throw new Error("Credenciales inválidas");

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  return { token, userId: user.id };
};

module.exports = { registerUser, loginUser };

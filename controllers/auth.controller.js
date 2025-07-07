const { registerUser, loginUser } = require("../services/auth.service");

const register = (req, res) => {
  const { email, password, rol } = req.body;
  try {
    registerUser(email, password, rol);
    res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  try {
    const { token, userId } = loginUser(email, password);
    req.loggingContext = { userId };
    res.json({ message: "Login exitoso", token, userId });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { register, login };

const express = require("express");
const router = express.Router();

console.log("authRoutes cargado");

const authController = require("../controllers/authController");

// Registrar usuario
router.post("/register", authController.register);

// Iniciar sesión
router.post("/login", authController.login);

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({
    mensaje: "Ruta de autenticación funcionando"
  });
});

module.exports = router;
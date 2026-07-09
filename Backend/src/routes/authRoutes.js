const express = require("express");
const router = express.Router();

console.log("authRoutes cargado");

const authController = require("../controllers/authController");

// Registrar usuario
router.post("/register", authController.register);

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({
    mensaje: "Ruta de autenticación funcionando"
  });
});

module.exports = router;
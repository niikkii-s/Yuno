const express = require("express");
const router = express.Router();

const registrosController = require("../controllers/registrosController");

// Obtener todos los registros
router.get("/", registrosController.getRegistros);

// Registrar una comida
router.post("/", registrosController.createRegistro);

module.exports = router;
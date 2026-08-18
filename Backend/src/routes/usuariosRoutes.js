const express = require("express");

const router = express.Router();

const usuariosController = require("../controllers/usuariosController");

// Obtener usuario por ID
router.get("/:id", usuariosController.getUsuario);

module.exports = router;
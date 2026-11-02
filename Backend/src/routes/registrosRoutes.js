const express = require("express");

const router = express.Router();

const registrosController = require("../controllers/registrosController");

router.get("/resumen/:id", registrosController.getResumenUsuario);

router.get("/", registrosController.getRegistros);

router.post("/", registrosController.createRegistro);

module.exports = router;
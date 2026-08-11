const express = require("express");
const router = express.Router();

const alimentosController = require("../controllers/alimentosController");

router.get("/", alimentosController.getAlimentos);

router.post("/", alimentosController.createAlimento);

module.exports = router;
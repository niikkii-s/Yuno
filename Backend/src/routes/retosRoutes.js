const express = require("express");
const router = express.Router();

const retosController = require("../controllers/retosController");

router.get("/", retosController.getRetos);

module.exports = router;
const express = require("express");
const cors = require("cors");
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
console.log("1. auth cargado");

const alimentosRoutes = require("./routes/alimentosRoutes");
console.log("2. alimentos cargado");

const registrosRoutes = require("./routes/registrosRoutes");
console.log("3. registros cargado");

const usuariosRoutes = require("./routes/usuariosRoutes");
console.log("4. usuarios cargado");

app.use("/auth", authRoutes);
app.use("/alimentos", alimentosRoutes);
app.use("/registros", registrosRoutes);
app.use("/usuarios", usuariosRoutes);

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
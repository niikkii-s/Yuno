const express = require("express");
require("./config/db");

const app = express();

// Middleware para leer JSON
app.use(express.json());

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const alimentosRoutes = require("./routes/alimentosRoutes");
const registrosRoutes = require("./routes/registrosRoutes");
const usuariosRoutes = require("./routes/usuariosRoutes");

// Comprobar que las rutas se cargan
console.log("authRoutes cargado");
console.log("alimentosRoutes cargado");
console.log("registrosRoutes cargado");
console.log("usuariosRoutes cargado");

// Registrar rutas
app.use("/auth", authRoutes);
app.use("/alimentos", alimentosRoutes);
app.use("/registros", registrosRoutes);
app.use("/usuarios", usuariosRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// Iniciar servidor
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
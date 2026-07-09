const express = require("express");

const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
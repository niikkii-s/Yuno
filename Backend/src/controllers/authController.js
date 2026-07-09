const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/users.json");

const register = (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  users.push({
    nombre,
    correo,
    contraseña
  });

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.status(201).json({
    mensaje: "Usuario registrado correctamente"
  });
};

module.exports = {
  register
};
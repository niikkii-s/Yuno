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

const login = (req, res) => {
  const { correo, contraseña } = req.body;

  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const user = users.find(
    (u) => u.correo === correo && u.contraseña === contraseña
  );

  if (!user) {
    return res.status(401).json({
      mensaje: "Correo o contraseña incorrectos"
    });
  }

  res.json({
    mensaje: "Inicio de sesión exitoso",
    usuario: user.nombre
  });
};
module.exports = {
  register,
  login
};
const db = require("../config/db");

const register = (req, res) => {
  console.log(req.body);

  const { nombre, correo, contraseña } = req.body;

  const sql = `
    INSERT INTO usuarios (nombre, correo, contraseña)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [nombre, correo, contraseña], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        mensaje: "Error al registrar el usuario"
      });
    }

    res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });
  });
};

const login = (req, res) => {
  const { correo, contraseña } = req.body;

  const sql = `
    SELECT * FROM usuarios
    WHERE correo = ? AND contraseña = ?
  `;

  db.query(sql, [correo, contraseña], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        mensaje: "Error al iniciar sesión"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: results[0].nombre
    });
  });
};

module.exports = {
  register,
  login
};
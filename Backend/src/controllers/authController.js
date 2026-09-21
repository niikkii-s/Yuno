const db = require("../config/db");

const register = (req, res) => {
  console.log(req.body);

  const {
    nombre,
    correo,
    contraseña,
    fecha_nacimiento,
    peso,
    altura,
    objetivo
  } = req.body;

  const sql = `
    INSERT INTO usuarios
    (nombre, correo, contraseña, fecha_nacimiento, peso, altura, objetivo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nombre, correo, contraseña, fecha_nacimiento, peso, altura, objetivo], (err, result) => {
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

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - nacimiento.getFullYear();

  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 && hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }

  return edad;
};

const login = (req, res) => {
  console.log("LOGIN RECIBIDO");
  console.log(req.body);

  const { correo, contraseña } = req.body;

  const sql = `
    SELECT *
    FROM usuarios
    WHERE correo = ? AND contraseña = ?
  `;

  db.query(sql, [correo, contraseña], (err, results) => {
    console.log("RESULTADO LOGIN:", results);
    console.log("ERROR LOGIN:", err);

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

    const usuario = results[0];

    let edad = null;

    if (usuario.fecha_nacimiento) {
      edad = calcularEdad(usuario.fecha_nacimiento);
    }

    res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad: edad,
        peso: usuario.peso,
        altura: usuario.altura,
        objetivo: usuario.objetivo
      }
    });
  });
};

module.exports = {
  register,
  login
};
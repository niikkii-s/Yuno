const db = require("../config/db");

// Calcular edad a partir de la fecha de nacimiento
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

// Obtener un usuario por ID
const getUsuario = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      id,
      nombre,
      correo,
      fecha_nacimiento,
      peso,
      altura,
      objetivo,
      hojas
    FROM usuarios
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al obtener el usuario"
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado"
      });
    }

    const usuario = results[0];

    // Calcular edad automáticamente
    if (usuario.fecha_nacimiento) {
      usuario.edad = calcularEdad(usuario.fecha_nacimiento);
    }

    res.json(usuario);
  });
};

module.exports = {
  getUsuario
};
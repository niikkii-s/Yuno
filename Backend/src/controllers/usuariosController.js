const db = require("../config/db");

const calcularEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;

  const fecha = fechaNacimiento instanceof Date
    ? fechaNacimiento.toISOString().slice(0, 10)
    : String(fechaNacimiento).slice(0, 10);

  const [anio, mes, dia] = fecha.split("-").map(Number);

  if (!anio || !mes || !dia) return null;

  const hoy = new Date();

  let edad = hoy.getFullYear() - anio;

  if (
    hoy.getMonth() + 1 < mes ||
    (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)
  ) {
    edad--;
  }

  return edad;
};

const getUsuario = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensaje: "El ID del usuario no es válido"
    });
  }

  const sql = `
    SELECT
      id,
      nombre,
      correo,
      fecha_nacimiento,
      peso,
      altura,
      objetivo,
      restriccion_dieta
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

    return res.json({
      ...usuario,
      edad: calcularEdad(usuario.fecha_nacimiento)
    });
  });
};

module.exports = {
  getUsuario
};
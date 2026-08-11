const db = require("../config/db");

// Obtener un usuario por ID
const getUsuario = (req, res) => {

  const { id } = req.params;

  const sql = `
    SELECT
      id,
      nombre,
      correo,
      edad,
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

    res.json(results[0]);

  });

};

module.exports = {
  getUsuario
};
const db = require("../config/db");

// Obtener todos los retos activos
const getRetos = (req, res) => {
  const sql = `
    SELECT
      id_reto,
      titulo,
      descripcion,
      recompensa,
      objetivo,
      activo
    FROM retos
    WHERE activo = TRUE
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al obtener los retos"
      });
    }

    res.json(results);
  });
};

module.exports = {
  getRetos
};
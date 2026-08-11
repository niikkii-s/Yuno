const db = require("../config/db");

// Obtener todos los registros de comidas
const getRegistros = (req, res) => {
  const sql = `
SELECT
    rc.id_registro,
    u.nombre AS usuario,
    a.nombre AS alimento,
    (a.calorias * rc.cantidad) AS calorias,
(a.proteinas * rc.cantidad) AS proteinas,
(a.carbohidratos * rc.cantidad) AS carbohidratos,
(a.grasas * rc.cantidad) AS grasas,
    rc.tipo_comida,
    rc.cantidad,
    rc.fecha

FROM registros_comidas rc

JOIN usuarios u
ON rc.id_usuario = u.id

JOIN alimentos a
ON rc.id_alimento = a.id_alimento
`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        mensaje: "Error al obtener los registros"
      });
    }

    res.json(results);
  });
};

// Registrar una comida
// Registrar una comida
const createRegistro = (req, res) => {

  const {
    id_usuario,
    id_alimento,
    tipo_comida,
    cantidad,
    fecha
  } = req.body;

  const sql = `
    INSERT INTO registros_comidas
    (id_usuario, id_alimento, tipo_comida, cantidad, fecha)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      id_usuario,
      id_alimento,
      tipo_comida,
      cantidad,
      fecha
    ],
    (err) => {

      if (err) {
        console.error(err);
        return res.status(500).json({
          mensaje: "Error al registrar la comida"
        });
      }

      // Sumar 1 hoja al usuario
      const sqlHojas = `
        UPDATE usuarios
        SET hojas = hojas + 1
        WHERE id = ?
      `;

      db.query(sqlHojas, [id_usuario], (err2) => {

        if (err2) {
          console.error(err2);
          return res.status(500).json({
            mensaje: "La comida se registró, pero no se pudieron actualizar las hojas."
          });
        }

        res.status(201).json({
          mensaje: "Comida registrada correctamente. ¡Ganaste 1 hoja! 🍃"
        });

      });

    }
  );

};

module.exports = {
  getRegistros,
  createRegistro
};
const db = require("../config/db");

// Obtener todos los alimentos
const getAlimentos = (req, res) => {
  const sql = "SELECT * FROM alimentos";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        mensaje: "Error al obtener los alimentos"
      });
    }

    res.json(results);
  });
};

// Agregar alimento
const createAlimento = (req, res) => {
  const {
    nombre,
    calorias,
    proteinas,
    carbohidratos,
    grasas,
    porcion
  } = req.body;

  const sql = `
    INSERT INTO alimentos
    (nombre, calorias, proteinas, carbohidratos, grasas, porcion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nombre,
      calorias,
      proteinas,
      carbohidratos,
      grasas,
      porcion
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          mensaje: "Error al agregar alimento"
        });
      }

      res.status(201).json({
        mensaje: "Alimento agregado correctamente"
      });
    }
  );
};

module.exports = {
  getAlimentos,
  createAlimento
};
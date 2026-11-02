
const db = require("../config/db");

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

const createAlimento = (req, res) => {
  const {
    nombre,
    calorias,
    proteinas,
    carbohidratos,
    grasas,
    porcion
  } = req.body;

  if (
    typeof nombre !== "string" ||
    !nombre.trim() ||
    calorias === undefined ||
    proteinas === undefined ||
    carbohidratos === undefined ||
    grasas === undefined ||
    porcion === undefined
  ) {
    return res.status(400).json({
      mensaje: "Todos los campos son obligatorios"
    });
  }

  const valores = [
    calorias,
    proteinas,
    carbohidratos,
    grasas
  ].map(Number);

  const porcionValida =
    typeof porcion === "string" &&
    porcion.trim().length > 0;

  if (
    valores.some(valor => !Number.isFinite(valor) || valor < 0) ||
    !porcionValida
  ) {
    return res.status(400).json({
      mensaje: "Los valores nutricionales deben ser válidos y la porción debe contener texto"
    });
  }

  const sql = `
    INSERT INTO alimentos
    (nombre, calorias, proteinas, carbohidratos, grasas, porcion)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nombre.trim(),
      ...valores,
      porcion.trim()
    ],
    (err) => {
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


const db = require("../config/db");

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
    ORDER BY rc.fecha DESC
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

const createRegistro = (req, res) => {
  const {
    id_usuario,
    id_alimento,
    tipo_comida,
    cantidad,
    fecha
  } = req.body;

  const usuarioId = Number(id_usuario);
  const alimentoId = Number(id_alimento);
  const cantidadNumero = Number(cantidad);

  const tiposPermitidos = [
    "Desayuno",
    "Almuerzo",
    "Cena",
    "Snack"
  ];

  if (
    !Number.isInteger(usuarioId) ||
    usuarioId <= 0 ||
    !Number.isInteger(alimentoId) ||
    alimentoId <= 0 ||
    !Number.isFinite(cantidadNumero) ||
    cantidadNumero <= 0 ||
    !tiposPermitidos.includes(tipo_comida) ||
    typeof fecha !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
  ) {
    return res.status(400).json({
      mensaje: "Los datos del registro no son válidos"
    });
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaComprobada = new Date(Date.UTC(anio, mes - 1, dia));

  if (
    fechaComprobada.getUTCFullYear() !== anio ||
    fechaComprobada.getUTCMonth() !== mes - 1 ||
    fechaComprobada.getUTCDate() !== dia
  ) {
    return res.status(400).json({
      mensaje: "La fecha no es válida"
    });
  }

  const sql = `
    INSERT INTO registros_comidas
    (id_usuario, id_alimento, tipo_comida, cantidad, fecha)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      usuarioId,
      alimentoId,
      tipo_comida,
      cantidadNumero,
      fecha
    ],
    (err) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          mensaje: "Error al registrar la comida"
        });
      }

      res.status(201).json({
        mensaje: "Comida registrada correctamente"
      });
    }
  );
};

const getResumenUsuario = (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensaje: "El ID del usuario no es válido"
    });
  }

  const sql = `
    SELECT
      u.id,
      u.nombre,
      u.peso,
      COUNT(rc.id_registro) AS comidas_registradas,
      COALESCE(SUM(a.calorias * rc.cantidad), 0) AS calorias_consumidas,
      COALESCE(SUM(a.proteinas * rc.cantidad), 0) AS proteinas_consumidas,
      COALESCE(SUM(a.carbohidratos * rc.cantidad), 0) AS carbohidratos_consumidos,
      COALESCE(SUM(a.grasas * rc.cantidad), 0) AS grasas_consumidas
    FROM usuarios u
    LEFT JOIN registros_comidas rc
      ON rc.id_usuario = u.id
    LEFT JOIN alimentos a
      ON rc.id_alimento = a.id_alimento
    WHERE u.id = ?
    GROUP BY u.id, u.nombre, u.peso
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        mensaje: "Error al obtener el resumen del usuario"
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
  getRegistros,
  createRegistro,
  getResumenUsuario
};
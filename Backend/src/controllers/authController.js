
const db = require("../config/db");
const bcrypt = require("bcrypt");

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

const fechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaComprobada = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fechaComprobada.getUTCFullYear() === anio &&
    fechaComprobada.getUTCMonth() === mes - 1 &&
    fechaComprobada.getUTCDate() === dia &&
    fecha <= new Date().toISOString().slice(0, 10)
  );
};

const register = async (req, res) => {
  try {
    const {
      nombre,
      correo,
      contrasena,
      contraseña,
      fecha_nacimiento,
      peso,
      altura,
      objetivo,
      restriccion_dieta
    } = req.body;

    const clave = contrasena || contraseña;

    if (
      !nombre?.trim() ||
      !correo?.trim() ||
      !clave ||
      !fecha_nacimiento ||
      peso === undefined ||
      altura === undefined ||
      !objetivo ||
      !restriccion_dieta
    ) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios"
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNormalizado)) {
      return res.status(400).json({
        mensaje: "El correo no es válido"
      });
    }

    if (clave.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener mínimo 6 caracteres"
      });
    }

    if (!fechaValida(fecha_nacimiento)) {
      return res.status(400).json({
        mensaje: "La fecha de nacimiento no es válida"
      });
    }

    const pesoNumero = Number(peso);
    const alturaNumero = Number(altura);

    if (
      !Number.isFinite(pesoNumero) ||
      !Number.isFinite(alturaNumero) ||
      pesoNumero <= 0 ||
      alturaNumero <= 0 ||
      pesoNumero > 999.99 ||
      alturaNumero > 999.99
    ) {
      return res.status(400).json({
        mensaje: "El peso y la altura deben ser valores válidos"
      });
    }

    const [resultados] = await db.promise().execute(
      "SELECT id FROM usuarios WHERE correo = ?",
      [correoNormalizado]
    );

    if (resultados.length > 0) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const claveProtegida = await bcrypt.hash(clave, 10);

    await db.promise().execute(
      `INSERT INTO usuarios
      (nombre, correo, \`contraseña\`, fecha_nacimiento, peso, altura, objetivo, restriccion_dieta)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        correoNormalizado,
        claveProtegida,
        fecha_nacimiento,
        pesoNumero,
        alturaNumero,
        objetivo,
        restriccion_dieta
      ]
    );

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    console.error("Error en registro:", error);

    return res.status(500).json({
      mensaje: "Error al registrar el usuario"
    });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena, contraseña } = req.body;

    const clave = contrasena || contraseña;

    if (!correo?.trim() || !clave) {
      return res.status(400).json({
        mensaje: "Debes ingresar correo y contraseña"
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();

    const [resultados] = await db.promise().execute(
      `SELECT
        id,
        nombre,
        correo,
        \`contraseña\` AS password_hash,
        edad,
        peso,
        altura,
        objetivo,
        fecha_nacimiento,
        restriccion_dieta
      FROM usuarios
      WHERE correo = ?`,
      [correoNormalizado]
    );

    if (resultados.length === 0) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    const usuario = resultados[0];

    const esHash = /^\$2[aby]\$/.test(usuario.password_hash);

    let contrasenaCorrecta;

    if (esHash) {
      contrasenaCorrecta = await bcrypt.compare(
        clave,
        usuario.password_hash
      );
    } else {
      contrasenaCorrecta = clave === usuario.password_hash;
    }

    if (!contrasenaCorrecta) {
      return res.status(401).json({
        mensaje: "Correo o contraseña incorrectos"
      });
    }

    if (!esHash) {
      const nuevoHash = await bcrypt.hash(clave, 10);

      await db.promise().execute(
        "UPDATE usuarios SET `contraseña` = ? WHERE id = ?",
        [nuevoHash, usuario.id]
      );
    }

    const edad = usuario.fecha_nacimiento
      ? calcularEdad(usuario.fecha_nacimiento)
      : usuario.edad;

    return res.json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad,
        peso: usuario.peso,
        altura: usuario.altura,
        objetivo: usuario.objetivo,
        fecha_nacimiento: usuario.fecha_nacimiento,
        restriccion_dieta: usuario.restriccion_dieta
      }
    });

  } catch (error) {
    console.error("Error en login:", error);

    return res.status(500).json({
      mensaje: "Error al iniciar sesión"
    });
  }
};

module.exports = {
  register,
  login
};

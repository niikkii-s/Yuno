# 🌿 Yuno API

Base URL: `http://localhost:3000`

## 1. Autenticación

### Registrar usuario

**POST** `/auth/register`

```json
{
  "nombre": "Nicole",
  "correo": "nicole@example.com",
  "contrasena": "contraseña_de_prueba",
  "fecha_nacimiento": "2008-04-12",
  "peso": 60,
  "altura": 165,
  "objetivo": "Comer más saludable",
  "restriccion_dieta": "Ninguna"
}
```

### Iniciar sesión

**POST** `/auth/login`

```json
{
  "correo": "nicole@example.com",
  "contrasena": "contraseña_de_prueba"
}
```

## 2. Usuarios

### Obtener usuario por ID

**GET** `/usuarios/:id`

Ejemplo:

`GET /usuarios/16`

Devuelve los datos del perfil y la edad calculada.

## 3. Alimentos

### Obtener todos los alimentos

**GET** `/alimentos`

### Agregar alimento

**POST** `/alimentos`

```json
{
  "nombre": "Banano",
  "calorias": 89,
  "proteinas": 1.1,
  "carbohidratos": 22.8,
  "grasas": 0.3,
  "porcion": "100 g"
}
```

## 4. Registros de comidas

### Obtener todos los registros

**GET** `/registros`

### Registrar una comida

**POST** `/registros`

```json
{
  "id_usuario": 16,
  "id_alimento": 1,
  "tipo_comida": "Desayuno",
  "cantidad": 1,
  "fecha": "2026-11-02"
}
```

Tipos de comida permitidos:
- Desayuno
- Almuerzo
- Cena
- Snack

### Obtener resumen de un usuario

**GET** `/registros/resumen/:id`

Ejemplo:

`GET /registros/resumen/16`

Devuelve el peso, la cantidad de comidas registradas y los totales de calorías, proteínas, carbohidratos y grasas consumidas.
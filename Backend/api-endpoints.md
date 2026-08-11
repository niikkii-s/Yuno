# 🌿 Yuno API

## Autenticación

### Registrar usuario
POST http://localhost:3000/auth/register

```json
{
  "nombre": "Nicole",
  "correo": "nicole@gmail.com",
  "contraseña": "1234"
}
```

### Iniciar sesión
POST http://localhost:3000/auth/login

```json
{
  "correo": "nicole@gmail.com",
  "contraseña": "1234"
}
```

## Alimentos

### Obtener alimentos
GET http://localhost:3000/alimentos

### Agregar alimento
POST http://localhost:3000/alimentos

## Registros

### Obtener registros
GET http://localhost:3000/registros

### Registrar comida
POST http://localhost:3000/registros
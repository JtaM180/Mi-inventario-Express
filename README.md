# MiInventarioExpress

**Estudiante:** [Tu Nombre Apellido]  
**Materia:** Aplicaciones Web  
**Universidad:** Universidad Politécnica Salesiana  
**Unidad:** 2 - Programación del lado del servidor

---

## Descripción

MiInventarioExpress es una aplicación web completa para la gestión de productos, construida con Node.js, Express, MongoDB y Socket.io. Permite administrar un inventario con autenticación de usuarios y chat en tiempo real.

## Funcionalidades implementadas

- ✅ CRUD completo de productos (crear, listar, editar, eliminar)
- ✅ Autenticación de usuarios (login / logout) con sesiones
- ✅ Contraseñas cifradas con bcrypt
- ✅ Carga de imágenes con Multer (validación de tipo y tamaño)
- ✅ Validación de formularios con express-validator
- ✅ Vistas con Handlebars (layouts, parciales, datos dinámicos)
- ✅ Chat en tiempo real con Socket.io (solo usuarios autenticados)
- ✅ Estructura MVC

## Tecnologías

- Node.js + Express
- MongoDB + Mongoose
- express-handlebars
- express-session + bcrypt
- Multer
- Socket.io
- express-validator

## Instalación y uso

### Requisitos previos
- Node.js v18+
- MongoDB corriendo en `mongodb://localhost:27017`

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/MiInventarioExpress.git
cd MiInventarioExpress

# 2. Instalar dependencias
npm install

# 3. Iniciar la aplicación
npm start
# o para desarrollo con recarga automática:
npm run dev
```

### Acceder a la app
Abrir en el navegador: `http://localhost:3000`

### Usuario de prueba
Puedes registrarte en `/register` o usar las credenciales de prueba creadas al iniciar.

## Estructura del proyecto

```
MiInventarioExpress/
├── app.js                  # Entrada principal
├── config/
│   └── db.js               # Conexión a MongoDB
├── models/
│   ├── Product.js          # Esquema de Producto
│   └── User.js             # Esquema de Usuario
├── routes/
│   ├── products.js         # Rutas de productos
│   ├── auth.js             # Rutas de autenticación
│   └── chat.js             # Ruta de chat
├── controllers/
│   ├── productController.js
│   └── authController.js
├── middleware/
│   └── authMiddleware.js   # Protección de rutas
├── views/
│   ├── layouts/
│   │   └── main.hbs
│   ├── partials/
│   │   └── navbar.hbs
│   ├── products/
│   │   ├── index.hbs
│   │   ├── create.hbs
│   │   └── edit.hbs
│   ├── auth/
│   │   ├── login.hbs
│   │   └── register.hbs
│   └── chat.hbs
├── public/
│   ├── css/style.css
│   └── js/chat.js
└── uploads/                # Imágenes subidas
```

## Pruebas con Postman

Importar colección o probar manualmente:
- `GET /products` - Listar productos
- `POST /products` - Crear producto (form-data con imagen)
- `PUT /products/:id` - Editar producto
- `DELETE /products/:id` - Eliminar producto
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión

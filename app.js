const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const connectDB = require('./config/db');

// Conectar a MongoDB
connectDB();

const app = express();
const server = http.createServer(app);   // Servidor HTTP que comparte con Socket.io
const io = new Server(server);           // Socket.io sobre el mismo servidor

// ===============================
// CONFIGURACIÓN DE HANDLEBARS
// ===============================
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ===============================
// MIDDLEWARES GLOBALES
// ===============================
app.use(express.urlencoded({ extended: true }));  // Parsear formularios
app.use(express.json());                           // Parsear JSON (útil para Postman)

// Archivos estáticos (CSS, JS del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// Servir imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sesiones de usuario
app.use(session({
  secret: 'miInventarioSecret2024',   // Cambia esto por algo más seguro en producción
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 horas
}));

// Mensajes flash (éxito / error)
app.use(flash());

// Pasar mensajes flash y usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  res.locals.usuario = req.session.userName || null;
  next();
});

// ===============================
// RUTAS
// ===============================
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/chat', require('./routes/chat'));

// Ruta raíz → redirige a productos
app.get('/', (req, res) => {
  res.redirect('/products');
});

// ===============================
// SOCKET.IO - CHAT EN TIEMPO REAL
// ===============================
io.on('connection', (socket) => {
  console.log('🔌 Nuevo usuario conectado:', socket.id);

  // Cuando un usuario se une, avisar a todos
  socket.on('unirse', (nombre) => {
    socket.nombre = nombre;
    socket.broadcast.emit('usuarioConectado', nombre);
    console.log(`👤 ${nombre} se unió al chat`);
  });

  // Cuando se recibe un mensaje, reenviarlo a todos los conectados
  socket.on('mensaje', (data) => {
    io.emit('mensaje', data); // io.emit = broadcast a TODOS (incluyendo el emisor)
    console.log(`💬 ${data.usuario}: ${data.texto}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
});

// ===============================
// INICIAR SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 Gestión de productos: http://localhost:${PORT}/products`);
  console.log(`💬 Chat: http://localhost:${PORT}/chat\n`);
});

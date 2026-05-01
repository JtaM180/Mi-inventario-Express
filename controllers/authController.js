const User = require('../models/User');
const { validationResult } = require('express-validator');

// GET /auth/login
const mostrarLogin = (req, res) => {
  res.render('auth/login', { title: 'Iniciar Sesión' });
};

// POST /auth/login
const login = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render('auth/login', {
      title: 'Iniciar Sesión',
      errores: errores.array(),
      datos: req.body
    });
  }

  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errores: [{ msg: 'Email o contraseña incorrectos' }],
        datos: req.body
      });
    }

    const passwordCorrecta = await usuario.compararPassword(password);
    if (!passwordCorrecta) {
      return res.render('auth/login', {
        title: 'Iniciar Sesión',
        errores: [{ msg: 'Email o contraseña incorrectos' }],
        datos: req.body
      });
    }

    // Crear sesión
    req.session.userId = usuario._id;
    req.session.userName = usuario.nombre;
    req.flash('success', `¡Bienvenido, ${usuario.nombre}!`);
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al iniciar sesión');
    res.redirect('/auth/login');
  }
};

// GET /auth/register
const mostrarRegistro = (req, res) => {
  res.render('auth/register', { title: 'Crear Cuenta' });
};

// POST /auth/register
const register = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render('auth/register', {
      title: 'Crear Cuenta',
      errores: errores.array(),
      datos: req.body
    });
  }

  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.render('auth/register', {
        title: 'Crear Cuenta',
        errores: [{ msg: 'Ya existe una cuenta con ese email' }],
        datos: req.body
      });
    }

    await User.create({ nombre, email, password });
    req.flash('success', 'Cuenta creada. Ya puedes iniciar sesión.');
    res.redirect('/auth/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear la cuenta');
    res.redirect('/auth/register');
  }
};

// POST /auth/logout
const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};

module.exports = { mostrarLogin, login, mostrarRegistro, register, logout };

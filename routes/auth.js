const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { mostrarLogin, login, mostrarRegistro, register, logout } = require('../controllers/authController');

const validarLogin = [
  body('email').isEmail().withMessage('Ingresa un email válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

const validarRegistro = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('Ingresa un email válido'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('confirmar')
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Las contraseñas no coinciden');
      return true;
    })
];

router.get('/login', mostrarLogin);
router.post('/login', validarLogin, login);
router.get('/register', mostrarRegistro);
router.post('/register', validarRegistro, register);
router.post('/logout', logout);

module.exports = router;

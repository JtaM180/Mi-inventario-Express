const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/authMiddleware');

// El chat solo es accesible para usuarios autenticados
router.get('/', requireLogin, (req, res) => {
  res.render('chat', {
    title: 'Chat en Tiempo Real',
    usuario: req.session.userName
  });
});

module.exports = router;

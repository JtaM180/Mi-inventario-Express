// Middleware que protege rutas: si no hay sesión, redirige al login
const requireLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); // Usuario autenticado, continuar
  }
  req.flash('error', 'Debes iniciar sesión para acceder a esta página');
  res.redirect('/auth/login');
};

module.exports = { requireLogin };

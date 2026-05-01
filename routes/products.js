const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const { requireLogin } = require('../middleware/authMiddleware');
const {
  listarProductos,
  mostrarFormularioCrear,
  crearProducto,
  mostrarFormularioEditar,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productController');

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + nombre original
    const nombreUnico = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
    cb(null, nombreUnico);
  }
});

// Validación de tipo y tamaño de imagen
const fileFilter = (req, file, cb) => {
  const tiposPermitidos = /jpeg|jpg|png|gif|webp/;
  const extname = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
  const mimetype = tiposPermitidos.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Máximo 2MB
});

// Validaciones de formulario con express-validator
const validarProducto = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede superar 100 caracteres'),
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ max: 500 }).withMessage('La descripción no puede superar 500 caracteres')
];

// Todas las rutas de productos requieren login
router.use(requireLogin);

router.get('/', listarProductos);
router.get('/create', mostrarFormularioCrear);
router.post('/', upload.single('imagen'), validarProducto, crearProducto);
router.get('/:id/edit', mostrarFormularioEditar);
router.post('/:id', upload.single('imagen'), validarProducto, actualizarProducto);
router.post('/:id/delete', eliminarProducto);

module.exports = router;

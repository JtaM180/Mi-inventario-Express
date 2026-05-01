const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// GET /products - Listar todos los productos
const listarProductos = async (req, res) => {
  try {
    const productos = await Product.find().sort({ creadoEn: -1 });
    res.render('products/index', {
      title: 'Mis Productos',
      productos: productos.map(p => p.toObject()),
      usuario: req.session.userName
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al obtener los productos');
    res.redirect('/');
  }
};

// GET /products/create - Formulario de creación
const mostrarFormularioCrear = (req, res) => {
  res.render('products/create', {
    title: 'Nuevo Producto',
    usuario: req.session.userName
  });
};

// POST /products - Crear producto
const crearProducto = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    // Si hay imagen subida pero el formulario falló, eliminarla
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('products/create', {
      title: 'Nuevo Producto',
      errores: errores.array(),
      datos: req.body,
      usuario: req.session.userName
    });
  }

  try {
    const { nombre, precio, descripcion } = req.body;
    const imagen = req.file ? req.file.filename : 'default-product.png';

    await Product.create({ nombre, precio, descripcion, imagen });
    req.flash('success', 'Producto creado exitosamente');
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al crear el producto');
    res.redirect('/products/create');
  }
};

// GET /products/:id/edit - Formulario de edición
const mostrarFormularioEditar = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      req.flash('error', 'Producto no encontrado');
      return res.redirect('/products');
    }
    res.render('products/edit', {
      title: 'Editar Producto',
      producto: producto.toObject(),
      usuario: req.session.userName
    });
  } catch (error) {
    req.flash('error', 'Error al cargar el producto');
    res.redirect('/products');
  }
};

// POST /products/:id - Actualizar producto
const actualizarProducto = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    if (req.file) fs.unlinkSync(req.file.path);
    const producto = await Product.findById(req.params.id);
    return res.render('products/edit', {
      title: 'Editar Producto',
      errores: errores.array(),
      producto: producto.toObject(),
      usuario: req.session.userName
    });
  }

  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      req.flash('error', 'Producto no encontrado');
      return res.redirect('/products');
    }

    const { nombre, precio, descripcion } = req.body;
    producto.nombre = nombre;
    producto.precio = precio;
    producto.descripcion = descripcion;

    // Si se subió nueva imagen, reemplazar la anterior
    if (req.file) {
      if (producto.imagen !== 'default-product.png') {
        const imagenAnterior = path.join(__dirname, '../uploads', producto.imagen);
        if (fs.existsSync(imagenAnterior)) fs.unlinkSync(imagenAnterior);
      }
      producto.imagen = req.file.filename;
    }

    await producto.save();
    req.flash('success', 'Producto actualizado correctamente');
    res.redirect('/products');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error al actualizar el producto');
    res.redirect('/products');
  }
};

// POST /products/:id/delete - Eliminar producto
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (producto && producto.imagen !== 'default-product.png') {
      const rutaImagen = path.join(__dirname, '../uploads', producto.imagen);
      if (fs.existsSync(rutaImagen)) fs.unlinkSync(rutaImagen);
    }
    req.flash('success', 'Producto eliminado');
    res.redirect('/products');
  } catch (error) {
    req.flash('error', 'Error al eliminar el producto');
    res.redirect('/products');
  }
};

module.exports = {
  listarProductos,
  mostrarFormularioCrear,
  crearProducto,
  mostrarFormularioEditar,
  actualizarProducto,
  eliminarProducto
};

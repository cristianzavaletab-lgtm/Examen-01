const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { validarProducto, manejarErroresValidacion } = require('../middleware/validacion');

// GET /productos - Listar todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json({
      exito: true,
      cantidad: productos.length,
      data: productos
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener los productos',
      error: error.message
    });
  }
});

// GET /productos/:id - Ver un solo producto
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.json({
      exito: true,
      data: producto
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener el producto',
      error: error.message
    });
  }
});

// POST /productos - Crear nuevo producto
router.post('/', validarProducto, manejarErroresValidacion, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      categoria
    });
    
    const productoGuardado = await nuevoProducto.save();
    
    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente',
      data: productoGuardado
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear el producto',
      error: error.message
    });
  }
});

// PUT /productos/:id - Actualizar producto
router.put('/:id', validarProducto, manejarErroresValidacion, async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;
    
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, precio, stock, categoria },
      { new: true, runValidators: true }
    );
    
    if (!productoActualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Producto actualizado exitosamente',
      data: productoActualizado
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar el producto',
      error: error.message
    });
  }
});

// DELETE /productos/:id - Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    
    if (!productoEliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Producto eliminado exitosamente',
      data: productoEliminado
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar el producto',
      error: error.message
    });
  }
});

module.exports = router;
const { body, validationResult } = require('express-validator');

// Validaciones para crear/actualizar producto
const validarProducto = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres'),
  
  body('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
    .isIn(['Electrónica', 'Ropa', 'Alimentos', 'Hogar', 'Deportes', 'Libros'])
    .withMessage('Categoría no válida')
];

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error de validación',
      errores: errores.array()
    });
  }
  next();
};

module.exports = {
  validarProducto,
  manejarErroresValidacion
};
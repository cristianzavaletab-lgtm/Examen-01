const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
const conectarDB = require('./config/db');
conectarDB();

const app = express();

// Middleware
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Parsear JSON

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rutas de la API
app.use('/productos', require('./routes/productos'));

// Ruta raíz - servir el HTML del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Manejo de rutas no encontradas (solo para rutas de API)
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    exito: false,
    mensaje: 'Error interno del servidor',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Usa MongoDB Atlas o local
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/productos_db';
    
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
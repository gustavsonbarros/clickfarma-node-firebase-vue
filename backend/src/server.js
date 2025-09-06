process.env.FIREBASE_PROJECT_ID = 'clickfarma-2c048';
process.env.FIREBASE_STORAGE_BUCKET = 'clickfarma-2c048.firebasestorage.app';
process.env.FIREBASE_DATABASE_URL = 'https://clickfarma-2c048.firebaseio.com';
process.env.PORT = '3000';
process.env.NODE_ENV = 'development';
process.env.FRONTEND_URL = 'http://localhost:8080';


const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// 📦 IMPORTAÇÃO DE ROTAS
// ======================
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
// Futuras rotas:
// const productRoutes = require('./routes/products');
// const orderRoutes = require('./routes/orders');

// ======================
// ⚙️ MIDDLEWARES GLOBAIS
// ======================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080', // URL do Vue.js
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Para parsing de JSON
app.use(express.urlencoded({ extended: true })); // Para parsing de formulários

// ======================
// 🚀 ROTAS DA API
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
// Futuras rotas:
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);

// ======================
// 🏠 ROTA DE SAUDAÇÃO (Health Check)
// ======================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    message: '✅ ClickFarma API funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ======================
// 🏠 ROTA RAIZ (Redirect)
// ======================
app.get('/', (req, res) => {
  res.redirect('/api/health');
});

// ======================
// ❌ MANEJO DE ROTAS NÃO ENCONTRADAS
// ======================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    path: req.originalUrl
  });
});

// ======================
// ⚡ MANEJO DE ERROS GLOBAIS
// ======================
app.use((error, req, res, next) => {
  console.error('Erro não tratado:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// ======================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ======================
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 CLICKFARMA API INICIADA COM SUCESSO!');
  console.log('='.repeat(50));
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Servidor: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log('='.repeat(50));
  
  // Lista de rotas disponíveis
  console.log('📋 Rotas disponíveis:');
  console.log('   POST   /api/auth/register');
  console.log('   POST   /api/auth/verify-token');
  console.log('   GET    /api/profile/me');
  console.log('   GET    /api/health');
  console.log('='.repeat(50));
});
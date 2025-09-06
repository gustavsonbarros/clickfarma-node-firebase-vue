// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Importe o cors

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilita CORS
app.use(express.json()); // Para parsing de JSON

// Rotas
app.use('/api/auth', require('./routes/auth'));

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ ClickFarma API funcionando!',
    projectId: process.env.FIREBASE_PROJECT_ID,
    status: 'OK'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📦 Projeto: ${process.env.FIREBASE_PROJECT_ID}`);
});
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../config/firebase');

// GET /api/profile/me - Rota protegida
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = userDoc.data();
    
    res.json({
      user: {
        ...userData,
        uid: req.user.uid,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
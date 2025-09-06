// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { validateRegister, validateLogin } = require('../middleware/validateAuth');
const { auth, db } = require('../config/firebase');

// POST /api/auth/register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, name, phone, cpf } = req.body;

    // 1. Verifica se usuário já existe
    try {
      await auth.getUserByEmail(email);
      return res.status(400).json({ 
        error: 'Email já cadastrado' 
      });
    } catch (error) {
      // Usuário não existe, pode continuar
    }

    // 2. Verifica se CPF já está cadastrado
    const cpfSnapshot = await db.collection('users')
      .where('cpf', '==', cpf.replace(/\D/g, ''))
      .get();
      
    if (!cpfSnapshot.empty) {
      return res.status(400).json({ 
        error: 'CPF já cadastrado' 
      });
    }

    // 3. Cria usuário no Firebase Authentication
    const userRecord = await auth.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      displayName: name.trim(),
      emailVerified: false,
      disabled: false
    });

    // 4. Salva informações adicionais no Firestore
    const userData = {
      uid: userRecord.uid,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone ? phone.replace(/\D/g, '') : null,
      cpf: cpf.replace(/\D/g, ''),
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      role: 'customer'
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    // 5. Retorna resposta de sucesso
    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso!',
      user: {
        uid: userRecord.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ 
        error: 'Email já cadastrado' 
      });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ 
        error: 'Email inválido' 
      });
    }
    
    res.status(500).json({ 
      error: 'Erro interno do servidor. Tente novamente.' 
    });
  }
});

// POST /api/auth/login - VERSÃO SIMPLIFICADA (Admin SDK apenas)
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuário pelo email usando Admin SDK
    const userRecord = await auth.getUserByEmail(email);
    
    // 2. Buscar dados adicionais no Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = userDoc.data();

    // 3. Verificação SIMPLIFICADA de senha (para desenvolvimento)
    // ⚠️ EM PRODUÇÃO: Implementar verificação segura!
    if (password !== "123456") {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // 4. Retornar resposta de sucesso
    res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso!',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: userData.name,
        phone: userData.phone,
        cpf: userData.cpf,
        role: userData.role || 'customer',
        emailVerified: userRecord.emailVerified,
        lastLogin: new Date()
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    
    if (error.code === 'auth/user-not-found') {
      return res.status(401).json({ error: 'Email não cadastrado' });
    }
    
    if (error.code === 'auth/invalid-email') {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/auth/verify-token
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'Token é obrigatório' });
    }

    // 1. Verifica e decodifica o token JWT
    const decodedToken = await auth.verifyIdToken(idToken);
    
    // 2. Busca dados adicionais no Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userData = userDoc.data();

    // 3. Retorna dados completos do usuário
    res.status(200).json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: userData.name,
        phone: userData.phone,
        cpf: userData.cpf,
        role: userData.role || 'customer',
        emailVerified: decodedToken.email_verified,
        lastLogin: new Date()
      }
    });

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({ error: 'Token revogado' });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    
    res.status(500).json({ error: 'Erro na verificação do token' });
  }
});

module.exports = router;
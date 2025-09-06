// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');
const { validateRegister } = require('../middleware/validateAuth');

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
      role: 'customer' // Papel padrão: cliente
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
    
    // Tratamento de erros específicos do Firebase
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

module.exports = router;
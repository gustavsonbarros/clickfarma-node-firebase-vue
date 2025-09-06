const { auth } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acesso não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role 
    };
    
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = { authenticateToken };
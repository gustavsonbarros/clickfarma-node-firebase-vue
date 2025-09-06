// backend/src/middleware/validateAuth.js
const validateRegister = (req, res, next) => {
  const { email, password, name, phone, cpf } = req.body;
  
  // Verifica campos obrigatórios
  if (!email || !password || !name || !cpf) {
    return res.status(400).json({ 
      error: 'Email, senha, nome e CPF são obrigatórios' 
    });
  }
  
  // Valida email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  // Valida senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Senha deve ter pelo menos 6 caracteres' 
    });
  }
  
  // Valida CPF (formato básico)
  const cpfRegex = /^\d{11}$/;
  if (!cpfRegex.test(cpf.replace(/\D/g, ''))) {
    return res.status(400).json({ error: 'CPF inválido' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Verifica campos obrigatórios
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email e senha são obrigatórios' 
    });
  }
  
  // Valida email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  // Valida senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Senha deve ter pelo menos 6 caracteres' 
    });
  }
  
  next();
};

// Atualize o module.exports para incluir a nova função
module.exports = { validateRegister, validateLogin };
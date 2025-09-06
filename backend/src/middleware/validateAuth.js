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
  
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email e senha são obrigatórios' 
    });
  }
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Senha deve ter pelo menos 6 caracteres' 
    });
  }
  
  next();
};

const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  
  
  if (!email) {
    return res.status(400).json({ 
      error: 'Email é obrigatório' 
    });
  }
  
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  next();
};


module.exports = { validateRegister, validateLogin, validateForgotPassword };
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
  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: 'Email inválido. Use um formato válido como: usuario@exemplo.com' 
    });
  }
  
  // Valida senha forte
  const passwordStrength = checkPasswordStrength(password);
  if (!passwordStrength.strong) {
    return res.status(400).json({ 
      error: 'Senha muito fraca: ' + passwordStrength.message 
    });
  }
  
  // Valida nome
  if (!isValidName(name)) {
    return res.status(400).json({ 
      error: 'Nome deve ter entre 2 e 100 caracteres e conter apenas letras' 
    });
  }
  
  // Valida CPF
  const cpfValidation = isValidCPF(cpf);
  if (!cpfValidation.valid) {
    return res.status(400).json({ 
      error: 'CPF inválido: ' + cpfValidation.message 
    });
  }
  
  // Valida telefone (se fornecido)
  if (phone && !isValidPhone(phone)) {
    return res.status(400).json({ 
      error: 'Telefone inválido. Use formato: (11) 99999-9999' 
    });
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
  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: 'Email inválido' 
    });
  }
  
  // Valida senha (mínimo 6 caracteres)
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Senha deve ter pelo menos 6 caracteres' 
    });
  }
  
  next();
};

const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  
  // Verifica campo obrigatório
  if (!email) {
    return res.status(400).json({ 
      error: 'Email é obrigatório' 
    });
  }
  
  // Valida email
  if (!isValidEmail(email)) {
    return res.status(400).json({ 
      error: 'Email inválido' 
    });
  }
  
  next();
};

// ==================== FUNÇÕES DE VALIDAÇÃO ====================

// Validação de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de força da senha
const checkPasswordStrength = (password) => {
  const requirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  if (password.length < requirements.minLength) {
    return { strong: false, message: `Mínimo ${requirements.minLength} caracteres` };
  }

  if (!requirements.hasUpperCase) {
    return { strong: false, message: 'Inclua letras maiúsculas' };
  }

  if (!requirements.hasLowerCase) {
    return { strong: false, message: 'Inclua letras minúsculas' };
  }

  if (!requirements.hasNumbers) {
    return { strong: false, message: 'Inclua números' };
  }

  if (!requirements.hasSpecialChar) {
    return { strong: false, message: 'Inclua caracteres especiais (!@#$%^&*)' };
  }

  return { strong: true, message: 'Senha forte' };
};

// Validação de nome
const isValidName = (name) => {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,100}$/;
  return nameRegex.test(name.trim());
};

// Validação de CPF
const isValidCPF = (cpf) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) {
    return { valid: false, message: 'CPF deve ter 11 dígitos' };
  }
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpf)) {
    return { valid: false, message: 'CPF inválido' };
  }
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;
  
  // Primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i-1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return { valid: false, message: 'CPF inválido' };
  }
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i-1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return { valid: false, message: 'CPF inválido' };
  }
  
  return { valid: true, message: 'CPF válido' };
};

// Validação de telefone
const isValidPhone = (phone) => {
  const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
  return phoneRegex.test(phone);
};

module.exports = { validateRegister, validateLogin, validateForgotPassword };
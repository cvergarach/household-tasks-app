const validator = require('validator');

exports.validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (email && !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  next();
};

exports.validateDate = (req, res, next) => {
  const { date } = req.body;
  
  if (date && !validator.isISO8601(date)) {
    return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
  }
  
  next();
};

const emailService = require('../services/emailService');
const Person = require('../models/Person');

exports.sendTest = async (req, res) => {
  try {
    const { email, personName } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Se requiere un email' });
    }
    
    const result = await emailService.sendTestEmail(email, personName);
    
    res.json({
      message: 'Email de prueba enviado correctamente',
      result
    });
  } catch (error) {
    console.error('Error enviando email de prueba:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendDaily = async (req, res) => {
  try {
    const { date } = req.body;
    const emailDate = date ? new Date(date) : new Date();
    
    const results = await emailService.sendDailyEmails(emailDate);
    
    res.json({
      message: 'Emails diarios procesados',
      results
    });
  } catch (error) {
    console.error('Error enviando emails diarios:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendWeekly = async (req, res) => {
  try {
    const { weekStartDate } = req.body;
    const startDate = weekStartDate ? new Date(weekStartDate) : new Date();
    
    const results = await emailService.sendWeeklyEmails(startDate);
    
    res.json({
      message: 'Emails semanales procesados',
      results
    });
  } catch (error) {
    console.error('Error enviando emails semanales:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendMonthly = async (req, res) => {
  try {
    const { year, month } = req.body;
    const today = new Date();
    const emailYear = year || today.getFullYear();
    const emailMonth = month || (today.getMonth() + 1);
    
    const results = await emailService.sendMonthlyEmails(emailYear, emailMonth);
    
    res.json({
      message: 'Emails mensuales procesados',
      results
    });
  } catch (error) {
    console.error('Error enviando emails mensuales:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    // Aquí podrías implementar un modelo para guardar el historial de emails
    // Por ahora retornamos un mensaje simple
    res.json({
      message: 'Historial de emails no implementado aún',
      note: 'Puedes agregar un modelo EmailLog para guardar el historial'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

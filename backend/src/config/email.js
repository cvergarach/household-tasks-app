const nodemailer = require('nodemailer');

// Global transporter instance
let transporter = null;
let currentConfig = null;

// Create transporter with given config
function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: parseInt(config.port),
    secure: config.secure || false,
    auth: {
      user: config.user,
      pass: config.password
    }
  });
}

// Get configuration from environment variables
function getEnvConfig() {
  return {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER
  };
}

// Initialize transporter with config
async function initializeTransporter(config = null) {
  try {
    let emailConfig = config;

    // If no config provided, try to get from database first
    if (!emailConfig) {
      try {
        const EmailConfig = require('../models/EmailConfig');
        const dbConfig = await EmailConfig.findOne({
          where: { enabled: true },
          order: [['updatedAt', 'DESC']]
        });

        if (dbConfig) {
          console.log('📧 Usando configuración de email desde la base de datos');
          emailConfig = {
            host: dbConfig.host,
            port: dbConfig.port,
            secure: dbConfig.secure,
            user: dbConfig.user,
            password: dbConfig.password,
            from: dbConfig.from || dbConfig.user
          };
        }
      } catch (dbError) {
        console.log('ℹ️ No se pudo cargar configuración de DB, usando variables de entorno');
      }
    }

    // Use environment variables if still no config
    if (!emailConfig) {
      emailConfig = getEnvConfig();
    }

    // Check if we have minimum required config
    if (!emailConfig.host || !emailConfig.user || !emailConfig.password) {
      console.warn('⚠️  Email no configurado - faltan credenciales');
      return null;
    }

    currentConfig = emailConfig;
    transporter = createTransporter(emailConfig);

    // Verify configuration (with timeout)
    await transporter.verify();
    console.log('✅ Servidor de email listo');
    return transporter;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error.message);
    return null;
  }
}

// Get current transporter (lazy initialization)
async function getTransporter() {
  if (!transporter) {
    await initializeTransporter();
  }
  return transporter;
}

// Update transporter with new configuration
async function updateTransporter(newConfig) {
  return await initializeTransporter(newConfig);
}

// Get current configuration (without password)
function getCurrentConfig() {
  if (!currentConfig) {
    return getEnvConfig();
  }
  return {
    host: currentConfig.host,
    port: currentConfig.port,
    secure: currentConfig.secure,
    user: currentConfig.user,
    from: currentConfig.from,
    password: currentConfig.password ? '********' : null
  };
}

// Initialize on module load
initializeTransporter().catch(err => {
  console.error('Error inicial de email:', err.message);
});

module.exports = {
  getTransporter,
  updateTransporter,
  getCurrentConfig,
  createTransporter
};

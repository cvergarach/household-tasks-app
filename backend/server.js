require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/config/database');
const scheduler = require('./src/jobs/scheduler');

const PORT = process.env.PORT || 3001;

// Sincronizar base de datos e iniciar servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida');

    // Asegurar que la tabla EmailConfig exista
    try {
      const EmailConfig = require('./src/models/EmailConfig');
      await EmailConfig.sync({ alter: true });
      console.log('✅ Tabla email_config verificada/creada');
    } catch (error) {
      console.log('⚠️  No se pudo crear tabla email_config:', error.message);
    }

    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados con la base de datos');

    // Iniciar scheduler de emails
    scheduler.start();
    console.log('✅ Scheduler de emails iniciado');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

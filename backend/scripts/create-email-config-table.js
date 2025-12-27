require('dotenv').config();
const { sequelize } = require('../src/config/database');
const EmailConfig = require('../src/models/EmailConfig');

async function createEmailConfigTable() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('✅ Conexión establecida');

        console.log('🔄 Creando tabla email_config...');
        await EmailConfig.sync({ force: false }); // force: false para no borrar datos existentes
        console.log('✅ Tabla email_config creada exitosamente');

        console.log('📊 Verificando tabla...');
        const count = await EmailConfig.count();
        console.log(`✅ Tabla verificada. Registros existentes: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createEmailConfigTable();

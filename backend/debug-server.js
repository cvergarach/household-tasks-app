try {
    console.log('Loading dotenv...');
    require('dotenv').config();

    console.log('Loading app...');
    const app = require('./src/app');

    console.log('Loading database...');
    const { sequelize } = require('./src/config/database');

    console.log('Loading scheduler...');
    const scheduler = require('./src/jobs/scheduler');

    console.log('All modules loaded successfully!');

    const PORT = process.env.PORT || 3001;

    async function startServer() {
        try {
            await sequelize.authenticate();
            console.log('✅ Database connected');

            await sequelize.sync({ alter: true });
            console.log('✅ Models synced');

            scheduler.start();
            console.log('✅ Scheduler started');

            app.listen(PORT, () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        } catch (error) {
            console.error('❌ Error starting server:', error);
            process.exit(1);
        }
    }

    startServer();
} catch (error) {
    console.error('❌ Error loading modules:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}

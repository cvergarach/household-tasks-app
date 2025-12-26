const cron = require('node-cron');
const emailService = require('../services/emailService');
const { startOfWeek, addDays } = require('date-fns');

class Scheduler {
  start() {
    console.log('⏰ Iniciando scheduler de emails...');

    // Email diario a las 7:00 AM (hora de Chile)
    cron.schedule('0 7 * * *', async () => {
      console.log('📧 Ejecutando envío de emails diarios...');
      try {
        const today = new Date();
        const results = await emailService.sendDailyEmails(today);
        console.log('✅ Emails diarios enviados:', results);
      } catch (error) {
        console.error('❌ Error en envío diario:', error);
      }
    }, {
      timezone: "America/Santiago"
    });

    // Email semanal domingos a las 7:00 AM
    cron.schedule('0 7 * * 0', async () => {
      console.log('📧 Ejecutando envío de emails semanales...');
      try {
        const nextMonday = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7);
        const results = await emailService.sendWeeklyEmails(nextMonday);
        console.log('✅ Emails semanales enviados:', results);
      } catch (error) {
        console.error('❌ Error en envío semanal:', error);
      }
    }, {
      timezone: "America/Santiago"
    });

    // Email mensual día 1 de cada mes a las 7:00 AM
    cron.schedule('0 7 1 * *', async () => {
      console.log('📧 Ejecutando envío de emails mensuales...');
      try {
        const today = new Date();
        const results = await emailService.sendMonthlyEmails(
          today.getFullYear(),
          today.getMonth() + 1
        );
        console.log('✅ Emails mensuales enviados:', results);
      } catch (error) {
        console.error('❌ Error en envío mensual:', error);
      }
    }, {
      timezone: "America/Santiago"
    });

    console.log('✅ Scheduler configurado correctamente');
    console.log('   - Diario: 7:00 AM (todos los días)');
    console.log('   - Semanal: 7:00 AM (domingos)');
    console.log('   - Mensual: 7:00 AM (día 1)');
  }
}

module.exports = new Scheduler();

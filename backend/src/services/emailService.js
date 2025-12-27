const { getTransporter, getCurrentConfig } = require('../config/email');
const { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');
const { es } = require('date-fns/locale');
const Assignment = require('../models/Assignment');
const Person = require('../models/Person');
const Task = require('../models/Task');
const { Op } = require('sequelize');

class EmailService {
  /**
   * Enviar email diario a una persona
   */
  async sendDailyEmail(person, date) {
    try {
      if (!person.emailNotifications.daily) {
        console.log(`Email diario desactivado para ${person.name}`);
        return { sent: false, reason: 'disabled' };
      }

      const assignments = await Assignment.findAll({
        where: {
          personId: person.id,
          date: format(date, 'yyyy-MM-dd')
        },
        include: [{ model: Task, as: 'task' }]
      });

      if (assignments.length === 0) {
        console.log(`Sin tareas para ${person.name} el ${format(date, 'dd/MM/yyyy')}`);
        return { sent: false, reason: 'no_tasks' };
      }

      const totalMinutes = assignments.reduce((sum, a) => sum + (a.task?.duration || 0), 0);
      const html = this.generateDailyEmailHTML(person, date, assignments, totalMinutes);

      const transporter = await getTransporter();
      if (!transporter) {
        throw new Error('Email no configurado');
      }
      const config = getCurrentConfig();
      await transporter.sendMail({
        from: config.from,
        to: person.email,
        subject: `🏠 Tus tareas de hoy - ${format(date, 'dd/MM/yyyy', { locale: es })}`,
        html
      });

      console.log(`✅ Email diario enviado a ${person.email}`);
      return { sent: true, taskCount: assignments.length };
    } catch (error) {
      console.error(`❌ Error enviando email diario a ${person.email}:`, error);
      throw error;
    }
  }

  /**
   * Enviar emails diarios a todas las personas
   */
  async sendDailyEmails(date) {
    const persons = await Person.findAll();
    const results = [];

    for (const person of persons) {
      try {
        const result = await this.sendDailyEmail(person, date);
        results.push({ person: person.name, ...result });
      } catch (error) {
        results.push({ person: person.name, sent: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Enviar email semanal
   */
  async sendWeeklyEmail(person, weekStartDate) {
    try {
      if (!person.emailNotifications.weekly) {
        return { sent: false, reason: 'disabled' };
      }

      const weekEnd = endOfWeek(weekStartDate, { weekStartsOn: 1 });

      const assignments = await Assignment.findAll({
        where: {
          personId: person.id,
          date: {
            [Op.between]: [
              format(weekStartDate, 'yyyy-MM-dd'),
              format(weekEnd, 'yyyy-MM-dd')
            ]
          }
        },
        include: [{ model: Task, as: 'task' }],
        order: [['date', 'ASC']]
      });

      if (assignments.length === 0) {
        return { sent: false, reason: 'no_tasks' };
      }

      const html = this.generateWeeklyEmailHTML(person, weekStartDate, weekEnd, assignments);

      const transporter = await getTransporter();
      if (!transporter) {
        throw new Error('Email no configurado');
      }
      const config = getCurrentConfig();
      await transporter.sendMail({
        from: config.from,
        to: person.email,
        subject: `📅 Tus tareas de la semana - ${format(weekStartDate, 'dd/MM')} a ${format(weekEnd, 'dd/MM/yyyy')}`,
        html
      });

      console.log(`✅ Email semanal enviado a ${person.email}`);
      return { sent: true, taskCount: assignments.length };
    } catch (error) {
      console.error(`❌ Error enviando email semanal:`, error);
      throw error;
    }
  }

  /**
   * Enviar emails semanales
   */
  async sendWeeklyEmails(weekStartDate) {
    const persons = await Person.findAll();
    const results = [];

    for (const person of persons) {
      try {
        const result = await this.sendWeeklyEmail(person, weekStartDate);
        results.push({ person: person.name, ...result });
      } catch (error) {
        results.push({ person: person.name, sent: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Enviar email mensual
   */
  async sendMonthlyEmail(person, year, month) {
    try {
      if (!person.emailNotifications.monthly) {
        return { sent: false, reason: 'disabled' };
      }

      const monthStart = startOfMonth(new Date(year, month - 1));
      const monthEnd = endOfMonth(monthStart);

      const assignments = await Assignment.findAll({
        where: {
          personId: person.id,
          date: {
            [Op.between]: [
              format(monthStart, 'yyyy-MM-dd'),
              format(monthEnd, 'yyyy-MM-dd')
            ]
          }
        },
        include: [{ model: Task, as: 'task' }],
        order: [['date', 'ASC']]
      });

      if (assignments.length === 0) {
        return { sent: false, reason: 'no_tasks' };
      }

      const html = this.generateMonthlyEmailHTML(person, monthStart, assignments);

      const transporter = await getTransporter();
      if (!transporter) {
        throw new Error('Email no configurado');
      }
      const config = getCurrentConfig();
      await transporter.sendMail({
        from: config.from,
        to: person.email,
        subject: `📆 Tus tareas del mes - ${format(monthStart, 'MMMM yyyy', { locale: es })}`,
        html
      });

      console.log(`✅ Email mensual enviado a ${person.email}`);
      return { sent: true, taskCount: assignments.length };
    } catch (error) {
      console.error(`❌ Error enviando email mensual:`, error);
      throw error;
    }
  }

  /**
   * Enviar emails mensuales
   */
  async sendMonthlyEmails(year, month) {
    const persons = await Person.findAll();
    const results = [];

    for (const person of persons) {
      try {
        const result = await this.sendMonthlyEmail(person, year, month);
        results.push({ person: person.name, ...result });
      } catch (error) {
        results.push({ person: person.name, sent: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Generar HTML del email diario
   */
  generateDailyEmailHTML(person, date, assignments, totalMinutes) {
    const tasksList = assignments.map(a => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${a.task.name}</strong>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${a.task.duration} min
        </td>
      </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${person.color}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    table { width: 100%; border-collapse: collapse; background: white; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏠 Tareas del Día</h1>
      <p>${format(date, "EEEE, dd 'de' MMMM", { locale: es })}</p>
    </div>
    <div class="content">
      <p>Hola <strong>${person.name}</strong>,</p>
      <p>Estas son tus tareas para hoy:</p>
      <table>
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 12px; text-align: left;">Tarea</th>
            <th style="padding: 12px; text-align: center;">Tiempo</th>
          </tr>
        </thead>
        <tbody>
          ${tasksList}
        </tbody>
        <tfoot>
          <tr style="background: #f3f4f6; font-weight: bold;">
            <td style="padding: 12px;">TOTAL</td>
            <td style="padding: 12px; text-align: center;">${totalMinutes} min (${(totalMinutes / 60).toFixed(1)} hrs)</td>
          </tr>
        </tfoot>
      </table>
      <p style="margin-top: 20px;">
        💡 <em>Recuerda marcar las tareas como completadas en la app.</em>
      </p>
    </div>
    <div class="footer">
      Generado automáticamente por App Tareas del Hogar
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generar HTML del email semanal
   */
  generateWeeklyEmailHTML(person, weekStart, weekEnd, assignments) {
    // Agrupar por día
    const byDay = {};
    assignments.forEach(a => {
      const day = a.date;
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(a);
    });

    const daysList = Object.keys(byDay).sort().map(day => {
      const dayTasks = byDay[day];
      const dayTotal = dayTasks.reduce((sum, a) => sum + a.task.duration, 0);
      const taskItems = dayTasks.map(a => `<li>${a.task.name} (${a.task.duration} min)</li>`).join('');

      return `
        <div style="margin-bottom: 20px; background: white; padding: 15px; border-left: 4px solid ${person.color};">
          <h3>${format(new Date(day), "EEEE dd/MM", { locale: es })}</h3>
          <ul>${taskItems}</ul>
          <p><strong>Total: ${dayTotal} min (${(dayTotal / 60).toFixed(1)} hrs)</strong></p>
        </div>
      `;
    }).join('');

    const totalMinutes = assignments.reduce((sum, a) => sum + a.task.duration, 0);

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${person.color}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📅 Tareas de la Semana</h1>
      <p>${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM/yyyy')}</p>
    </div>
    <div class="content">
      <p>Hola <strong>${person.name}</strong>,</p>
      <p>Aquí está tu plan de tareas para esta semana:</p>
      ${daysList}
      <div style="background: ${person.color}20; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <h3>📊 Resumen Semanal</h3>
        <p><strong>Total de tareas:</strong> ${assignments.length}</p>
        <p><strong>Tiempo total:</strong> ${totalMinutes} min (${(totalMinutes / 60).toFixed(1)} horas)</p>
        <p><strong>Promedio por día:</strong> ${(totalMinutes / 7 / 60).toFixed(1)} horas</p>
      </div>
    </div>
    <div class="footer">
      Generado automáticamente por App Tareas del Hogar
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Generar HTML del email mensual
   */
  generateMonthlyEmailHTML(person, monthStart, assignments) {
    const totalMinutes = assignments.reduce((sum, a) => sum + a.task.duration, 0);
    const dailyTasks = assignments.filter(a => a.task.frequency === 'daily');
    const weeklyTasks = assignments.filter(a => a.task.frequency === 'weekly');
    const monthlyTasks = assignments.filter(a => a.task.frequency === 'monthly');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: ${person.color}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    .footer { background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    .stat-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📆 Plan Mensual de Tareas</h1>
      <p>${format(monthStart, "MMMM yyyy", { locale: es })}</p>
    </div>
    <div class="content">
      <p>Hola <strong>${person.name}</strong>,</p>
      <p>Este es tu resumen de tareas para el mes:</p>
      
      <div class="stat-box">
        <h3>📊 Estadísticas del Mes</h3>
        <p><strong>Total de tareas asignadas:</strong> ${assignments.length}</p>
        <p><strong>Tiempo total estimado:</strong> ${(totalMinutes / 60).toFixed(1)} horas</p>
        <p><strong>Promedio por día:</strong> ${(totalMinutes / 30 / 60).toFixed(1)} horas</p>
        <p><strong>Promedio por semana:</strong> ${(totalMinutes / 4 / 60).toFixed(1)} horas</p>
      </div>

      <div class="stat-box">
        <h3>🔄 Por Frecuencia</h3>
        <p><strong>Tareas diarias:</strong> ${dailyTasks.length}</p>
        <p><strong>Tareas semanales:</strong> ${weeklyTasks.length}</p>
        <p><strong>Tareas mensuales:</strong> ${monthlyTasks.length}</p>
      </div>

      <p style="margin-top: 20px;">
        💪 <em>¡Planifica tu mes con anticipación!</em>
      </p>
    </div>
    <div class="footer">
      Generado automáticamente por App Tareas del Hogar
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Enviar email de prueba
   */
  async sendTestEmail(email, personName) {
    try {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; padding: 20px;">
  <h2>✅ Email de Prueba</h2>
  <p>Hola <strong>${personName || 'Usuario'}</strong>,</p>
  <p>Este es un email de prueba del sistema de Tareas del Hogar.</p>
  <p>Si recibiste este email, significa que la configuración está funcionando correctamente.</p>
  <p>Fecha y hora: ${new Date().toLocaleString('es-CL')}</p>
  <hr>
  <p style="font-size: 12px; color: #666;">Generado automáticamente por App Tareas del Hogar</p>
</body>
</html>
      `;

      const transporter = await getTransporter();
      if (!transporter) {
        throw new Error('Email no configurado');
      }
      const config = getCurrentConfig();
      await transporter.sendMail({
        from: config.from,
        to: email,
        subject: '✅ Email de Prueba - Tareas del Hogar',
        html
      });

      console.log(`✅ Email de prueba enviado a ${email}`);
      return { sent: true };
    } catch (error) {
      console.error(`❌ Error enviando email de prueba:`, error);
      throw error;
    }
  }
}

module.exports = new EmailService();

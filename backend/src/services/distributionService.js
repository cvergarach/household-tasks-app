const { eachDayOfInterval, format, addWeeks, addMonths } = require('date-fns');
const Assignment = require('../models/Assignment');
const Task = require('../models/Task');
const Person = require('../models/Person');

class DistributionService {
  /**
   * Generar todas las asignaciones para un período
   */
  async generateAssignments(distribution, startDate, endDate) {
    const assignmentsCreated = [];
    const validPersons = await Person.findAll();
    const validTasks = await Task.findAll();

    const personIds = new Set(validPersons.map(p => p.id));
    const taskIds = new Set(validTasks.map(t => t.id));

    console.log(`🤖 [DISTRIBUTION] Procesando ${distribution.assignments?.length || 0} asignaciones sugeridas...`);

    if (!distribution.assignments || !Array.isArray(distribution.assignments)) {
      console.error('❌ [DISTRIBUTION] El formato de distribución no es válido (assignments no es un array)');
      return [];
    }

    for (const assignment of distribution.assignments) {
      try {
        // Validar que los IDs existan para evitar errores de FK
        if (!personIds.has(assignment.personId)) {
          console.warn(`⚠️ [DISTRIBUTION] Persona ID ${assignment.personId} no existe. Saltando.`);
          continue;
        }
        if (!taskIds.has(assignment.taskId)) {
          console.warn(`⚠️ [DISTRIBUTION] Tarea ID ${assignment.taskId} no existe. Saltando.`);
          continue;
        }

        // Validar fecha básica
        if (!assignment.date) {
          console.warn(`⚠️ [DISTRIBUTION] Asignación sin fecha. Saltando.`);
          continue;
        }

        const created = await Assignment.create({
          taskId: assignment.taskId,
          personId: assignment.personId,
          date: assignment.date,
          completed: false
        });
        assignmentsCreated.push(created);
      } catch (error) {
        console.error('❌ [DISTRIBUTION] Error al crear asignación:', error.message);
      }
    }

    console.log(`✅ [DISTRIBUTION] ${assignmentsCreated.length} asignaciones guardadas exitosamente`);
    return assignmentsCreated;
  }

  /**
   * Calcular estadísticas de una persona
   */
  async calculatePersonStatistics(personId, startDate, endDate) {
    const assignments = await Assignment.findAll({
      where: {
        personId,
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      include: [{
        model: Task,
        as: 'task'
      }]
    });

    const totalMinutes = assignments.reduce((sum, a) => sum + (a.task?.duration || 0), 0);
    const days = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) }).length;

    return {
      totalHours: totalMinutes / 60,
      totalMinutes,
      taskCount: assignments.length,
      averageTasksPerDay: assignments.length / days,
      averageHoursPerDay: (totalMinutes / 60) / days
    };
  }

  /**
   * Obtener balance general
   */
  async getBalance(startDate, endDate) {
    const persons = await Person.findAll();
    const stats = {};

    for (const person of persons) {
      stats[person.id] = await this.calculatePersonStatistics(person.id, startDate, endDate);
    }

    const hours = Object.values(stats).map(s => s.totalHours);
    const maxHours = Math.max(...hours);
    const minHours = Math.min(...hours);
    const avgHours = hours.reduce((a, b) => a + b, 0) / hours.length;

    return {
      statistics: stats,
      maxHours,
      minHours,
      avgHours,
      maxDifference: maxHours - minHours,
      isBalanced: (maxHours - minHours) <= 2 // Diferencia menor a 2 horas
    };
  }

  /**
   * Limpiar todas las asignaciones
   */
  async clearAllAssignments() {
    await Assignment.destroy({ where: {} });
  }

  /**
   * Limpiar asignaciones de una tarea específica
   */
  async clearTaskAssignments(taskId) {
    await Assignment.destroy({ where: { taskId } });
  }
}

module.exports = new DistributionService();

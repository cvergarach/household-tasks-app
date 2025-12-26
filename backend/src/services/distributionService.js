const { eachDayOfInterval, format, addWeeks, addMonths } = require('date-fns');
const Assignment = require('../models/Assignment');
const Task = require('../models/Task');
const Person = require('../models/Person');

class DistributionService {
  /**
   * Generar todas las asignaciones para un período
   */
  async generateAssignments(distribution, startDate, endDate) {
    const assignments = [];
    
    for (const assignment of distribution.assignments) {
      try {
        const created = await Assignment.create({
          taskId: assignment.taskId,
          personId: assignment.personId,
          date: assignment.date,
          completed: false
        });
        assignments.push(created);
      } catch (error) {
        console.error('Error creando asignación:', error);
      }
    }
    
    return assignments;
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

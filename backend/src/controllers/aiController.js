const geminiService = require('../services/geminiService');
const distributionService = require('../services/distributionService');
const Person = require('../models/Person');
const Task = require('../models/Task');
const Assignment = require('../models/Assignment');

exports.distribute = async (req, res) => {
  try {
    const { startDate, endDate, clear } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Se requieren startDate y endDate'
      });
    }

    // Obtener personas y tareas activas
    const persons = await Person.findAll();
    const tasks = await Task.findAll({ where: { active: true } });

    if (persons.length === 0 || tasks.length === 0) {
      return res.status(400).json({
        error: 'No hay personas o tareas configuradas'
      });
    }

    // Limpiar asignaciones existentes si se solicita
    if (clear) {
      await distributionService.clearAllAssignments();
    }

    // Generar distribución con IA
    const distribution = await geminiService.distributeTasks(
      startDate,
      endDate,
      persons,
      tasks
    );

    // Crear asignaciones en la base de datos
    const assignments = await distributionService.generateAssignments(
      distribution,
      startDate,
      endDate
    );

    res.json({
      message: 'Distribución generada exitosamente',
      distribution,
      assignmentsCreated: assignments.length
    });
  } catch (error) {
    console.error('Error en distribución:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.redistribute = async (req, res) => {
  try {
    console.log('🚀 [REDISTRIBUTE] Iniciando redistribución...');
    console.log('📥 [REDISTRIBUTE] Body recibido:', req.body);

    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      console.log('❌ [REDISTRIBUTE] Faltan fechas');
      return res.status(400).json({
        error: 'Se requieren startDate y endDate'
      });
    }

    console.log(`📅 [REDISTRIBUTE] Período: ${startDate} a ${endDate}`);

    // Limpiar todas las asignaciones
    console.log('🧹 [REDISTRIBUTE] Limpiando asignaciones existentes...');
    await distributionService.clearAllAssignments();
    console.log('✅ [REDISTRIBUTE] Asignaciones limpiadas');

    // Redistribuir
    console.log('👥 [REDISTRIBUTE] Obteniendo personas...');
    const persons = await Person.findAll();
    console.log(`✅ [REDISTRIBUTE] ${persons.length} personas encontradas:`, persons.map(p => p.name));

    console.log('📋 [REDISTRIBUTE] Obteniendo tareas activas...');
    const tasks = await Task.findAll({ where: { active: true } });
    console.log(`✅ [REDISTRIBUTE] ${tasks.length} tareas activas encontradas`);

    if (persons.length === 0) {
      console.log('❌ [REDISTRIBUTE] No hay personas configuradas');
      return res.status(400).json({ error: 'No hay personas configuradas' });
    }

    if (tasks.length === 0) {
      console.log('❌ [REDISTRIBUTE] No hay tareas activas');
      return res.status(400).json({ error: 'No hay tareas activas' });
    }

    console.log('🤖 [REDISTRIBUTE] Llamando a Gemini para distribución...');
    const distribution = await geminiService.distributeTasks(
      startDate,
      endDate,
      persons,
      tasks
    );
    console.log(`✅ [REDISTRIBUTE] Distribución generada con ${distribution.assignments?.length || 0} asignaciones`);

    console.log('💾 [REDISTRIBUTE] Guardando asignaciones en BD...');
    const assignments = await distributionService.generateAssignments(
      distribution,
      startDate,
      endDate
    );
    console.log(`✅ [REDISTRIBUTE] ${assignments.length} asignaciones creadas en BD`);

    console.log('🎉 [REDISTRIBUTE] Redistribución completada exitosamente');
    res.json({
      message: 'Redistribución completada',
      distribution,
      assignmentsCreated: assignments.length
    });
  } catch (error) {
    console.error('❌ [REDISTRIBUTE] Error en redistribución:', error);
    console.error('❌ [REDISTRIBUTE] Stack trace:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.analyzeBalance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Obtener asignaciones del período
    const assignments = await Assignment.findAll({
      where: startDate && endDate ? {
        date: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      } : {},
      include: [
        { model: Task, as: 'task' },
        { model: Person, as: 'person' }
      ]
    });

    const persons = await Person.findAll();

    // Analizar con IA
    const analysis = await geminiService.analyzeBalance(assignments, persons);

    // Obtener balance calculado
    const balance = await distributionService.getBalance(
      startDate || '2025-12-27',
      endDate || '2026-03-31'
    );

    res.json({
      aiAnalysis: analysis,
      calculatedBalance: balance
    });
  } catch (error) {
    console.error('Error en análisis de balance:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.optimize = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      include: [
        { model: Task, as: 'task' },
        { model: Person, as: 'person' }
      ]
    });

    const persons = await Person.findAll();
    const tasks = await Task.findAll({ where: { active: true } });

    // Optimizar con IA
    const optimization = await geminiService.optimizeDistribution(
      assignments,
      persons,
      tasks
    );

    res.json(optimization);
  } catch (error) {
    console.error('Error en optimización:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const balance = await distributionService.getBalance(
      startDate || '2025-12-27',
      endDate || '2026-03-31'
    );

    res.json(balance);
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: error.message });
  }
};

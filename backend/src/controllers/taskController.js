const Task = require('../models/Task');
const distributionService = require('../services/distributionService');

exports.getAll = async (req, res) => {
  try {
    const { active } = req.query;
    const where = {};
    
    if (active !== undefined) {
      where.active = active === 'true';
    }
    
    const tasks = await Task.findAll({
      where,
      order: [['number', 'ASC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Obtener el siguiente número disponible
    const maxTask = await Task.findOne({
      order: [['number', 'DESC']]
    });
    const nextNumber = maxTask ? maxTask.number + 1 : 1;
    
    const task = await Task.create({
      ...req.body,
      number: req.body.number || nextNumber
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    await task.update(req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    // Eliminar todas las asignaciones de esta tarea
    await distributionService.clearTaskAssignments(task.id);
    
    // Eliminar la tarea
    await task.destroy();
    
    res.json({ message: 'Tarea y sus asignaciones eliminadas correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

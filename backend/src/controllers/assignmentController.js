const Assignment = require('../models/Assignment');
const Person = require('../models/Person');
const Task = require('../models/Task');
const { Op } = require('sequelize');
const { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

exports.getAll = async (req, res) => {
  try {
    const { date, personId, completed, limit, offset } = req.query;
    const where = {};
    
    if (date) where.date = date;
    if (personId) where.personId = personId;
    if (completed !== undefined) where.completed = completed === 'true';
    
    const assignments = await Assignment.findAll({
      where,
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ],
      order: [['date', 'ASC']],
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined
    });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const assignments = await Assignment.findAll({
      where: { date },
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ],
      order: [['personId', 'ASC']]
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getWeek = async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });
    
    const assignments = await Assignment.findAll({
      where: {
        date: {
          [Op.between]: [
            format(weekStart, 'yyyy-MM-dd'),
            format(weekEnd, 'yyyy-MM-dd')
          ]
        }
      },
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ],
      order: [['date', 'ASC'], ['personId', 'ASC']]
    });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const monthStart = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const monthEnd = endOfMonth(monthStart);
    
    const assignments = await Assignment.findAll({
      where: {
        date: {
          [Op.between]: [
            format(monthStart, 'yyyy-MM-dd'),
            format(monthEnd, 'yyyy-MM-dd')
          ]
        }
      },
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ],
      order: [['date', 'ASC']]
    });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByPerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const { startDate, endDate } = req.query;
    
    const where = { personId };
    
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    const assignments = await Assignment.findAll({
      where,
      include: [{ model: Task, as: 'task' }],
      order: [['date', 'ASC']]
    });
    
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    const fullAssignment = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ]
    });
    res.status(201).json(fullAssignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }
    await assignment.update(req.body);
    const updated = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ]
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.complete = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }
    
    await assignment.update({
      completed: true,
      completedAt: new Date(),
      timeSpent: req.body.timeSpent || null,
      notes: req.body.notes || null
    });
    
    const updated = await Assignment.findByPk(assignment.id, {
      include: [
        { model: Person, as: 'person' },
        { model: Task, as: 'task' }
      ]
    });
    
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: 'Asignación no encontrada' });
    }
    await assignment.destroy();
    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteByTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const count = await Assignment.destroy({
      where: { taskId }
    });
    res.json({ message: `${count} asignaciones eliminadas correctamente` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Person = require('../models/Person');

exports.getAll = async (req, res) => {
  try {
    const persons = await Person.findAll({
      order: [['name', 'ASC']]
    });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const person = await Person.create(req.body);
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    await person.update(req.body);
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    await person.destroy();
    res.json({ message: 'Persona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmailSettings = async (req, res) => {
  try {
    const person = await Person.findByPk(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    
    await person.update({
      email: req.body.email || person.email,
      emailNotifications: req.body.emailNotifications || person.emailNotifications
    });
    
    res.json(person);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

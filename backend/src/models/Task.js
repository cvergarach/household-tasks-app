const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER, // en minutos
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'cocina',
      'bano',
      'dormitorio',
      'areas_comunes',
      'lavanderia',
      'jardin',
      'terraza',
      'general'
    ),
    allowNull: false
  },
  area: {
    type: DataTypes.STRING
  },
  requiresDaylight: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requiresWeekend: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    validate: {
      min: 1,
      max: 5
    }
  },
  canRotate: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  preferredPersonId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tasks',
  timestamps: true
});

module.exports = Task;

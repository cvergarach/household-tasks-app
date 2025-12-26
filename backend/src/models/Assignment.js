const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Person = require('./Person');
const Task = require('./Task');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  taskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  personId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'persons',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  timeSpent: {
    type: DataTypes.INTEGER, // minutos reales gastados
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'assignments',
  timestamps: true,
  indexes: [
    {
      fields: ['date']
    },
    {
      fields: ['personId']
    },
    {
      fields: ['taskId']
    }
  ]
});

// Relaciones
Assignment.belongsTo(Person, { foreignKey: 'personId', as: 'person' });
Assignment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
Person.hasMany(Assignment, { foreignKey: 'personId', as: 'assignments' });
Task.hasMany(Assignment, { foreignKey: 'taskId', as: 'assignments' });

module.exports = Assignment;

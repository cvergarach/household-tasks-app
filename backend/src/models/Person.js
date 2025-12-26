const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  workSchedule: {
    type: DataTypes.JSON,
    defaultValue: {
      monday: { start: "08:00", end: "19:00", available: false },
      tuesday: { start: "08:00", end: "19:00", available: false },
      wednesday: { start: "08:00", end: "19:00", available: false },
      thursday: { start: "08:00", end: "19:00", available: false },
      friday: { start: "08:00", end: "19:00", available: false },
      saturday: { available: true },
      sunday: { available: true }
    }
  },
  specialConditions: {
    type: DataTypes.JSON,
    defaultValue: {
      limitedUntil: null,
      maxHoursPerWeek: null,
      shiftWork: false,
      fullTimeAvailable: false
    }
  },
  preferences: {
    type: DataTypes.JSON,
    defaultValue: {
      preferredTasks: [],
      avoidTasks: []
    }
  },
  emailNotifications: {
    type: DataTypes.JSON,
    defaultValue: {
      daily: true,
      weekly: true,
      monthly: true,
      time: "07:00"
    }
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#3B82F6'
  }
}, {
  tableName: 'persons',
  timestamps: true
});

module.exports = Person;

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmailConfig = sequelize.define('EmailConfig', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    host: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'SMTP host (e.g., smtp.gmail.com)'
    },
    port: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'SMTP port (e.g., 587 for TLS, 465 for SSL)'
    },
    secure: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'true for 465, false for other ports'
    },
    user: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Email account username'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Email account password or app password'
    },
    from: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Default "from" address'
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether to use this config (override env vars)'
    }
}, {
    tableName: 'email_config',
    timestamps: true
});

module.exports = EmailConfig;

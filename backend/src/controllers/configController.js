const { updateTransporter, getCurrentConfig, createTransporter } = require('../config/email');

// Lazy load EmailConfig to avoid circular dependency issues
function getEmailConfigModel() {
    return require('../models/EmailConfig');
}

// Get email configuration (from DB or env)
exports.getConfig = async (req, res) => {
    try {
        const EmailConfig = getEmailConfigModel();
        // Try to get from database first
        try {
            const dbConfig = await EmailConfig.findOne({
                where: { enabled: true },
                order: [['updatedAt', 'DESC']]
            });

            if (dbConfig) {
                return res.json({
                    source: 'database',
                    config: {
                        host: dbConfig.host,
                        port: dbConfig.port,
                        secure: dbConfig.secure,
                        user: dbConfig.user,
                        from: dbConfig.from,
                        password: dbConfig.password ? '********' : null,
                        enabled: dbConfig.enabled
                    }
                });
            }
        } catch (dbError) {
            // If table doesn't exist or any DB error, fall back to env vars
            console.log('Database config not available, using environment variables');
        }

        // Fall back to environment variables
        const envConfig = getCurrentConfig();
        res.json({
            source: 'environment',
            config: envConfig
        });
    } catch (error) {
        console.error('Error getting email config:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update email configuration
exports.updateConfig = async (req, res) => {
    try {
        const { host, port, secure, user, password, from, enabled } = req.body;

        // Validate required fields
        if (!host || !port || !user || !password) {
            return res.status(400).json({
                error: 'Faltan campos requeridos: host, port, user, password'
            });
        }

        const EmailConfig = getEmailConfigModel();

        try {
            // Save to database
            const [config, created] = await EmailConfig.findOrCreate({
                where: { enabled: true },
                defaults: { host, port, secure, user, password, from: from || user, enabled: enabled !== false }
            });

            if (!created) {
                await config.update({ host, port, secure, user, password, from: from || user, enabled: enabled !== false });
            }
        } catch (dbError) {
            // If table doesn't exist, that's okay - we'll just update the transporter
            console.log('Could not save to database, but will update transporter:', dbError.message);
        }

        // Update the transporter with new configuration
        const newConfig = {
            host,
            port,
            secure: secure || false,
            user,
            password,
            from: from || user
        };

        await updateTransporter(newConfig);

        res.json({
            message: 'Configuración de email actualizada correctamente',
            config: {
                host,
                port,
                secure,
                user,
                from: from || user,
                password: '********'
            }
        });
    } catch (error) {
        console.error('Error updating email config:', error);
        res.status(500).json({ error: error.message });
    }
};

// Test email configuration
exports.testConfig = async (req, res) => {
    try {
        const { host, port, secure, user, password } = req.body;

        if (!host || !port || !user || !password) {
            return res.status(400).json({
                error: 'Faltan campos requeridos para la prueba'
            });
        }

        // Create a temporary transporter for testing
        const testTransporter = createTransporter({
            host,
            port,
            secure: secure || false,
            user,
            password
        });

        // Verify the connection
        await testTransporter.verify();

        res.json({
            success: true,
            message: 'Conexión exitosa al servidor SMTP'
        });
    } catch (error) {
        console.error('Error testing email config:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error al conectar con el servidor SMTP'
        });
    }
};

// Get email presets for common providers
exports.getPresets = (req, res) => {
    const presets = {
        gmail: {
            name: 'Gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            instructions: 'Usa tu email de Gmail y una contraseña de aplicación (App Password). Activa la verificación en 2 pasos primero.'
        },
        outlook: {
            name: 'Outlook / Hotmail',
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            instructions: 'Usa tu email de Outlook/Hotmail y tu contraseña normal.'
        },
        yahoo: {
            name: 'Yahoo',
            host: 'smtp.mail.yahoo.com',
            port: 587,
            secure: false,
            instructions: 'Usa tu email de Yahoo y una contraseña de aplicación.'
        },
        office365: {
            name: 'Office 365',
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            instructions: 'Usa tu email corporativo de Office 365.'
        }
    };

    res.json(presets);
};

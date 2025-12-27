const express = require('express');
const cors = require('cors');
const personRoutes = require('./routes/persons');
const taskRoutes = require('./routes/tasks');
const assignmentRoutes = require('./routes/assignments');
const aiRoutes = require('./routes/ai');
const emailRoutes = require('./routes/emails');
const configRoutes = require('./routes/config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como Postman) en desarrollo
    if (!origin) return callback(null, true);

    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'https://household-tasks-app.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log warning pero permitir de todas formas para evitar errores
      console.warn(`⚠️  CORS: Origen no reconocido: ${origin}`);
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/persons', personRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/config', configRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores
app.use(errorHandler);

module.exports = app;

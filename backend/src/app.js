const express = require('express');
const cors = require('cors');
const personRoutes = require('./routes/persons');
const taskRoutes = require('./routes/tasks');
const assignmentRoutes = require('./routes/assignments');
const aiRoutes = require('./routes/ai');
const emailRoutes = require('./routes/emails');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores
app.use(errorHandler);

module.exports = app;

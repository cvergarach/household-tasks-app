# Backend - Tareas del Hogar con IA

Backend completo para la gestión inteligente de tareas del hogar usando Gemini AI.

## Características

- 🤖 Distribución inteligente de tareas con Gemini AI
- 📧 Notificaciones automáticas por email (diarias, semanales, mensuales)
- 📊 Análisis de balance de carga de trabajo
- ⚡ Optimización automática de asignaciones
- 🗄️ Base de datos PostgreSQL con Sequelize ORM

## Requisitos

- Node.js >= 18.0.0
- PostgreSQL
- Cuenta de Gmail con App Password
- API Key de Google Gemini

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. Configurar PostgreSQL:
- Crear base de datos: `household_tasks`
- Actualizar DATABASE_URL en .env

4. Iniciar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Variables de Entorno

```
PORT=3001
DATABASE_URL=postgresql://usuario:password@localhost:5432/household_tasks
GEMINI_API_KEY=tu_api_key
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Personas
- `GET /api/persons` - Listar personas
- `POST /api/persons` - Crear persona
- `PUT /api/persons/:id` - Actualizar persona
- `DELETE /api/persons/:id` - Eliminar persona

### Tareas
- `GET /api/tasks` - Listar tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Asignaciones
- `GET /api/assignments` - Listar asignaciones
- `GET /api/assignments/date/:date` - Asignaciones del día
- `GET /api/assignments/month/:year/:month` - Asignaciones del mes
- `POST /api/assignments` - Crear asignación
- `PUT /api/assignments/:id/complete` - Marcar como completada

### IA (Gemini)
- `POST /api/ai/distribute` - Distribuir tareas con IA
- `POST /api/ai/redistribute` - Redistribuir todas las tareas
- `GET /api/ai/analyze-balance` - Analizar balance
- `POST /api/ai/optimize` - Optimizar distribución

### Emails
- `POST /api/emails/test` - Enviar email de prueba
- `POST /api/emails/send-daily` - Enviar notificaciones diarias
- `POST /api/emails/send-weekly` - Enviar notificaciones semanales
- `POST /api/emails/send-monthly` - Enviar notificaciones mensuales

## Scheduler

El sistema envía emails automáticamente:
- **Diario**: 7:00 AM (todos los días)
- **Semanal**: 7:00 AM (domingos)
- **Mensual**: 7:00 AM (día 1 de cada mes)

## Despliegue en Render

1. Crear cuenta en Render.com
2. Crear nuevo Web Service
3. Conectar repositorio de GitHub
4. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Agregar PostgreSQL database
6. Configurar variables de entorno
7. Deploy

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/         # Configuración (DB, Gemini, Email)
│   ├── models/         # Modelos de datos (Sequelize)
│   ├── controllers/    # Controladores de rutas
│   ├── services/       # Servicios (IA, Email, Distribución)
│   ├── routes/         # Definición de rutas
│   ├── middleware/     # Middlewares
│   ├── jobs/           # Cron jobs
│   └── app.js         # Aplicación Express
├── server.js          # Punto de entrada
├── package.json
└── .env.example
```

## Licencia

MIT

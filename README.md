# 🏠 Tareas del Hogar - Sistema de Gestión Inteligente con IA

Sistema completo de gestión y distribución equitativa de tareas del hogar utilizando **Gemini AI** para optimización automática.

## 📋 Descripción

Esta aplicación permite a familias distribuir tareas del hogar de forma justa y equitativa, considerando la disponibilidad, horarios de trabajo y preferencias de cada miembro. Utiliza Inteligencia Artificial (Gemini) para generar distribuciones óptimas y envía notificaciones automáticas por email.

## ✨ Características Principales

- 🤖 **Distribución Inteligente con IA**: Gemini AI distribuye las tareas equitativamente
- 📧 **Notificaciones Automáticas**: Emails diarios, semanales y mensuales
- 📊 **Análisis de Balance**: Verifica que todos tengan la misma carga de trabajo
- 📅 **Calendario Completo**: Vista mensual de todas las asignaciones
- ✅ **Seguimiento**: Marca tareas como completadas
- 🎨 **Interfaz Moderna**: Diseño responsive con Tailwind CSS
- 🔄 **Redistribución Flexible**: Reorganiza tareas cuando cambien las circunstancias

## 🏗️ Arquitectura

```
household-tasks-app/
├── backend/          # Node.js + Express + PostgreSQL + Gemini AI
└── frontend/         # Next.js + React + Tailwind CSS
```

### Backend
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL con Sequelize ORM
- **IA**: Google Gemini API
- **Emails**: Nodemailer
- **Cron Jobs**: node-cron para notificaciones automáticas
- **Deploy**: Render.com

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS
- **Iconos**: Lucide React
- **Deploy**: Vercel

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js >= 18.0.0
- PostgreSQL
- Cuenta de Gmail (para emails)
- API Key de Google Gemini

### Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd household-tasks-app
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

3. **Configurar Frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
# Editar .env.local
npm run dev
```

4. **Abrir en el navegador**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## ⚙️ Configuración

### Variables de Entorno - Backend

```env
# Servidor
PORT=3001
DATABASE_URL=postgresql://usuario:password@localhost:5432/household_tasks

# Gemini AI
GEMINI_API_KEY=tu_api_key_de_gemini

# Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM="Tareas del Hogar <tu_email@gmail.com>"

# CORS
FRONTEND_URL=http://localhost:3000
```

### Variables de Entorno - Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📱 Uso de la Aplicación

### 1. Vista Diaria
- Ver tareas del día actual
- Marcar tareas como completadas
- Eliminar tareas específicas o permanentemente
- Navegar entre días

### 2. Calendario
- Vista mensual completa
- Resumen de tareas por día
- Total de horas por día

### 3. Configuración

#### Tareas Maestras
- 90 tareas predefinidas para el hogar
- Crear, editar y eliminar tareas
- Categorías: cocina, baños, dormitorios, jardín, etc.

#### Personas
- Gestionar miembros de la familia (5 personas por defecto)
- Configurar horarios de trabajo
- Establecer condiciones especiales

#### Notificaciones Email
- Configurar emails por persona
- Activar/desactivar notificaciones:
  - Diarias (7:00 AM)
  - Semanales (Domingos 7:00 AM)
  - Mensuales (Día 1, 7:00 AM)
- Enviar emails de prueba

#### IA & Distribución
- **Redistribuir con IA**: Gemini redistribuye todas las tareas
- **Analizar Balance**: Verifica equidad de la distribución
- **Ver Estadísticas**: Horas por persona, balance general

## 🤖 Cómo Funciona la IA

1. **Análisis**: Gemini recibe información de personas (horarios, disponibilidad) y tareas
2. **Optimización**: Calcula la distribución más equitativa
3. **Asignación**: Genera asignaciones considerando:
   - Horarios de trabajo
   - Disponibilidad de cada persona
   - Rotación justa de tareas
   - Balance de tiempo total

4. **Resultados**: Retorna asignaciones con explicación del razonamiento

## 📧 Sistema de Notificaciones

### Automáticas
- **Diarias**: Cada día a las 7:00 AM con tareas del día
- **Semanales**: Domingos a las 7:00 AM con plan de la semana
- **Mensuales**: Día 1 de cada mes con estadísticas y resumen

### Contenido de Emails
- Diseño HTML profesional
- Lista de tareas con tiempos
- Total de horas
- Colores personalizados por persona

## 🗄️ Modelos de Datos

### Person (Persona)
- Información básica (nombre, email)
- Horarios de trabajo
- Condiciones especiales
- Preferencias de notificaciones
- Color asignado

### Task (Tarea Maestra)
- Nombre y descripción
- Duración en minutos
- Frecuencia (diaria/semanal/mensual)
- Categoría y área
- Requisitos especiales

### Assignment (Asignación)
- Relación tarea-persona-fecha
- Estado de completitud
- Tiempo real invertido
- Notas

## 🌐 API Endpoints

### Personas
- `GET /api/persons` - Listar
- `POST /api/persons` - Crear
- `PUT /api/persons/:id` - Actualizar
- `DELETE /api/persons/:id` - Eliminar

### Tareas
- `GET /api/tasks` - Listar
- `POST /api/tasks` - Crear
- `DELETE /api/tasks/:id` - Eliminar (+ todas sus asignaciones)

### Asignaciones
- `GET /api/assignments/date/:date` - Por día
- `GET /api/assignments/month/:year/:month` - Por mes
- `PUT /api/assignments/:id/complete` - Marcar completada
- `DELETE /api/assignments/:id` - Eliminar

### IA
- `POST /api/ai/distribute` - Distribuir con IA
- `POST /api/ai/redistribute` - Redistribuir todo
- `GET /api/ai/analyze-balance` - Analizar balance

### Emails
- `POST /api/emails/test` - Email de prueba
- `POST /api/emails/send-daily` - Enviar diarios
- `POST /api/emails/send-weekly` - Enviar semanales

## 🚀 Despliegue

### Backend en Render
1. Crear Web Service
2. Conectar repositorio GitHub
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Agregar PostgreSQL database
6. Configurar variables de entorno

### Frontend en Vercel
1. Importar repositorio
2. Framework: Next.js
3. Build Command: `npm run build`
4. Configurar `NEXT_PUBLIC_API_URL`

## 👥 Configuración de Familia (Ejemplo)

La aplicación está configurada para una familia de 5:
- **Cesar** (papá): Trabajo L-V 8-19h
- **Ximena** (mamá): Trabajo L-V 8-19h
- **Karla**: Disponible tiempo completo
- **Felipe**: Estudiante (tesis hasta 31/12)
- **Stefania**: Turnos rotativos KFC

## 📊 90 Tareas Incluidas

- Cocina: 17 tareas (diarias, semanales, mensuales)
- Baños: 13 tareas
- Dormitorios: 17 tareas
- Áreas Comunes: 14 tareas
- Lavandería: 9 tareas
- Jardín: 7 tareas
- Terraza: 4 tareas
- General: 9 tareas

## 🔧 Desarrollo

### Backend
```bash
cd backend
npm run dev  # Puerto 3001
```

### Frontend
```bash
cd frontend
npm run dev  # Puerto 3000
```

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para problemas o preguntas, abre un issue en GitHub.

---

**Desarrollado con ❤️ usando Gemini AI**

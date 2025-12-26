# 🚀 GUÍA COMPLETA DE DESPLIEGUE
## Aplicación de Tareas del Hogar con IA

---

## 📦 CONTENIDO DEL ZIP

```
household-tasks-app/
├── backend/          # API Node.js + Express + Gemini AI
├── frontend/         # Next.js + React
└── README.md         # Documentación principal
```

---

## 🎯 PASO 1: PREPARACIÓN INICIAL

### A) Crear cuenta en Render (Backend)
1. Ir a https://render.com
2. Registrarse con GitHub
3. Verificar email

### B) Crear cuenta en Vercel (Frontend)
1. Ir a https://vercel.com
2. Registrarse con GitHub
3. Conectar cuenta de GitHub

### C) Obtener credenciales necesarias

#### Google Gemini API Key
1. Ir a https://ai.google.dev/
2. Click en "Get API Key"
3. Crear un proyecto nuevo
4. Copiar la API Key generada

#### Gmail App Password (para emails)
1. Ir a https://myaccount.google.com/security
2. Activar verificación en 2 pasos
3. Buscar "Contraseñas de aplicaciones"
4. Generar nueva contraseña para "Correo"
5. Copiar la contraseña de 16 caracteres

---

## 🗄️ PASO 2: CONFIGURAR BASE DE DATOS

### Opción 1: PostgreSQL en Render (RECOMENDADO)
1. En Render Dashboard, click "New +"
2. Seleccionar "PostgreSQL"
3. Nombre: `household-tasks-db`
4. Database: `household_tasks`
5. User: `household_tasks_user`
6. Region: Oregon (más cercana a Chile)
7. Click "Create Database"
8. **COPIAR** el "External Database URL" (lo necesitarás después)

### Opción 2: PostgreSQL Local (solo desarrollo)
```bash
# Instalar PostgreSQL
# En Ubuntu/Debian:
sudo apt-get install postgresql

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE household_tasks;
CREATE USER household_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE household_tasks TO household_user;
\q
```

---

## 🔧 PASO 3: SUBIR A GITHUB

### A) Descomprimir el ZIP
```bash
unzip household-tasks-app.zip
cd household-tasks-app
```

### B) Inicializar Git
```bash
git init
git add .
git commit -m "Initial commit - Household Tasks App"
```

### C) Crear repositorio en GitHub
1. Ir a https://github.com
2. Click "New repository"
3. Nombre: `household-tasks-app`
4. Visibilidad: Privado (recomendado)
5. NO marcar "Initialize with README"
6. Click "Create repository"

### D) Subir código
```bash
git remote add origin https://github.com/TU-USUARIO/household-tasks-app.git
git branch -M main
git push -u origin main
```

---

## 🚀 PASO 4: DESPLEGAR BACKEND EN RENDER

### A) Crear Web Service
1. En Render Dashboard: "New +" → "Web Service"
2. Conectar tu repositorio `household-tasks-app`
3. Configuración:
   - **Name**: `household-tasks-backend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### B) Variables de Entorno
Click en "Environment" y agregar:

```
PORT=3001
NODE_ENV=production

# PostgreSQL URL (copiar desde tu base de datos en Render)
DATABASE_URL=postgresql://usuario:password@host/database

# Gemini AI (tu API Key)
GEMINI_API_KEY=tu_gemini_api_key_aqui

# Email Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_de_16_caracteres
EMAIL_FROM="Tareas del Hogar <tu_email@gmail.com>"

# CORS (lo configuraremos después)
FRONTEND_URL=https://tu-app.vercel.app

# Timezone
TZ=America/Santiago
```

### C) Deploy
1. Click "Create Web Service"
2. Esperar a que termine el deploy (~5 minutos)
3. **COPIAR** la URL generada (ejemplo: `https://household-tasks-backend.onrender.com`)

### D) Inicializar Datos
1. En Render, ir a tu servicio → "Shell"
2. Ejecutar:
```bash
node scripts/init-data.js
```
Esto creará:
- 5 personas (Cesar, Ximena, Karla, Felipe, Stefania)
- 90 tareas predefinidas

---

## 🎨 PASO 5: DESPLEGAR FRONTEND EN VERCEL

### A) Importar Proyecto
1. En Vercel Dashboard: "Add New..." → "Project"
2. Seleccionar tu repositorio `household-tasks-app`
3. Configuración:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### B) Variables de Entorno
Agregar:
```
NEXT_PUBLIC_API_URL=https://household-tasks-backend.onrender.com
```
(Usar la URL del backend que copiaste antes)

### C) Deploy
1. Click "Deploy"
2. Esperar ~3 minutos
3. **COPIAR** la URL generada (ejemplo: `https://household-tasks-app.vercel.app`)

### D) Actualizar Backend
1. Volver a Render → tu backend
2. Ir a "Environment"
3. Actualizar `FRONTEND_URL` con la URL de Vercel
4. Guardar cambios
5. Render re-desplegará automáticamente

---

## ✅ PASO 6: VERIFICACIÓN

### A) Probar el Backend
Abrir en navegador: `https://tu-backend.onrender.com/health`

Deberías ver:
```json
{
  "status": "OK",
  "timestamp": "2025-12-26T..."
}
```

### B) Probar el Frontend
1. Abrir: `https://tu-app.vercel.app`
2. Deberías ver la interfaz de la app
3. Ir a "Ajustes" → pestaña "Personas"
4. Verificar que aparecen las 5 personas

### C) Generar Distribución con IA
1. En "Ajustes" → pestaña "IA & Distribución"
2. Click "Redistribuir TODO con IA"
3. Confirmar
4. Esperar ~30 segundos
5. Ir a "Diario" o "Calendario"
6. Verificar que hay tareas asignadas

### D) Probar Emails
1. En "Ajustes" → pestaña "Notificaciones"
2. Para cualquier persona, click "Enviar Prueba"
3. Revisar el email en la bandeja de entrada

---

## 🔒 PASO 7: CONFIGURACIÓN FINAL

### A) Configurar Emails de tu Familia
1. En "Ajustes" → "Personas"
2. Editar el email de cada persona con el email real
3. Guardar cambios

### B) Ajustar Horarios
Si los horarios de tu familia son diferentes:
1. Editar `backend/scripts/init-data.js`
2. Modificar los objetos `workSchedule` de cada persona
3. Ejecutar nuevamente en Render Shell:
```bash
node scripts/init-data.js
```

### C) Personalizar Tareas
Puedes:
- Agregar nuevas tareas desde la UI
- Eliminar tareas que no apliquen
- Modificar tiempos y frecuencias

---

## 📧 PASO 8: NOTIFICACIONES AUTOMÁTICAS

El sistema enviará emails automáticamente:
- **Diarios**: 7:00 AM (cada día)
- **Semanales**: 7:00 AM (domingos)
- **Mensuales**: 7:00 AM (día 1)

No requiere configuración adicional. Los cron jobs se ejecutan automáticamente en el servidor.

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Backend no inicia
1. Revisar logs en Render: Servicio → "Logs"
2. Verificar que DATABASE_URL es correcto
3. Verificar que todas las variables de entorno están configuradas

### Frontend muestra error de conexión
1. Verificar que `NEXT_PUBLIC_API_URL` apunta al backend correcto
2. Verificar que el backend está funcionando (health check)
3. Re-desplegar frontend en Vercel

### Emails no se envían
1. Verificar EMAIL_PASSWORD (debe ser App Password, no tu contraseña normal)
2. Verificar en Gmail que "Acceso de apps menos seguras" está permitido
3. Revisar logs del backend

### IA no distribuye tareas
1. Verificar GEMINI_API_KEY en variables de entorno
2. Verificar que tienes cuota disponible en Google AI
3. Revisar logs del backend para errores

### Base de datos se resetea
Render Free tier puede dormir la BD después de inactividad. Considera:
1. Upgrade a plan pago ($7/mes)
2. Hacer ping periódico al backend
3. Usar PostgreSQL externo (Supabase, Neon)

---

## 💰 COSTOS

### Gratis (Forever)
- ✅ Vercel (Frontend): Gratis
- ✅ Render Free Tier (Backend): Gratis
- ✅ Render PostgreSQL Free: Gratis (90 días)
- ✅ Google Gemini API: Gratis hasta cierto límite
- ✅ Gmail: Gratis

### Upgrades Opcionales
- Render PostgreSQL: $7/mes (después de 90 días)
- Render Backend (no sleep): $7/mes
- Dominio personalizado: ~$12/año

**Total mínimo**: $0/mes por 3 meses, luego ~$7-14/mes

---

## 📞 SOPORTE

### Documentación Oficial
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Gemini AI: https://ai.google.dev/docs

### Problemas Comunes
Ver archivo README.md en el proyecto

---

## 🎉 ¡LISTO!

Tu aplicación de Tareas del Hogar con IA está funcionando.

**URLs importantes:**
- Frontend: https://tu-app.vercel.app
- Backend: https://tu-backend.onrender.com
- Database: (panel de Render)

**Credenciales a guardar:**
- DATABASE_URL
- GEMINI_API_KEY
- EMAIL_PASSWORD

---

**Desarrollado con ❤️ para tu familia**

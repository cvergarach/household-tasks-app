# ⚡ Configuración Rápida de Vercel (2 minutos)

## 🎯 Problema
Tu frontend en Vercel no puede ver los datos porque no está conectado al backend de Render.

## ✅ Solución (Paso a Paso)

### 1️⃣ Ir a Vercel
1. Abre: **https://vercel.com/login**
2. Inicia sesión con tu cuenta

### 2️⃣ Seleccionar tu Proyecto
1. En el dashboard, busca tu proyecto (probablemente se llama `household-tasks-app` o similar)
2. **Click en el proyecto**

### 3️⃣ Ir a Settings
1. En la parte superior, click en **"Settings"**

### 4️⃣ Configurar Variable de Entorno
1. En el menú izquierdo, click en **"Environment Variables"**
2. Verás un formulario para agregar variables
3. Completa:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://household-tasks-app.onrender.com`
   - **Environments**: Marca ✅ **Production**, **Preview**, y **Development**
4. Click en **"Save"** o **"Add"**

### 5️⃣ Redesplegar
1. Ve a la pestaña **"Deployments"** (arriba)
2. Encuentra el deployment más reciente (el primero de la lista)
3. Click en los **3 puntos (...)** a la derecha
4. Click en **"Redeploy"**
5. Confirma
6. Espera ~2 minutos

### 6️⃣ Verificar
1. Abre tu URL de Vercel (ejemplo: `https://tu-app.vercel.app`)
2. Ve a **"Settings"** → **"Personas"**
3. Deberías ver: ✅ Cesar, Ximena, Karla, Felipe, Nia
4. Ve a **"Settings"** → **"Tareas Maestras"**
5. Deberías ver: ✅ 84 tareas

## 📊 Estado Actual

✅ **Backend (Render)**: Funcionando
✅ **Base de Datos**: Poblada con 5 personas y 84 tareas
⚠️ **Frontend (Vercel)**: Necesita variable de entorno
❌ **Conexión**: No configurada

## 🎉 Después de Configurar

Podrás:
- ✅ Ver todas las personas y tareas
- ✅ Crear/editar/eliminar desde la UI
- ✅ Usar IA para distribuir tareas
- ✅ Ver calendario y tareas diarias
- ✅ Recibir notificaciones por email

---

**¿Necesitas ayuda?** Avísame en qué paso te quedaste.

# Configurar Gemini API Key en Render

## ⚠️ Error Actual
```
API key not valid. Please pass a valid API key.
```

## Solución (3 minutos)

### Paso 1: Verificar/Crear API Key Correcta

1. **Ve a Google AI Studio:**
   - Abre: https://aistudio.google.com/app/apikey
   - Inicia sesión con tu cuenta de Google

2. **Verifica que la API esté habilitada:**
   - Si ves un mensaje de "Enable API", haz click en él
   - Espera a que se habilite (~30 segundos)

3. **Crear nueva API Key:**
   - Click en **"Create API Key"**
   - Selecciona **"Create API key in new project"** (o usa un proyecto existente)
   - **IMPORTANTE**: Copia la key COMPLETA (empieza con `AIza...`)
   - Tiene ~39 caracteres
   - No debe tener espacios al inicio ni al final

### Paso 2: Actualizar en Render

1. Ve a: https://dashboard.render.com
2. Abre tu servicio `household-tasks-app`
3. Ve a **"Environment"** (menú izquierdo)
4. Busca la variable `GEMINI_API_KEY`
5. **Si existe:**
   - Click en el ícono de editar (lápiz)
   - Borra el valor actual
   - Pega la nueva API key (sin espacios)
   - Click "Save Changes"
6. **Si NO existe:**
   - Click "Add Environment Variable"
   - Key: `GEMINI_API_KEY`
   - Value: (pega tu API key)
   - Click "Save Changes"

### Paso 3: Verificar que se guardó correctamente

- La variable debe aparecer en la lista
- El valor debe estar oculto (por seguridad)
- Render debe mostrar "Deploying..." automáticamente

### Paso 4: Esperar Redespliegue

- Espera 2-3 minutos
- En la pestaña "Logs" verás:
  - ✅ `Servidor corriendo en puerto 3001`
  - ✅ `Entorno: production`
  - ❌ NO debe aparecer: `API key not valid`

### Paso 5: Probar

1. Abre: https://household-tasks-app.vercel.app
2. Ve a **Settings** → **IA & Distribución**
3. Click **"Redistribuir TODO con IA"**
4. Confirma
5. Espera ~30 segundos
6. Si funciona, verás un mensaje de éxito
7. Ve a **"Diario"** para ver las asignaciones

## ✅ Verificación

Si funciona correctamente, en los logs de Render NO verás errores de API key y la distribución se completará exitosamente.

## 🔍 Troubleshooting

### Si sigue sin funcionar:

1. **Verifica que la API key:**
   - Empiece con `AIza`
   - Tenga ~39 caracteres
   - No tenga espacios ni saltos de línea

2. **Verifica en Google Cloud Console:**
   - Ve a: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Asegúrate que "Generative Language API" esté **ENABLED**

3. **Crea una nueva API key:**
   - A veces las keys tienen restricciones
   - Crea una nueva sin restricciones

4. **Verifica los logs de Render:**
   - Debe decir "Servidor corriendo" sin errores de API key

---

**Una vez configurado correctamente, la IA distribuirá las 84 tareas automáticamente.**

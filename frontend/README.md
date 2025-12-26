# Frontend - Tareas del Hogar

Aplicación web moderna con Next.js para la gestión inteligente de tareas del hogar.

## Características

- 📅 Vista diaria de tareas
- 📆 Calendario mensual
- ⚙️ Configuración completa (tareas, personas, emails)
- 🤖 Distribución inteligente con Gemini AI
- 📧 Gestión de notificaciones por email
- 📊 Análisis de balance de carga
- 🎨 Interfaz moderna con Tailwind CSS
- 📱 Diseño responsive

## Requisitos

- Node.js >= 18.0.0
- Backend corriendo (ver carpeta backend)

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.local.example .env.local
# Editar .env.local
```

3. Iniciar en desarrollo:
```bash
npm run dev
```

4. Abrir http://localhost:3000

## Variables de Entorno

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Para producción:
```
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

## Estructura

```
frontend/
├── app/
│   ├── page.tsx              # Vista diaria (home)
│   ├── calendar/
│   │   └── page.tsx          # Vista calendario
│   ├── settings/
│   │   └── page.tsx          # Configuración
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globales
├── lib/
│   └── api.ts                # Cliente de API
├── types/
│   └── index.ts              # Tipos TypeScript
├── public/                   # Archivos estáticos
└── package.json
```

## Páginas

### Vista Diaria (/)
- Muestra las tareas del día actual
- Permite marcar tareas como completadas
- Eliminar tarea solo del día o de todo el calendario
- Navegación entre días

### Calendario (/calendar)
- Vista mensual de todas las tareas
- Resumen de tareas por día
- Navegación entre meses

### Ajustes (/settings)
Cuatro pestañas principales:

1. **Tareas Maestras**
   - Lista de las 90 tareas
   - Crear, editar y eliminar tareas
   - Ver detalles (tiempo, frecuencia, categoría)

2. **Personas**
   - Gestión de miembros de la familia
   - Visualización de colores asignados
   - Información de contacto

3. **Notificaciones**
   - Configurar emails por persona
   - Activar/desactivar notificaciones diarias, semanales, mensuales
   - Enviar emails de prueba

4. **IA & Distribución**
   - Redistribuir todas las tareas con IA
   - Analizar balance de carga
   - Ver estadísticas de distribución

## Despliegue en Vercel

1. Crear cuenta en Vercel.com
2. Importar repositorio de GitHub
3. Framework Preset: Next.js
4. Agregar variable de entorno:
   - `NEXT_PUBLIC_API_URL`: URL del backend
5. Deploy

## Desarrollo

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Lint
npm run lint
```

## Integración con Backend

El frontend se comunica con el backend a través de la API REST.
Asegúrate de que el backend esté corriendo antes de usar la aplicación.

## Licencia

MIT

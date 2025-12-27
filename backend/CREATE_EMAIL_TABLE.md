# Crear Tabla email_config en Render

## Problema
La tabla `email_config` no existe en la base de datos de producción, causando errores cuando intentas configurar el email desde la UI.

## Solución

### Opción 1: Ejecutar Script de Migración (Recomendado)

1. **Desde tu máquina local**, ejecuta:
```bash
cd backend
DATABASE_URL="tu_database_url_de_render" node scripts/create-email-config-table.js
```

2. Obtén el `DATABASE_URL` de Render:
   - Ve a tu servicio en Render
   - Click en "PostgreSQL" en el sidebar
   - Copia la "Internal Database URL"

### Opción 2: Desde Render Shell

1. Ve a tu servicio en Render
2. Click en "Shell" en el menú superior
3. Ejecuta:
```bash
node scripts/create-email-config-table.js
```

### Opción 3: Forzar Sync en el Próximo Deploy

Temporalmente cambia en `server.js`:
```javascript
// De esto:
await sequelize.sync({ alter: true });

// A esto (solo por un deploy):
await sequelize.sync({ force: false, alter: true });
```

Luego haz commit y push. Una vez que la tabla se cree, revierte el cambio.

## Verificación

Después de crear la tabla, deberías poder:
1. Ir a Settings → Notificaciones
2. Click en "Configurar Email"
3. Llenar el formulario
4. Guardar la configuración
5. La configuración se guardará en la base de datos

## Nota
Una vez que la tabla exista, la configuración de email se guardará en la base de datos y tendrá prioridad sobre las variables de entorno.

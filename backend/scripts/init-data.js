require('dotenv').config();
const path = require('path');
const { sequelize } = require(path.join(__dirname, '..', 'src', 'config', 'database'));
const Person = require(path.join(__dirname, '..', 'src', 'models', 'Person'));
const Task = require(path.join(__dirname, '..', 'src', 'models', 'Task'));

// Configuración de la familia
const PERSONS = [
  {
    name: 'Cesar',
    email: 'cesar@email.com',
    color: '#3B82F6',
    workSchedule: {
      monday: { start: "08:00", end: "19:00", available: false },
      tuesday: { start: "08:00", end: "19:00", available: false },
      wednesday: { start: "08:00", end: "19:00", available: false },
      thursday: { start: "08:00", end: "19:00", available: false },
      friday: { start: "08:00", end: "19:00", available: false },
      saturday: { available: true },
      sunday: { available: true }
    },
    specialConditions: {
      limitedUntil: null,
      maxHoursPerWeek: null,
      shiftWork: false,
      fullTimeAvailable: false
    }
  },
  {
    name: 'Ximena',
    email: 'ximena@email.com',
    color: '#EC4899',
    workSchedule: {
      monday: { start: "08:00", end: "19:00", available: false },
      tuesday: { start: "08:00", end: "19:00", available: false },
      wednesday: { start: "08:00", end: "19:00", available: false },
      thursday: { start: "08:00", end: "19:00", available: false },
      friday: { start: "08:00", end: "19:00", available: false },
      saturday: { available: true },
      sunday: { available: true }
    },
    specialConditions: {
      limitedUntil: null,
      maxHoursPerWeek: null,
      shiftWork: false,
      fullTimeAvailable: false
    }
  },
  {
    name: 'Karla',
    email: 'karla@email.com',
    color: '#10B981',
    workSchedule: {
      monday: { available: true },
      tuesday: { available: true },
      wednesday: { available: true },
      thursday: { available: true },
      friday: { available: true },
      saturday: { available: true },
      sunday: { available: true }
    },
    specialConditions: {
      limitedUntil: null,
      maxHoursPerWeek: null,
      shiftWork: false,
      fullTimeAvailable: true
    }
  },
  {
    name: 'Felipe',
    email: 'felipe@email.com',
    color: '#F59E0B',
    workSchedule: {
      monday: { available: true },
      tuesday: { available: true },
      wednesday: { available: true },
      thursday: { available: true },
      friday: { available: true },
      saturday: { available: true },
      sunday: { available: true }
    },
    specialConditions: {
      limitedUntil: null,
      maxHoursPerWeek: null,
      shiftWork: false,
      fullTimeAvailable: false
    }
  },
  {
    name: 'Nia',
    email: 'nia@email.com',
    color: '#8B5CF6',
    workSchedule: {
      monday: { available: true },
      tuesday: { available: true },
      wednesday: { available: true },
      thursday: { available: true },
      friday: { available: true },
      saturday: { available: true },
      sunday: { available: true }
    },
    specialConditions: {
      limitedUntil: null,
      maxHoursPerWeek: null,
      shiftWork: true,
      fullTimeAvailable: false
    }
  }
];

// Tareas para casa de 2 pisos con dormitorios de Cesar/Ximena, Felipe, Karla, Nia
const TASKS = [
  // COCINA (Diarias) 1-9
  { number: 1, name: "Preparar desayuno", duration: 30, frequency: "daily", category: "cocina", area: "Cocina", priority: 4 },
  { number: 2, name: "Preparar almuerzo", duration: 45, frequency: "daily", category: "cocina", area: "Cocina", priority: 5 },
  { number: 3, name: "Preparar cena", duration: 45, frequency: "daily", category: "cocina", area: "Cocina", priority: 5 },
  { number: 4, name: "Lavar platos después del desayuno", duration: 15, frequency: "daily", category: "cocina", area: "Cocina", priority: 3 },
  { number: 5, name: "Lavar platos después del almuerzo", duration: 20, frequency: "daily", category: "cocina", area: "Cocina", priority: 3 },
  { number: 6, name: "Lavar platos después de la cena", duration: 20, frequency: "daily", category: "cocina", area: "Cocina", priority: 3 },
  { number: 7, name: "Limpiar mesón de cocina", duration: 10, frequency: "daily", category: "cocina", area: "Cocina", priority: 3 },
  { number: 8, name: "Barrer piso de cocina", duration: 10, frequency: "daily", category: "cocina", area: "Cocina", priority: 2 },
  { number: 9, name: "Sacar basura de cocina", duration: 5, frequency: "daily", category: "cocina", area: "Cocina", priority: 3 },

  // COCINA (Semanales) 10-14
  { number: 10, name: "Limpiar refrigerador por dentro", duration: 30, frequency: "weekly", category: "cocina", area: "Cocina", priority: 2 },
  { number: 11, name: "Limpiar horno/estufa a fondo", duration: 25, frequency: "weekly", category: "cocina", area: "Cocina", priority: 2 },
  { number: 12, name: "Trapear piso de cocina", duration: 15, frequency: "weekly", category: "cocina", area: "Cocina", priority: 3 },
  { number: 13, name: "Limpiar microondas", duration: 10, frequency: "weekly", category: "cocina", area: "Cocina", priority: 2 },
  { number: 14, name: "Organizar despensa", duration: 20, frequency: "weekly", category: "cocina", area: "Cocina", priority: 2 },

  // COCINA (Mensuales) 15-17
  { number: 15, name: "Limpiar campana extractora", duration: 20, frequency: "monthly", category: "cocina", area: "Cocina", priority: 2 },
  { number: 16, name: "Limpiar gabinetes por fuera", duration: 30, frequency: "monthly", category: "cocina", area: "Cocina", priority: 2 },
  { number: 17, name: "Descalcificar hervidor/cafetera", duration: 15, frequency: "monthly", category: "cocina", area: "Cocina", priority: 1 },

  // BAÑOS (Diarias) 18-19
  { number: 18, name: "Limpiar lavamanos baño piso 1", duration: 5, frequency: "daily", category: "bano", area: "Baño Piso 1", priority: 3 },
  { number: 19, name: "Limpiar lavamanos baño piso 2", duration: 5, frequency: "daily", category: "bano", area: "Baño Piso 2", priority: 3 },

  // BAÑOS (Semanales) 20-27
  { number: 20, name: "Limpiar WC baño piso 1", duration: 15, frequency: "weekly", category: "bano", area: "Baño Piso 1", priority: 4 },
  { number: 21, name: "Limpiar WC baño piso 2", duration: 15, frequency: "weekly", category: "bano", area: "Baño Piso 2", priority: 4 },
  { number: 22, name: "Limpiar ducha/tina baño piso 1", duration: 20, frequency: "weekly", category: "bano", area: "Baño Piso 1", priority: 3 },
  { number: 23, name: "Limpiar ducha/tina baño piso 2", duration: 20, frequency: "weekly", category: "bano", area: "Baño Piso 2", priority: 3 },
  { number: 24, name: "Trapear piso baño piso 1", duration: 10, frequency: "weekly", category: "bano", area: "Baño Piso 1", priority: 3 },
  { number: 25, name: "Trapear piso baño piso 2", duration: 10, frequency: "weekly", category: "bano", area: "Baño Piso 2", priority: 3 },
  { number: 26, name: "Limpiar espejos baño piso 1", duration: 5, frequency: "weekly", category: "bano", area: "Baño Piso 1", priority: 2 },
  { number: 27, name: "Limpiar espejos baño piso 2", duration: 5, frequency: "weekly", category: "bano", area: "Baño Piso 2", priority: 2 },

  // BAÑOS (Mensuales) 28-30
  { number: 28, name: "Limpiar azulejos baño piso 1", duration: 25, frequency: "monthly", category: "bano", area: "Baño Piso 1", priority: 2 },
  { number: 29, name: "Limpiar azulejos baño piso 2", duration: 25, frequency: "monthly", category: "bano", area: "Baño Piso 2", priority: 2 },
  { number: 30, name: "Destapar desagües", duration: 20, frequency: "monthly", category: "bano", area: "Baños", priority: 2 },

  // DORMITORIOS (Diarias) 31-35 - Ajustado para 4 dormitorios
  { number: 31, name: "Tender cama dormitorio Cesar y Ximena", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio Principal", priority: 2 },
  { number: 32, name: "Tender cama dormitorio Felipe", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio Felipe", priority: 2 },
  { number: 33, name: "Tender cama dormitorio Karla", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio Karla", priority: 2 },
  { number: 34, name: "Tender cama dormitorio Nia", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio Nia", priority: 2 },
  { number: 35, name: "Ventilar habitaciones", duration: 5, frequency: "daily", category: "dormitorio", area: "Dormitorios", priority: 2 },
  { number: 36, name: "Ordenar ropa y objetos personales", duration: 10, frequency: "daily", category: "dormitorio", area: "Dormitorios", priority: 2 },

  // DORMITORIOS (Semanales) 37-48
  { number: 37, name: "Aspirar/barrer dormitorio Cesar y Ximena", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Principal", priority: 3 },
  { number: 38, name: "Aspirar/barrer dormitorio Felipe", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Felipe", priority: 3 },
  { number: 39, name: "Aspirar/barrer dormitorio Karla", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Karla", priority: 3 },
  { number: 40, name: "Aspirar/barrer dormitorio Nia", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Nia", priority: 3 },
  { number: 41, name: "Sacudir muebles dormitorios", duration: 15, frequency: "weekly", category: "dormitorio", area: "Dormitorios", priority: 2 },
  { number: 42, name: "Cambiar sábanas cama Cesar y Ximena", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Principal", priority: 3 },
  { number: 43, name: "Cambiar sábanas cama Felipe", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Felipe", priority: 3 },
  { number: 44, name: "Cambiar sábanas cama Karla", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Karla", priority: 3 },
  { number: 45, name: "Cambiar sábanas cama Nia", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio Nia", priority: 3 },

  // ÁREAS COMUNES (Diarias) 46-50
  { number: 46, name: "Barrer sala de estar", duration: 10, frequency: "daily", category: "areas_comunes", area: "Sala de Estar", priority: 3 },
  { number: 47, name: "Barrer comedor diario", duration: 10, frequency: "daily", category: "areas_comunes", area: "Comedor Diario", priority: 3 },
  { number: 48, name: "Ordenar sala de estar", duration: 10, frequency: "daily", category: "areas_comunes", area: "Sala de Estar", priority: 3 },
  { number: 49, name: "Ordenar comedor diario", duration: 5, frequency: "daily", category: "areas_comunes", area: "Comedor Diario", priority: 2 },

  // ÁREAS COMUNES (Semanales) 50-56
  { number: 50, name: "Aspirar/trapear sala de estar", duration: 20, frequency: "weekly", category: "areas_comunes", area: "Sala de Estar", priority: 3 },
  { number: 51, name: "Trapear comedor diario", duration: 15, frequency: "weekly", category: "areas_comunes", area: "Comedor Diario", priority: 3 },
  { number: 52, name: "Limpiar muebles sala", duration: 20, frequency: "weekly", category: "areas_comunes", area: "Sala de Estar", priority: 2 },
  { number: 53, name: "Sacudir polvo estanterías", duration: 15, frequency: "weekly", category: "areas_comunes", area: "General", priority: 2 },
  { number: 54, name: "Barrer/aspirar escaleras", duration: 15, frequency: "weekly", category: "areas_comunes", area: "Escaleras", priority: 3 },
  { number: 55, name: "Limpiar ventanas piso 1", duration: 30, frequency: "weekly", category: "areas_comunes", area: "Piso 1", priority: 2 },
  { number: 56, name: "Limpiar ventanas piso 2", duration: 30, frequency: "weekly", category: "areas_comunes", area: "Piso 2", priority: 2 },

  // ÁREAS COMUNES (Mensuales) 57-59
  { number: 57, name: "Limpiar cortinas/persianas", duration: 40, frequency: "monthly", category: "areas_comunes", area: "General", priority: 2 },
  { number: 58, name: "Limpiar zócalos", duration: 30, frequency: "monthly", category: "areas_comunes", area: "General", priority: 1 },
  { number: 59, name: "Limpiar lámparas y ventiladores", duration: 25, frequency: "monthly", category: "areas_comunes", area: "General", priority: 2 },

  // LAVANDERÍA (Semanales) 60-65
  { number: 60, name: "Lavar ropa blanca", duration: 40, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 4 },
  { number: 61, name: "Lavar ropa de color", duration: 40, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 4 },
  { number: 62, name: "Lavar ropa delicada", duration: 30, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 3 },
  { number: 63, name: "Tender ropa", duration: 15, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 4 },
  { number: 64, name: "Planchar ropa", duration: 60, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 3, requiresWeekend: true },
  { number: 65, name: "Doblar y guardar ropa", duration: 30, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 3 },

  // LAVANDERÍA (Mensuales) 66-68
  { number: 66, name: "Lavar cortinas", duration: 45, frequency: "monthly", category: "lavanderia", area: "Lavandería", priority: 2 },
  { number: 67, name: "Lavar fundas de almohadas/cojines", duration: 30, frequency: "monthly", category: "lavanderia", area: "Lavandería", priority: 2 },
  { number: 68, name: "Limpiar lavadora", duration: 20, frequency: "monthly", category: "lavanderia", area: "Lavandería", priority: 2 },

  // PATIO (Semanales) 69-72
  { number: 69, name: "Barrer patio", duration: 20, frequency: "weekly", category: "jardin", area: "Patio", priority: 3, requiresDaylight: true },
  { number: 70, name: "Regar plantas del patio", duration: 15, frequency: "weekly", category: "jardin", area: "Patio", priority: 3, requiresDaylight: true },
  { number: 71, name: "Limpiar patio a fondo", duration: 30, frequency: "weekly", category: "jardin", area: "Patio", priority: 2, requiresDaylight: true },

  // PATIO (Mensuales) 72-73
  { number: 72, name: "Limpiar herramientas de jardín", duration: 15, frequency: "monthly", category: "jardin", area: "Patio", priority: 1 },

  // TERRAZA (Semanales) 73-74
  { number: 73, name: "Barrer terraza", duration: 15, frequency: "weekly", category: "terraza", area: "Terraza", priority: 2 },
  { number: 74, name: "Limpiar barandas terraza", duration: 15, frequency: "weekly", category: "terraza", area: "Terraza", priority: 2 },

  // TERRAZA (Mensuales) 75-76
  { number: 75, name: "Trapear terraza", duration: 25, frequency: "monthly", category: "terraza", area: "Terraza", priority: 2 },
  { number: 76, name: "Limpiar mobiliario terraza", duration: 30, frequency: "monthly", category: "terraza", area: "Terraza", priority: 2 },

  // GENERAL (Diarias) 77-78
  { number: 77, name: "Sacar basura general", duration: 5, frequency: "daily", category: "general", area: "General", priority: 4 },
  { number: 78, name: "Alimentar mascotas", duration: 10, frequency: "daily", category: "general", area: "General", priority: 5 },

  // GENERAL (Semanales) 79-81
  { number: 79, name: "Compras de supermercado", duration: 90, frequency: "weekly", category: "general", area: "General", priority: 5, requiresWeekend: true },
  { number: 80, name: "Revisar y reponer productos de limpieza", duration: 15, frequency: "weekly", category: "general", area: "General", priority: 2 },
  { number: 81, name: "Organizar despensa general", duration: 20, frequency: "weekly", category: "general", area: "General", priority: 2 },

  // GENERAL (Mensuales) 82-84
  { number: 82, name: "Pagar cuentas/servicios", duration: 20, frequency: "monthly", category: "general", area: "General", priority: 5 },
  { number: 83, name: "Revisar y cambiar bolsas de aspiradora", duration: 10, frequency: "monthly", category: "general", area: "General", priority: 1 },
  { number: 84, name: "Mantenimiento general", duration: 30, frequency: "monthly", category: "general", area: "General", priority: 3 }
];

async function initializeData() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa');

    console.log('\n🔄 Sincronizando modelos...');
    await sequelize.sync({ force: true }); // WARNING: Esto borra todos los datos existentes
    console.log('✅ Modelos sincronizados');

    console.log('\n👥 Creando personas...');
    for (const personData of PERSONS) {
      await Person.create(personData);
      console.log(`✅ Persona creada: ${personData.name}`);
    }

    console.log('\n📋 Creando tareas...');
    for (const taskData of TASKS) {
      await Task.create(taskData);
      if (taskData.number % 10 === 0) {
        console.log(`✅ ${taskData.number} tareas creadas...`);
      }
    }

    console.log('\n✅ ¡Inicialización completada!');
    console.log(`   - ${PERSONS.length} personas creadas`);
    console.log(`   - ${TASKS.length} tareas creadas`);
    console.log('\n📝 Configuración de la familia:');
    console.log('   - Cesar y Ximena: Trabajo L-V 8-19h');
    console.log('   - Karla: Disponible tiempo completo');
    console.log('   - Felipe: Estudiando');
    console.log('   - Nia: Trabajo en turnos');
    console.log('\n🏠 Configuración de la casa:');
    console.log('   - 2 pisos, 2 baños');
    console.log('   - 4 dormitorios: Principal (Cesar/Ximena), Felipe, Karla, Nia');
    console.log('   - Sala de estar, comedor diario, cocina');
    console.log('   - Terraza y patio');
    console.log('\n🤖 Próximo paso: Usa la API /api/ai/distribute para generar las asignaciones con IA');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    process.exit(1);
  }
}

initializeData();

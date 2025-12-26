require('dotenv').config();
const { sequelize } = require('./src/config/database');
const Person = require('./src/models/Person');
const Task = require('./src/models/Task');

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
      limitedUntil: "2025-12-31",
      maxHoursPerWeek: 15,
      shiftWork: false,
      fullTimeAvailable: false
    }
  },
  {
    name: 'Stefania',
    email: 'stefania@email.com',
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
  { number: 18, name: "Limpiar lavamanos baño piso 1", duration: 5, frequency: "daily", category: "bano", area: "Baño 1", priority: 3 },
  { number: 19, name: "Limpiar lavamanos baño piso 2", duration: 5, frequency: "daily", category: "bano", area: "Baño 2", priority: 3 },
  
  // BAÑOS (Semanales) 20-27
  { number: 20, name: "Limpiar WC baño piso 1", duration: 15, frequency: "weekly", category: "bano", area: "Baño 1", priority: 4 },
  { number: 21, name: "Limpiar WC baño piso 2", duration: 15, frequency: "weekly", category: "bano", area: "Baño 2", priority: 4 },
  { number: 22, name: "Limpiar ducha/tina baño piso 1", duration: 20, frequency: "weekly", category: "bano", area: "Baño 1", priority: 3 },
  { number: 23, name: "Limpiar ducha/tina baño piso 2", duration: 20, frequency: "weekly", category: "bano", area: "Baño 2", priority: 3 },
  { number: 24, name: "Trapear piso baño piso 1", duration: 10, frequency: "weekly", category: "bano", area: "Baño 1", priority: 3 },
  { number: 25, name: "Trapear piso baño piso 2", duration: 10, frequency: "weekly", category: "bano", area: "Baño 2", priority: 3 },
  { number: 26, name: "Limpiar espejos baño piso 1", duration: 5, frequency: "weekly", category: "bano", area: "Baño 1", priority: 2 },
  { number: 27, name: "Limpiar espejos baño piso 2", duration: 5, frequency: "weekly", category: "bano", area: "Baño 2", priority: 2 },
  
  // BAÑOS (Mensuales) 28-30
  { number: 28, name: "Limpiar azulejos baño piso 1", duration: 25, frequency: "monthly", category: "bano", area: "Baño 1", priority: 2 },
  { number: 29, name: "Limpiar azulejos baño piso 2", duration: 25, frequency: "monthly", category: "bano", area: "Baño 2", priority: 2 },
  { number: 30, name: "Destapar desagües", duration: 20, frequency: "monthly", category: "bano", area: "Baños", priority: 2 },
  
  // DORMITORIOS (Diarias) 31-37
  { number: 31, name: "Tender cama dormitorio 1", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio 1", priority: 2 },
  { number: 32, name: "Tender cama dormitorio 2", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio 2", priority: 2 },
  { number: 33, name: "Tender cama dormitorio 3", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio 3", priority: 2 },
  { number: 34, name: "Tender cama dormitorio 4", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio 4", priority: 2 },
  { number: 35, name: "Tender cama dormitorio 5", duration: 3, frequency: "daily", category: "dormitorio", area: "Dormitorio 5", priority: 2 },
  { number: 36, name: "Ventilar habitaciones", duration: 5, frequency: "daily", category: "dormitorio", area: "Dormitorios", priority: 2 },
  { number: 37, name: "Ordenar ropa y objetos personales", duration: 10, frequency: "daily", category: "dormitorio", area: "Dormitorios", priority: 2 },
  
  // DORMITORIOS (Semanales) 38-48
  { number: 38, name: "Aspirar/barrer dormitorio 1", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 1", priority: 3 },
  { number: 39, name: "Aspirar/barrer dormitorio 2", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 2", priority: 3 },
  { number: 40, name: "Aspirar/barrer dormitorio 3", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 3", priority: 3 },
  { number: 41, name: "Aspirar/barrer dormitorio 4", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 4", priority: 3 },
  { number: 42, name: "Aspirar/barrer dormitorio 5", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 5", priority: 3 },
  { number: 43, name: "Sacudir muebles dormitorios", duration: 15, frequency: "weekly", category: "dormitorio", area: "Dormitorios", priority: 2 },
  { number: 44, name: "Cambiar sábanas cama 1", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 1", priority: 3 },
  { number: 45, name: "Cambiar sábanas cama 2", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 2", priority: 3 },
  { number: 46, name: "Cambiar sábanas cama 3", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 3", priority: 3 },
  { number: 47, name: "Cambiar sábanas cama 4", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 4", priority: 3 },
  { number: 48, name: "Cambiar sábanas cama 5", duration: 10, frequency: "weekly", category: "dormitorio", area: "Dormitorio 5", priority: 3 },
  
  // ÁREAS COMUNES (Diarias) 49-52
  { number: 49, name: "Barrer sala de estar", duration: 10, frequency: "daily", category: "areas_comunes", area: "Sala", priority: 3 },
  { number: 50, name: "Barrer comedor", duration: 10, frequency: "daily", category: "areas_comunes", area: "Comedor", priority: 3 },
  { number: 51, name: "Ordenar sala de estar", duration: 10, frequency: "daily", category: "areas_comunes", area: "Sala", priority: 3 },
  { number: 52, name: "Ordenar comedor", duration: 5, frequency: "daily", category: "areas_comunes", area: "Comedor", priority: 2 },
  
  // ÁREAS COMUNES (Semanales) 53-59
  { number: 53, name: "Aspirar/trapear sala de estar", duration: 20, frequency: "weekly", category: "areas_comunes", area: "Sala", priority: 3 },
  { number: 54, name: "Trapear comedor", duration: 15, frequency: "weekly", category: "areas_comunes", area: "Comedor", priority: 3 },
  { number: 55, name: "Limpiar muebles sala", duration: 20, frequency: "weekly", category: "areas_comunes", area: "Sala", priority: 2 },
  { number: 56, name: "Sacudir polvo estanterías", duration: 15, frequency: "weekly", category: "areas_comunes", area: "General", priority: 2 },
  { number: 57, name: "Barrer/aspirar escaleras", duration: 15, frequency: "weekly", category: "areas_comunes", area: "Escaleras", priority: 3 },
  { number: 58, name: "Limpiar ventanas piso 1", duration: 30, frequency: "weekly", category: "areas_comunes", area: "Piso 1", priority: 2 },
  { number: 59, name: "Limpiar ventanas piso 2", duration: 30, frequency: "weekly", category: "areas_comunes", area: "Piso 2", priority: 2 },
  
  // ÁREAS COMUNES (Mensuales) 60-62
  { number: 60, name: "Limpiar cortinas/persianas", duration: 40, frequency: "monthly", category: "areas_comunes", area: "General", priority: 2 },
  { number: 61, name: "Limpiar zócalos", duration: 30, frequency: "monthly", category: "areas_comunes", area: "General", priority: 1 },
  { number: 62, name: "Limpiar lámparas y ventiladores", duration: 25, frequency: "monthly", category: "areas_comunes", area: "General", priority: 2 },
  
  // LAVANDERÍA (Semanales) 63-68
  { number: 63, name: "Lavar ropa blanca", duration: 40, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 4 },
  { number: 64, name: "Lavar ropa de color", duration: 40, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 4 },
  { number: 65, name: "Lavar ropa delicada", duration: 30, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 3 },
  { number: 66, name: "Tender ropa", duration: 15, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 4 },
  { number: 67, name: "Planchar ropa", duration: 60, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 3, requiresWeekend: true },
  { number: 68, name: "Doblar y guardar ropa", duration: 30, frequency: "weekly", category: "lavanderia", area: "Lavandería", priority: 3 },
  
  // LAVANDERÍA (Mensuales) 69-71
  { number: 69, name: "Lavar cortinas", duration: 45, frequency: "monthly", category: "lavanderia", area: "Lavandería", priority: 2 },
  { number: 70, name: "Lavar fundas de almohadas/cojines", duration: 30, frequency: "monthly", category: "lavanderia", area: "Lavandería", priority: 2 },
  { number: 71, name: "Limpiar lavadora", duration: 20, frequency: "monthly", category: "lavanderia", area: "Lavandería", priority: 2 },
  
  // JARDÍN (Semanales) 72-75
  { number: 72, name: "Cortar el pasto", duration: 45, frequency: "weekly", category: "jardin", area: "Jardín", priority: 3, requiresDaylight: true },
  { number: 73, name: "Regar plantas", duration: 20, frequency: "weekly", category: "jardin", area: "Jardín", priority: 3, requiresDaylight: true },
  { number: 74, name: "Barrer hojas del jardín", duration: 20, frequency: "weekly", category: "jardin", area: "Jardín", priority: 2, requiresDaylight: true },
  { number: 75, name: "Quitar maleza", duration: 30, frequency: "weekly", category: "jardin", area: "Jardín", priority: 2, requiresDaylight: true },
  
  // JARDÍN (Mensuales) 76-78
  { number: 76, name: "Podar arbustos", duration: 40, frequency: "monthly", category: "jardin", area: "Jardín", priority: 2, requiresDaylight: true },
  { number: 77, name: "Abonar plantas", duration: 25, frequency: "monthly", category: "jardin", area: "Jardín", priority: 2, requiresDaylight: true },
  { number: 78, name: "Limpiar herramientas de jardín", duration: 15, frequency: "monthly", category: "jardin", area: "Jardín", priority: 1 },
  
  // TERRAZA (Semanales) 79-80
  { number: 79, name: "Barrer terraza", duration: 15, frequency: "weekly", category: "terraza", area: "Terraza", priority: 2 },
  { number: 80, name: "Limpiar barandas", duration: 15, frequency: "weekly", category: "terraza", area: "Terraza", priority: 2 },
  
  // TERRAZA (Mensuales) 81-82
  { number: 81, name: "Trapear terraza", duration: 25, frequency: "monthly", category: "terraza", area: "Terraza", priority: 2 },
  { number: 82, name: "Limpiar mobiliario exterior", duration: 30, frequency: "monthly", category: "terraza", area: "Terraza", priority: 2 },
  
  // GENERAL (Diarias) 83-84
  { number: 83, name: "Sacar basura general", duration: 5, frequency: "daily", category: "general", area: "General", priority: 4 },
  { number: 84, name: "Alimentar mascotas", duration: 10, frequency: "daily", category: "general", area: "General", priority: 5 },
  
  // GENERAL (Semanales) 85-87
  { number: 85, name: "Compras de supermercado", duration: 90, frequency: "weekly", category: "general", area: "General", priority: 5, requiresWeekend: true },
  { number: 86, name: "Revisar y reponer productos de limpieza", duration: 15, frequency: "weekly", category: "general", area: "General", priority: 2 },
  { number: 87, name: "Organizar despensa general", duration: 20, frequency: "weekly", category: "general", area: "General", priority: 2 },
  
  // GENERAL (Mensuales) 88-90
  { number: 88, name: "Pagar cuentas/servicios", duration: 20, frequency: "monthly", category: "general", area: "General", priority: 5 },
  { number: 89, name: "Revisar y cambiar bolsas de aspiradora", duration: 10, frequency: "monthly", category: "general", area: "General", priority: 1 },
  { number: 90, name: "Mantenimiento general", duration: 30, frequency: "monthly", category: "general", area: "General", priority: 3 }
];

async function initializeData() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    
    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force: true }); // WARNING: Esto borra todos los datos
    
    console.log('👥 Creando personas...');
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
    console.log('\n📝 Ahora puedes usar la API /api/ai/distribute para generar las asignaciones con IA');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la inicialización:', error);
    process.exit(1);
  }
}

initializeData();

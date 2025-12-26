const { model } = require('../config/gemini');
const { addDays, format, eachDayOfInterval } = require('date-fns');

class GeminiService {
  /**
   * Distribuir tareas usando IA de Gemini
   */
  async distributeTasks(startDate, endDate, persons, tasks) {
    try {
      const prompt = this.buildDistributionPrompt(startDate, endDate, persons, tasks);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extraer JSON del texto (eliminar markdown si existe)
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const distribution = JSON.parse(jsonText);
      
      return distribution;
    } catch (error) {
      console.error('Error en distribución con Gemini:', error);
      throw new Error('Error al generar distribución con IA');
    }
  }

  /**
   * Analizar balance de carga actual
   */
  async analyzeBalance(assignments, persons) {
    try {
      const prompt = this.buildBalanceAnalysisPrompt(assignments, persons);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const analysis = JSON.parse(jsonText);
      
      return analysis;
    } catch (error) {
      console.error('Error en análisis de balance:', error);
      throw new Error('Error al analizar balance con IA');
    }
  }

  /**
   * Optimizar distribución actual
   */
  async optimizeDistribution(assignments, persons, tasks) {
    try {
      const prompt = this.buildOptimizationPrompt(assignments, persons, tasks);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const optimization = JSON.parse(jsonText);
      
      return optimization;
    } catch (error) {
      console.error('Error en optimización:', error);
      throw new Error('Error al optimizar con IA');
    }
  }

  /**
   * Construir prompt para distribución inicial
   */
  buildDistributionPrompt(startDate, endDate, persons, tasks) {
    const dateRange = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
    
    return `Eres un asistente experto en distribución equitativa de tareas del hogar.

PERSONAS:
${JSON.stringify(persons, null, 2)}

TAREAS MAESTRAS:
${JSON.stringify(tasks, null, 2)}

PERÍODO: ${format(new Date(startDate), 'dd/MM/yyyy')} hasta ${format(new Date(endDate), 'dd/MM/yyyy')}
Total de días: ${dateRange.length}

REGLAS CRÍTICAS:
1. Cada persona debe tener aproximadamente el MISMO TIEMPO TOTAL de tareas por semana (±2 horas máximo de diferencia)
2. Respetar horarios de trabajo y disponibilidad de cada persona
3. Tareas de cocina (preparar comidas) deben rotar equitativamente entre todos
4. Quien cocina NO lava platos después de esa comida
5. Tareas de dormitorios preferentemente al usuario de ese dormitorio
6. Tareas de jardín requieren luz del día (horario diurno o fines de semana)
7. Tareas pesadas (lavandería, compras) distribuir en fines de semana para personas que trabajan
8. Considerar condiciones especiales (ej: Felipe máximo 15h/semana hasta el 31/12)

FRECUENCIAS:
- Tareas "daily": Asignar TODOS los días del período
- Tareas "weekly": Asignar 1 vez por semana (mismo día cada semana si es posible)
- Tareas "monthly": Asignar 1 vez por mes (mismo día si es posible)

RETORNA UN JSON con este formato EXACTO:
{
  "assignments": [
    {
      "taskId": "uuid-de-tarea",
      "personId": "uuid-de-persona",
      "date": "YYYY-MM-DD",
      "reasoning": "Breve razón de esta asignación"
    }
  ],
  "statistics": {
    "person-uuid-1": {
      "totalHoursWeek": 10.5,
      "totalHoursMonth": 42,
      "totalHoursPeriod": 126,
      "tasksPerDay": 3.2
    }
  },
  "balance": {
    "isBalanced": true,
    "maxDifference": 1.5,
    "recommendations": ["Sugerencia 1", "Sugerencia 2"]
  }
}

IMPORTANTE: Retorna SOLO el JSON, sin texto adicional antes o después.`;
  }

  /**
   * Construir prompt para análisis de balance
   */
  buildBalanceAnalysisPrompt(assignments, persons) {
    return `Analiza el balance de carga de trabajo en las siguientes asignaciones de tareas:

PERSONAS:
${JSON.stringify(persons, null, 2)}

ASIGNACIONES ACTUALES:
${JSON.stringify(assignments.slice(0, 100), null, 2)}
${assignments.length > 100 ? `... y ${assignments.length - 100} asignaciones más` : ''}

Analiza:
1. ¿Es equitativo el tiempo asignado a cada persona?
2. ¿Hay personas sobrecargadas o con muy pocas tareas?
3. ¿Se respetan los horarios y disponibilidades?
4. ¿La rotación de tareas es justa?

RETORNA UN JSON:
{
  "isBalanced": boolean,
  "statistics": {
    "person-uuid": {
      "totalHours": number,
      "averageHoursPerDay": number,
      "taskCount": number
    }
  },
  "maxDifference": number,
  "recommendations": ["string"],
  "issues": ["string"],
  "score": number (0-100)
}`;
  }

  /**
   * Construir prompt para optimización
   */
  buildOptimizationPrompt(assignments, persons, tasks) {
    return `Optimiza la distribución actual de tareas manteniendo la estructura base pero mejorando el balance:

PERSONAS:
${JSON.stringify(persons, null, 2)}

TAREAS:
${JSON.stringify(tasks, null, 2)}

ASIGNACIONES ACTUALES:
${JSON.stringify(assignments.slice(0, 100), null, 2)}

Sugiere cambios específicos para:
1. Balancear mejor la carga de trabajo
2. Mejorar la rotación de tareas
3. Optimizar según disponibilidades

RETORNA UN JSON:
{
  "changes": [
    {
      "assignmentId": "uuid",
      "from": "person-uuid",
      "to": "person-uuid",
      "reason": "string"
    }
  ],
  "expectedImprovement": {
    "balanceScore": number,
    "description": "string"
  }
}`;
  }
}

module.exports = new GeminiService();

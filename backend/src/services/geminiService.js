const { addDays, format, eachDayOfInterval } = require('date-fns');

class GeminiService {
  /**
   * Distribuir tareas usando IA de Gemini
   */
  async distributeTasks(startDate, endDate, persons, tasks, modelId = 'gemini-2.5-flash') {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🤖 [GEMINI] Intento ${attempt}/${maxRetries} con modelo ${modelId}...`);

        const prompt = this.buildDistributionPrompt(startDate, endDate, persons, tasks);

        // Get the appropriate model
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');
        const model = genAI.getGenerativeModel({ model: modelId });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`📝 [GEMINI] Respuesta (primeros 200 chars): ${text.substring(0, 200)}...`);

        // Extraer JSON del texto de forma más robusta
        let jsonText = text.trim();

        // Remover bloques de código markdown
        jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        // Buscar el primer { y el último }
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');

        if (firstBrace !== -1 && lastBrace !== -1) {
          jsonText = jsonText.substring(firstBrace, lastBrace + 1);
        }

        // Intentar arreglar JSON común errors
        jsonText = this.fixCommonJsonErrors(jsonText);

        const distribution = JSON.parse(jsonText);

        console.log(`✅ JSON parseado exitosamente en intento ${attempt}`);
        return distribution;
      } catch (error) {
        lastError = error;
        console.error(`❌ Error en intento ${attempt}:`, error.message);

        if (attempt < maxRetries) {
          const waitTime = attempt * 2000; // Esperar más tiempo en cada intento
          console.log(`⏳ Esperando ${waitTime}ms antes del siguiente intento...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    console.error('Error en distribución con Gemini después de todos los intentos:', lastError);
    throw new Error(`Error al generar distribución con IA después de ${maxRetries} intentos: ${lastError.message}`);
  }

  /**
   * Intentar arreglar errores comunes de JSON
   */
  fixCommonJsonErrors(jsonText) {
    console.log(`🔧 Intentando arreglar JSON (longitud: ${jsonText.length})...`);

    // Log del JSON completo para debugging
    if (jsonText.length < 2000) {
      console.log('📄 JSON completo:', jsonText);
    } else {
      console.log('📄 JSON (primeros 1000 chars):', jsonText.substring(0, 1000));
      console.log('📄 JSON (últimos 500 chars):', jsonText.substring(jsonText.length - 500));
    }

    // Remover comas finales antes de } o ]
    jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');

    // Asegurar que las comillas sean dobles
    jsonText = jsonText.replace(/'/g, '"');

    // Arreglar saltos de línea dentro de strings
    jsonText = jsonText.replace(/"\s*\n\s*"/g, '" "');

    // Remover caracteres de control
    jsonText = jsonText.replace(/[\x00-\x1F\x7F]/g, '');

    console.log('✅ JSON después de arreglos (primeros 500 chars):', jsonText.substring(0, 500));

    return jsonText;
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

    // Simplificar: solo pedir las primeras 2 semanas para reducir complejidad
    const limitedDays = Math.min(dateRange.length, 14);

    return `Distribuye tareas del hogar de forma equitativa.

PERSONAS (${persons.length}):
${persons.map(p => `- ${p.name} (ID: ${p.id}): ${p.workSchedule ? 'Trabaja L-V' : 'Disponible'}`).join('\n')}

TAREAS (${tasks.length}):
${tasks.slice(0, 20).map(t => `- ${t.name} (ID: ${t.id}): ${t.duration}min, ${t.frequency}`).join('\n')}
... y ${tasks.length - 20} tareas más

PERÍODO: ${limitedDays} días desde ${format(new Date(startDate), 'dd/MM/yyyy')}

REGLAS:
1. Distribuir equitativamente entre todas las personas
2. Tareas diarias: asignar cada día
3. Tareas semanales: asignar 1-2 veces por semana
4. Tareas mensuales: asignar 1 vez

FORMATO DE RESPUESTA (JSON puro, sin markdown):
{
  "assignments": [
    {"taskId": "id-tarea", "personId": "id-persona", "date": "2025-12-26"}
  ]
}

IMPORTANTE: Retorna SOLO el objeto JSON, sin texto adicional.`;
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
    1. ¿Es equitativo el tiempo asignado a cada persona ?
      2. ¿Hay personas sobrecargadas o con muy pocas tareas ?
        3. ¿Se respetan los horarios y disponibilidades ?
          4. ¿La rotación de tareas es justa ?

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
            "score": number(0 - 100)
    } `;
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
    } `;
  }
}

module.exports = new GeminiService();

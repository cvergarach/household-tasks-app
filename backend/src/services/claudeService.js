const Anthropic = require('@anthropic-ai/sdk');
const { addDays, format, eachDayOfInterval } = require('date-fns');

class ClaudeService {
    constructor() {
        this.client = null;
        this.initializeClient();
    }

    initializeClient() {
        const apiKey = process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            console.warn('⚠️  ADVERTENCIA: ANTHROPIC_API_KEY no está configurada');
            return;
        }

        this.client = new Anthropic({
            apiKey: apiKey
        });

        console.log('✅ Cliente de Claude inicializado');
    }

    /**
     * Distribuir tareas usando Claude
     */
    async distributeTasks(startDate, endDate, persons, tasks, modelId = 'claude-3-5-sonnet-20241022') {
        if (!this.client) {
            throw new Error('Claude API no está configurada. Configura ANTHROPIC_API_KEY en las variables de entorno.');
        }

        const maxRetries = 3;
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🤖 [CLAUDE] Intento ${attempt}/${maxRetries} con modelo ${modelId}...`);

                const prompt = this.buildDistributionPrompt(startDate, endDate, persons, tasks);

                const message = await this.client.messages.create({
                    model: modelId,
                    max_tokens: 8192,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                });

                const responseText = message.content[0].text;
                console.log(`📝 [CLAUDE] Respuesta (primeros 200 chars): ${responseText.substring(0, 200)}...`);

                // Extraer JSON del texto
                let jsonText = responseText.trim();

                // Remover bloques de código markdown
                jsonText = jsonText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

                // Buscar el primer { y el último }
                const firstBrace = jsonText.indexOf('{');
                const lastBrace = jsonText.lastIndexOf('}');

                if (firstBrace !== -1 && lastBrace !== -1) {
                    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
                }

                // Arreglar errores comunes de JSON
                jsonText = this.fixCommonJsonErrors(jsonText);

                const distribution = JSON.parse(jsonText);

                console.log(`✅ [CLAUDE] JSON parseado exitosamente en intento ${attempt}`);
                return distribution;
            } catch (error) {
                lastError = error;
                console.error(`❌ [CLAUDE] Error en intento ${attempt}:`, error.message);

                if (attempt < maxRetries) {
                    const waitTime = attempt * 2000;
                    console.log(`⏳ [CLAUDE] Esperando ${waitTime}ms antes del siguiente intento...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        console.error('[CLAUDE] Error después de todos los intentos:', lastError);
        throw new Error(`Error al generar distribución con Claude después de ${maxRetries} intentos: ${lastError.message}`);
    }

    /**
     * Arreglar errores comunes de JSON y manejar truncamiento
     */
    fixCommonJsonErrors(jsonText) {
        console.log(`🔧 [CLAUDE] Analizando JSON (longitud: ${jsonText.length})...`);

        // Si el JSON está truncado (no termina con }), intentar cerrarlo
        if (!jsonText.trim().endsWith('}')) {
            console.log('⚠️ [CLAUDE] JSON parece truncado, intentando recuperar...');

            // 1. Encontrar el último objeto completo ( termina con } )
            // Intentamos encontrar el último } que esté seguido de un espacio, coma, o final de linea
            // para evitar encontrar un } que sea parte de un string.
            let lastClosingBrace = jsonText.lastIndexOf('}');

            if (lastClosingBrace !== -1) {
                // Truncamos justo después del último objeto completo
                jsonText = jsonText.substring(0, lastClosingBrace + 1);

                // Si justo antes había una coma, la quitamos para que el array sea válido al cerrarlo
                jsonText = jsonText.replace(/,\s*$/, '');

                // Contar balance de estructuras
                const openBracks = (jsonText.match(/\[/g) || []).length;
                const closeBracks = (jsonText.match(/\]/g) || []).length;
                const openBraces = (jsonText.match(/{/g) || []).length;
                const closeBraces = (jsonText.match(/}/g) || []).length;

                // Cerrar en orden inverso
                if (openBracks > closeBracks) jsonText += ']';
                if (openBraces > closeBraces) jsonText += '}';

                console.log('✅ [CLAUDE] JSON cerrado/reparado exitosamente');
            }
        }

        // Limpieza estándar después de reparar estructura
        jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1'); // Remover comas finales
        jsonText = jsonText.replace(/'/g, '"');            // Asegurar comillas dobles
        jsonText = jsonText.replace(/[\x00-\x1F\x7F]/g, ''); // Remover caracteres de control invisibles

        return jsonText;
    }

    /**
     * Construir prompt para distribución
     */
    buildDistributionPrompt(startDate, endDate, persons, tasks) {
        const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd');
        const formattedEndDate = format(new Date(endDate), 'yyyy-MM-dd');

        return `Actúa como un experto en organización del hogar. Tu tarea es distribuir las tareas domésticas de forma equitativa y lógica.

PERSONAS (${persons.length}):
${persons.map(p => `- ${p.name} (ID: ${p.id}): ${p.workSchedule ? 'Trabaja Jornada Completa L-V (menos tiempo disponible)' : 'Disponibilidad completa'}`).join('\n')}

TAREAS ACTIVAS (${tasks.length}):
${tasks.map(t => `- ${t.name} (ID: ${t.id}): ${t.duration} min, Frecuencia: ${t.frequency}`).join('\n')}

PERÍODO A PLANIFICAR:
Desde: ${formattedStartDate}
Hasta: ${formattedEndDate}

REGLAS CRÍTICAS:
1. BALANCE: El tiempo total semanal debe ser similar para todas las personas.
2. PRIORIDAD: Las tareas diarias son obligatorias cada día.
3. FRECUENCIA: 
   - 'daily': Asignar TODOS los días del periodo.
   - 'weekly': Asignar 1-2 veces por semana (separadas por 3-4 días).
   - 'monthly': Asignar 1 vez en el periodo.
4. FORMATO DE FECHA: Usa estrictamente YYYY-MM-DD.
5. NO REPETIR: No asignes la misma tarea a la misma persona el mismo día.

FORMATO DE RESPUESTA (JSON PURO):
{
  "assignments": [
    {"taskId": "${tasks[0]?.id || 'uuid'}", "personId": "${persons[0]?.id || 'uuid'}", "date": "${formattedStartDate}"}
  ]
}

IMPORTANTE: 
- Genera todas las asignaciones necesarias para cubrir el período solicitado.
- Retorna ÚNICAMENTE el JSON. Sin introducciones ni explicaciones.`;
    }
}

module.exports = new ClaudeService();

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
     * Arreglar errores comunes de JSON
     */
    fixCommonJsonErrors(jsonText) {
        console.log(`🔧 [CLAUDE] Arreglando JSON (longitud: ${jsonText.length})...`);

        // Remover comas finales
        jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');

        // Asegurar comillas dobles
        jsonText = jsonText.replace(/'/g, '"');

        // Arreglar saltos de línea
        jsonText = jsonText.replace(/"\s*\n\s*"/g, '" "');

        // Remover caracteres de control
        jsonText = jsonText.replace(/[\x00-\x1F\x7F]/g, '');

        // Si el JSON está truncado (no termina con }), intentar cerrarlo
        if (!jsonText.trim().endsWith('}')) {
            console.log('⚠️ [CLAUDE] JSON parece truncado, intentando cerrar...');

            // Buscar el último objeto completo
            const lastCompleteObject = jsonText.lastIndexOf('}');
            if (lastCompleteObject !== -1) {
                // Truncar hasta el último objeto completo
                jsonText = jsonText.substring(0, lastCompleteObject + 1);

                // Contar llaves abiertas vs cerradas
                const openBraces = (jsonText.match(/{/g) || []).length;
                const closeBraces = (jsonText.match(/}/g) || []).length;
                const openBrackets = (jsonText.match(/\[/g) || []).length;
                const closeBrackets = (jsonText.match(/\]/g) || []).length;

                // Cerrar arrays abiertos
                for (let i = 0; i < (openBrackets - closeBrackets); i++) {
                    jsonText += ']';
                }

                // Cerrar objetos abiertos
                for (let i = 0; i < (openBraces - closeBraces); i++) {
                    jsonText += '}';
                }

                console.log('✅ [CLAUDE] JSON cerrado automáticamente');
            }
        }

        return jsonText;
    }

    /**
     * Construir prompt para distribución
     */
    buildDistributionPrompt(startDate, endDate, persons, tasks) {
        const dateRange = eachDayOfInterval({ start: new Date(startDate), end: new Date(endDate) });
        const limitedDays = Math.min(dateRange.length, 14);

        return `Distribuye tareas del hogar de forma equitativa.

PERSONAS (${persons.length}):
${persons.map(p => `- ${p.name} (ID: ${p.id}): ${p.workSchedule ? 'Trabaja L-V' : 'Disponible'}`).join('\n')}

TAREAS (${tasks.length}):
${tasks.slice(0, 20).map(t => `- ${t.name} (ID: ${t.id}): ${t.duration}min, ${t.frequency}`).join('\n')}
${tasks.length > 20 ? `... y ${tasks.length - 20} tareas más` : ''}

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
}

module.exports = new ClaudeService();

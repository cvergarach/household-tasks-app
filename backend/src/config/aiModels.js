// Available AI models configuration
const AI_MODELS = {
    // Claude models (Anthropic)
    'claude-sonnet-4.5': {
        id: 'claude-sonnet-4.5',
        name: 'Claude Sonnet 4.5',
        provider: 'anthropic',
        apiModel: 'claude-sonnet-4-5-20250929',
        description: 'El modelo más inteligente del 2025',
        capabilities: ['frontier-reasoning', 'multi-step', 'analysis'],
        costTier: 'high'
    },
    'claude-haiku-4.5': {
        id: 'claude-haiku-4.5',
        name: 'Claude Haiku 4.5',
        provider: 'anthropic',
        apiModel: 'claude-haiku-4-5-20251001',
        description: 'Rápido y eficiente para tareas simples',
        capabilities: ['fast', 'efficient'],
        costTier: 'low'
    },
    'claude-sonnet-3.5': {
        id: 'claude-sonnet-3.5',
        name: 'Claude Sonnet 3.5',
        provider: 'anthropic',
        apiModel: 'claude-3-5-sonnet-20241022',
        description: 'Equilibrio entre velocidad y calidad',
        capabilities: ['balanced', 'versatile'],
        costTier: 'medium'
    },

    // Gemini models (Google)
    'gemini-3-pro': {
        id: 'gemini-3-pro',
        name: 'Gemini 3 Pro',
        provider: 'google',
        apiModel: 'gemini-3.0-pro',
        description: 'Más potente, multimodal, adaptive thinking',
        capabilities: ['multimodal', 'adaptive', 'powerful'],
        costTier: 'high'
    },
    'gemini-3-flash': {
        id: 'gemini-3-flash',
        name: 'Gemini 3 Flash',
        provider: 'google',
        apiModel: 'gemini-3.0-flash',
        description: 'Rendimiento frontier-class, rápido',
        capabilities: ['fast', 'frontier', 'efficient'],
        costTier: 'medium',
        isDefault: true
    },
    'gemini-2.5-pro': {
        id: 'gemini-2.5-pro',
        name: 'Gemini 2.5 Pro',
        provider: 'google',
        apiModel: 'gemini-2.5-pro',
        description: 'Razonamiento complejo, multi-step thinking',
        capabilities: ['complex-reasoning', 'multi-step'],
        costTier: 'high'
    },
    'gemini-2.5-flash': {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'google',
        apiModel: 'gemini-2.5-flash',
        description: 'Respuestas rápidas y fundamentadas',
        capabilities: ['fast', 'reliable', 'cost-effective'],
        costTier: 'low'
    }
};

// Get default model
function getDefaultModel() {
    return Object.values(AI_MODELS).find(m => m.isDefault) || AI_MODELS['gemini-2.5-flash'];
}

// Get model by ID
function getModelById(modelId) {
    return AI_MODELS[modelId] || getDefaultModel();
}

// Get all models grouped by provider
function getModelsByProvider() {
    const grouped = {
        anthropic: [],
        google: []
    };

    Object.values(AI_MODELS).forEach(model => {
        grouped[model.provider].push(model);
    });

    return grouped;
}

// Get all models as array
function getAllModels() {
    return Object.values(AI_MODELS);
}

module.exports = {
    AI_MODELS,
    getDefaultModel,
    getModelById,
    getModelsByProvider,
    getAllModels
};

// Available AI models configuration
const AI_MODELS = {
    // Claude models (Anthropic)
    'claude-3-5-sonnet': {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        apiModel: 'claude-3-5-sonnet-20241022',
        description: 'Excelente razonamiento y precisión',
        capabilities: ['complex-reasoning', 'high-precision'],
        costTier: 'high'
    },
    'claude-3-5-haiku': {
        id: 'claude-3-5-haiku',
        name: 'Claude 3.5 Haiku',
        provider: 'anthropic',
        apiModel: 'claude-3-5-haiku-20241022',
        description: 'Ultra rápido y económico',
        capabilities: ['fast', 'efficient'],
        costTier: 'low'
    },

    // Gemini models (Google)
    'gemini-2.0-flash': {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        apiModel: 'gemini-2.0-flash-exp',
        description: 'Nueva generación: ultra rápido y nativo multimodal',
        capabilities: ['fast', 'multimodal', 'advanced'],
        costTier: 'low',
        isDefault: true
    },
    'gemini-1.5-pro': {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        apiModel: 'gemini-1.5-pro',
        description: 'Razonamiento complejo y ventana de contexto gigante',
        capabilities: ['complex-reasoning', 'large-context'],
        costTier: 'high'
    },
    'gemini-1.5-flash': {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        apiModel: 'gemini-1.5-flash',
        description: 'Rápido y eficiente para tareas cotidianas',
        capabilities: ['fast', 'reliable'],
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

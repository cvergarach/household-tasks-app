const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  ADVERTENCIA: GEMINI_API_KEY no está configurada');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy-key');

const model = genAI.getGenerativeModel({ 
  model: 'gemini-pro',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }
});

module.exports = { model, genAI };

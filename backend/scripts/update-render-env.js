#!/usr/bin/env node

const https = require('https');

const RENDER_API_KEY = process.argv[2];
const SERVICE_ID = process.argv[3];

if (!RENDER_API_KEY || !SERVICE_ID) {
    console.error('Usage: node update-render-env.js <RENDER_API_KEY> <SERVICE_ID>');
    console.error('\nPara obtener estos valores:');
    console.error('1. RENDER_API_KEY: https://dashboard.render.com/account/api-keys');
    console.error('2. SERVICE_ID: En tu servicio de Render, la URL tiene el formato render.com/web/srv-XXXXX, el SERVICE_ID es srv-XXXXX');
    process.exit(1);
}

const envVars = [
    {
        key: 'FRONTEND_URL',
        value: 'https://household-tasks-app.vercel.app'
    }
];

function updateEnvVar(envVar) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            key: envVar.key,
            value: envVar.value
        });

        const options = {
            hostname: 'api.render.com',
            port: 443,
            path: `/v1/services/${SERVICE_ID}/env-vars`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ key: envVar.key, success: true });
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('🔄 Actualizando variables de entorno en Render...\n');

    for (const envVar of envVars) {
        try {
            await updateEnvVar(envVar);
            console.log(`✅ ${envVar.key} = ${envVar.value}`);
        } catch (error) {
            console.error(`❌ Error actualizando ${envVar.key}:`, error.message);
        }
    }

    console.log('\n✅ Variables actualizadas. Render redesplegará automáticamente.');
    console.log('⏳ Espera ~2-3 minutos para que el nuevo deployment esté listo.');
}

main();

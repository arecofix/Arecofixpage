const crypto = require('crypto');
const fs = require('fs');

// We need jsonwebtoken. Install it with: npm install jsonwebtoken
const jwt = require('jsonwebtoken');

function generatePassword() {
  return crypto.randomBytes(32).toString('hex');
}

const JWT_SECRET = generatePassword();
const POSTGRES_PASSWORD = generatePassword();
const DASHBOARD_PASSWORD = generatePassword();
const DASHBOARD_USERNAME = 'supabase';

const ANON_KEY = jwt.sign({ role: 'anon' }, JWT_SECRET, { expiresIn: '10y' });
const SERVICE_ROLE_KEY = jwt.sign({ role: 'service_role' }, JWT_SECRET, { expiresIn: '10y' });

let envConfig = fs.readFileSync('.env', 'utf8');

envConfig = envConfig.replace(/^POSTGRES_PASSWORD=.*/m, `POSTGRES_PASSWORD=${POSTGRES_PASSWORD}`);
envConfig = envConfig.replace(/^JWT_SECRET=.*/m, `JWT_SECRET=${JWT_SECRET}`);
envConfig = envConfig.replace(/^ANON_KEY=.*/m, `ANON_KEY=${ANON_KEY}`);
envConfig = envConfig.replace(/^SERVICE_ROLE_KEY=.*/m, `SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}`);
envConfig = envConfig.replace(/^DASHBOARD_USERNAME=.*/m, `DASHBOARD_USERNAME=${DASHBOARD_USERNAME}`);
envConfig = envConfig.replace(/^DASHBOARD_PASSWORD=.*/m, `DASHBOARD_PASSWORD=${DASHBOARD_PASSWORD}`);

// Change API port to 54321 instead of 8000, and Studio to 54323 instead of 3000 to avoid conflicts
envConfig = envConfig.replace(/^API_PORT=.*/m, 'API_PORT=54321');
envConfig = envConfig.replace(/^STUDIO_PORT=.*/m, 'STUDIO_PORT=54323');

fs.writeFileSync('.env', envConfig);

console.log('Supabase .env configured successfully!');
console.log('JWT_SECRET: ' + JWT_SECRET);
console.log('POSTGRES_PASSWORD: ' + POSTGRES_PASSWORD);
console.log('DASHBOARD_PASSWORD: ' + DASHBOARD_PASSWORD);


#!/usr/bin/env node
/**
 * ==============================================================================
 * ARECOFIX - STAGING DEPLOYMENT ORCHESTRATOR (scripts/deploy-staging.mjs)
 * ==============================================================================
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';

const CONFIG = {
  sshHost: process.env.DEPLOY_SSH_HOST || 'ssh.arecofix.com.ar',
  sshUser: process.env.DEPLOY_SSH_USER || 'ubuntu',
  sshKey: process.env.DEPLOY_SSH_KEY || 'ssh-key-2026-08-30.key',
  remoteDir: '/home/ubuntu/arecofix-staging',
  pm2App: 'arecofix-frontend-staging',
  healthcheckPort: 4001,
  archiveName: 'dist-staging.tar.gz'
};

const startTime = Date.now();

function log(step, msg) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\x1b[36m[${elapsed}s]\x1b[0m \x1b[1m\x1b[33m[STAGING:${step}]\x1b[0m ${msg}`);
}

function run(cmd, desc) {
  if (desc) log('EXEC', desc);
  return execSync(cmd, { stdio: 'inherit', env: process.env });
}

function runSilent(cmd) {
  return execSync(cmd, { encoding: 'utf-8', env: process.env }).trim();
}

async function main() {
  console.log('\n🚀 INICIANDO DESPLIEGUE A STAGING (arecofix-staging)\n');

  // 1. Validar clave SSH
  if (!fs.existsSync(CONFIG.sshKey)) {
    throw new Error(`Clave SSH no encontrada en: ${CONFIG.sshKey}`);
  }

  // 1.5 Validar contrato de esquema contra Supabase
  log('SCHEMA', 'Verificando contrato de esquema para prevenir Schema Drift...');
  run('node scripts/verify-schema.mjs', 'Validación de esquema PostgREST');

  // 2. Compilar bundle si se requiere
  if (!process.argv.includes('--skip-build')) {
    log('BUILD', 'Compilando aplicación Angular SSR...');
    run('pnpm run build', 'ng build --configuration production');
  }

  // 3. Empaquetar
  log('PACKAGE', 'Empaquetando dist...');
  run(`tar -czf ${CONFIG.archiveName} -C dist arecofix`, 'Comprimiendo bundle');

  // 4. Copiar a staging
  log('TRANSFER', 'Transfiriendo bundle a la VPS...');
  run(
    `scp -i ${CONFIG.sshKey} -o StrictHostKeyChecking=no ${CONFIG.archiveName} ${CONFIG.sshUser}@${CONFIG.sshHost}:${CONFIG.remoteDir}/${CONFIG.archiveName}`,
    'SCP bundle'
  );
  
  // Copiar también ecosystem.staging.config.cjs y server-init.mjs
  run(
    `scp -i ${CONFIG.sshKey} -o StrictHostKeyChecking=no ecosystem.staging.config.cjs ${CONFIG.sshUser}@${CONFIG.sshHost}:${CONFIG.remoteDir}/ecosystem.staging.config.cjs`,
    'SCP ecosystem config'
  );
  run(
    `scp -i ${CONFIG.sshKey} -o StrictHostKeyChecking=no server-init.staging.mjs ${CONFIG.sshUser}@${CONFIG.sshHost}:${CONFIG.remoteDir}/server-init.mjs`,
    'SCP server-init.mjs'
  );

  // 5. Descomprimir e iniciar/recargar PM2
  log('PM2', 'Descomprimiendo y recargando PM2 en staging...');
  const remoteCmd = `
    cd ${CONFIG.remoteDir} &&
    mkdir -p dist &&
    tar -xzf ${CONFIG.archiveName} -C dist/ &&
    rm -f ${CONFIG.archiveName} &&
    (pm2 reload ecosystem.staging.config.cjs --update-env || pm2 start ecosystem.staging.config.cjs)
  `.replace(/\n\s+/g, ' ');

  run(`ssh -i ${CONFIG.sshKey} -o StrictHostKeyChecking=no ${CONFIG.sshUser}@${CONFIG.sshHost} "${remoteCmd}"`, 'Remote deploy');

  // 6. Limpieza local
  if (fs.existsSync(CONFIG.archiveName)) {
    fs.unlinkSync(CONFIG.archiveName);
  }

  // 7. Healthcheck en staging con reintentos
  log('HEALTH', 'Esperando 3s e iniciando verificación de salud...');
  await new Promise((r) => setTimeout(r, 3000));

  let verified = false;
  let lastOutput = '';
  for (let attempt = 1; attempt <= 5; attempt++) {
    log('HEALTH', `Intento ${attempt}/5: verificando http://localhost:${CONFIG.healthcheckPort}/...`);
    const checkCmd = `ssh -i ${CONFIG.sshKey} -o StrictHostKeyChecking=no ${CONFIG.sshUser}@${CONFIG.sshHost} "curl -sI -H 'Host: staging.arecofix.com.ar' http://localhost:${CONFIG.healthcheckPort}/ | head -n 5"`;
    try {
      lastOutput = runSilent(checkCmd);
      if (lastOutput.includes('200') || lastOutput.includes('301') || lastOutput.includes('302')) {
        console.log('\n--- Output Healthcheck Staging ---');
        console.log(lastOutput);
        console.log('---------------------------------\n');
        verified = true;
        break;
      }
    } catch {
      // Reintentar
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  if (verified) {
    log('SUCCESS', '✅ Staging desplegado y respondiendo 200 OK.');
  } else {
    throw new Error(`Staging no respondió exitosamente tras 5 intentos:\n${lastOutput}`);
  }
}

main().catch((err) => {
  console.error('\n❌ ERROR EN DESPLIEGUE A STAGING:', err.message);
  process.exit(1);
});

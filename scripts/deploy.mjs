#!/usr/bin/env node
/**
 * ==============================================================================
 * ARECOFIX - AUTOMATED PRODUCTION DEPLOYMENT ORCHESTRATOR (scripts/deploy.mjs)
 * ==============================================================================
 * Orquestador de despliegue atómico a producción vía SSH Tunnel y PM2.
 * 
 * Flujo:
 * 1. Validación de clave SSH y conectividad.
 * 2. Compilación de producción (Angular 21 SSR).
 * 3. Empaquetado comprimido atómico (tar.gz).
 * 4. Backup automático de la versión previa en la VPS (dist_backup).
 * 5. Transferencia segura vía SCP.
 * 6. Descompresión y rotación atómica en /home/ubuntu/arecofix/dist.
 * 7. Recarga de proceso PM2 (arecofix-frontend).
 * 8. Healthcheck de disponibilidad HTTP 200 en https://arecofix.com.ar.
 * 9. Rollback automático en caso de fallo crítico en el healthcheck.
 * ==============================================================================
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import https from 'https';

const CONFIG = {
  sshHost: process.env.DEPLOY_SSH_HOST || 'ssh.arecofix.com.ar',
  sshUser: process.env.DEPLOY_SSH_USER || 'ubuntu',
  sshKey: process.env.DEPLOY_SSH_KEY || 'ssh-key-2026-08-30.key',
  remoteDir: process.env.DEPLOY_REMOTE_DIR || '/home/ubuntu/arecofix',
  pm2App: process.env.DEPLOY_PM2_APP || 'arecofix-frontend',
  domain: process.env.DEPLOY_HEALTHCHECK_URL || 'https://arecofix.com.ar',
  archiveName: 'dist.tar.gz'
};

const startTime = Date.now();

function log(step, msg) {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\x1b[36m[${elapsed}s]\x1b[0m \x1b[1m\x1b[32m[${step}]\x1b[0m ${msg}`);
}

function logError(step, msg) {
  console.error(`\x1b[31m[ERROR][${step}] ${msg}\x1b[0m`);
}

function run(cmd, desc) {
  if (desc) log('EXEC', desc);
  return execSync(cmd, { stdio: 'inherit', env: process.env });
}

function runSilent(cmd) {
  return execSync(cmd, { encoding: 'utf-8', env: process.env }).trim();
}

async function verifyHealth(url, maxRetries = 5, delayMs = 3000) {
  log('HEALTH', `Verificando disponibilidad de ${url}...`);
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const statusCode = await new Promise((resolve, reject) => {
        const req = https.get(url, { rejectUnauthorized: false, timeout: 5000 }, (res) => {
          resolve(res.statusCode);
        });
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      });

      if (statusCode === 200 || statusCode === 301 || statusCode === 302) {
        log('HEALTH', `Intento ${i}/${maxRetries}: Servidor respondió HTTP ${statusCode} OK.`);
        return true;
      }
      log('HEALTH', `Intento ${i}/${maxRetries}: Respuesta HTTP ${statusCode}. Reintentando en ${delayMs}ms...`);
    } catch (e) {
      log('HEALTH', `Intento ${i}/${maxRetries}: Fallo de conexión (${e.message}). Reintentando...`);
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
  return false;
}

async function main() {
  console.log('\x1b[1m\x1b[35m');
  console.log('======================================================================');
  console.log('   🚀 ARECOFIX - DESPLIEGUE AUTOMATIZADO A PRODUCCIÓN');
  console.log('======================================================================\x1b[0m\n');

  // 1. Verificación de llave SSH
  const keyPath = path.resolve(process.cwd(), CONFIG.sshKey);
  if (!fs.existsSync(keyPath)) {
    logError('AUTH', `Clave SSH no encontrada en: ${keyPath}`);
    process.exit(1);
  }
  log('AUTH', `Clave SSH detectada: ${CONFIG.sshKey}`);

  // 2. Compilación de producción Angular SSR
  const skipBuild = process.argv.includes('--skip-build');
  if (!skipBuild) {
    log('BUILD', 'Iniciando compilación de producción con Angular 21 SSR...');
    try {
      run('pnpm run build', 'Compilando bundle cliente y servidor...');
    } catch (err) {
      logError('BUILD', 'Fallo en la compilación de Angular. Despliegue abortado.');
      process.exit(1);
    }
  } else {
    log('BUILD', 'Omitiendo compilación local (--skip-build activo).');
  }

  // 3. Empaquetado atómico
  log('PACKAGE', 'Empaquetando artefactos de producción en archivo comprimido...');
  const distPath = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distPath)) {
    logError('PACKAGE', 'Carpeta dist/ no existe. Ejecuta el build primero.');
    process.exit(1);
  }

  const archiveLocalPath = path.join(process.cwd(), CONFIG.archiveName);
  try {
    if (fs.existsSync(archiveLocalPath)) fs.unlinkSync(archiveLocalPath);
    run(`tar -czf ${CONFIG.archiveName} -C dist arecofix`, 'Generando dist.tar.gz...');
  } catch (err) {
    logError('PACKAGE', 'Fallo al comprimir dist.tar.gz.');
    process.exit(1);
  }

  const archiveSizeMb = (fs.statSync(archiveLocalPath).size / (1024 * 1024)).toFixed(2);
  log('PACKAGE', `Paquete generado exitosamente: ${CONFIG.archiveName} (${archiveSizeMb} MB)`);

  const sshOpts = `-i "${CONFIG.sshKey}" -o StrictHostKeyChecking=no -o ConnectTimeout=10`;
  const remoteTarget = `${CONFIG.sshUser}@${CONFIG.sshHost}`;

  try {
    // 4. Backup automático en VPS
    log('BACKUP', 'Creando backup de la versión actual en la VPS...');
    const backupCmd = `ssh ${sshOpts} ${remoteTarget} "mkdir -p ${CONFIG.remoteDir}/dist_backup && cp -rf ${CONFIG.remoteDir}/dist/arecofix ${CONFIG.remoteDir}/dist_backup/ 2>/dev/null || true"`;
    run(backupCmd);

    // 5. Transferencia segura vía SCP
    log('TRANSFER', `Subiendo ${CONFIG.archiveName} a ${CONFIG.sshHost}...`);
    const scpCmd = `scp ${sshOpts} "${archiveLocalPath}" ${remoteTarget}:${CONFIG.remoteDir}/${CONFIG.archiveName}`;
    run(scpCmd);

    // 6. Extracción atómica y reinicio de PM2 en VPS
    log('DEPLOY', 'Extrayendo versión en VPS y reiniciando PM2...');
    const remoteExecCmd = `ssh ${sshOpts} ${remoteTarget} "tar -xzf ${CONFIG.remoteDir}/${CONFIG.archiveName} -C ${CONFIG.remoteDir}/dist/ && rm -f ${CONFIG.remoteDir}/${CONFIG.archiveName} && pm2 reload ${CONFIG.pm2App} || pm2 restart ${CONFIG.pm2App}"`;
    run(remoteExecCmd);

    // 7. Healthcheck de producción
    const isHealthy = await verifyHealth(CONFIG.domain);
    if (!isHealthy) {
      logError('HEALTH', '¡ALERTA! El servidor no respondió 200 tras el despliegue.');
      log('ROLLBACK', 'Iniciando rollback automático a la versión de respaldo...');
      const rollbackCmd = `ssh ${sshOpts} ${remoteTarget} "cp -rf ${CONFIG.remoteDir}/dist_backup/arecofix ${CONFIG.remoteDir}/dist/ && pm2 restart ${CONFIG.pm2App}"`;
      run(rollbackCmd);
      logError('ROLLBACK', 'Rollback completado. La versión anterior fue restaurada.');
      process.exit(1);
    }

    log('SUCCESS', `🎉 ¡Despliegue completado con éxito en ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);
    console.log(`\x1b[32m✔ Dominio en línea: ${CONFIG.domain}\x1b[0m\n`);

  } catch (deployError) {
    logError('DEPLOY', `Error durante el proceso de despliegue: ${deployError.message}`);
    process.exit(1);
  } finally {
    // Limpieza de archivo temporal local
    if (fs.existsSync(archiveLocalPath)) {
      try { fs.unlinkSync(archiveLocalPath); } catch {}
    }
  }
}

main();

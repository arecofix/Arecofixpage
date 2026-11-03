#!/usr/bin/env node
/**
 * ==============================================================================
 * ARECOFIX - EMERGENCY ROLLBACK SCRIPT (scripts/rollback.mjs)
 * ==============================================================================
 * Restaura instantáneamente la versión anterior preservada en dist_backup en la VPS
 * y reinicia el proceso PM2 arecofix-frontend.
 *
 * Uso:
 *   node scripts/rollback.mjs
 *   pnpm run deploy:rollback
 * ==============================================================================
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CONFIG = {
  sshHost: process.env.DEPLOY_SSH_HOST || 'ssh.arecofix.com.ar',
  sshUser: process.env.DEPLOY_SSH_USER || 'ubuntu',
  sshKey: process.env.DEPLOY_SSH_KEY || 'ssh-key-2026-08-30.key',
  remoteDir: process.env.DEPLOY_REMOTE_DIR || '/home/ubuntu/arecofix',
  pm2App: process.env.DEPLOY_PM2_APP || 'arecofix-frontend'
};

function main() {
  console.log('\x1b[1m\x1b[31m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[31m   ⏪ ARECOFIX EMERGENCY PRODUCTION ROLLBACK\x1b[0m');
  console.log('\x1b[1m\x1b[31m======================================================================\x1b[0m\n');

  const keyPath = path.resolve(process.cwd(), CONFIG.sshKey);
  if (!fs.existsSync(keyPath)) {
    console.error(`\x1b[31m[ERROR] Clave SSH no encontrada: ${CONFIG.sshKey}\x1b[0m`);
    process.exit(1);
  }

  const sshOpts = `-i "${CONFIG.sshKey}" -o StrictHostKeyChecking=no -o ConnectTimeout=10`;
  const remoteTarget = `${CONFIG.sshUser}@${CONFIG.sshHost}`;

  console.log(`📡 Conectando a ${remoteTarget}...`);
  console.log('🔄 Verificando existencia de dist_backup y restaurando bundle anterior...');

  const rollbackCmd = `ssh ${sshOpts} ${remoteTarget} "if [ -d \\"${CONFIG.remoteDir}/dist_backup/arecofix\\" ]; then rm -rf ${CONFIG.remoteDir}/dist/arecofix && cp -rf ${CONFIG.remoteDir}/dist_backup/arecofix ${CONFIG.remoteDir}/dist/ && pm2 restart ${CONFIG.pm2App} && echo 'OK: Rollback aplicado exitosamente'; else echo 'FAIL: No existe dist_backup previo para restaurar'; exit 1; fi"`;

  try {
    const output = execSync(rollbackCmd, { encoding: 'utf-8', stdio: 'inherit' });
    console.log('\n\x1b[32m✔ Proceso de rollback completado.\x1b[0m');
    console.log('Ejecuta `pnpm run healthcheck` para validar el estado del servicio.\n');
  } catch (err) {
    console.error(`\x1b[31m✖ Falló el rollback en la VPS: ${err.message}\x1b[0m`);
    process.exit(1);
  }
}

main();

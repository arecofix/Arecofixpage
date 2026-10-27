#!/usr/bin/env node
/**
 * scripts/verify-clean-git.mjs
 * 
 * Fail-by-default: Verifica que el working tree de git esté 100% limpio antes de compilar.
 * Para compilar localmente con cambios sin commitear, debe pasarse explícitamente:
 *   ALLOW_DIRTY=true pnpm run build
 */

import { execSync } from 'child_process';

const allowDirty = process.env.ALLOW_DIRTY === 'true';

try {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
  const dirtyFiles = status ? status.split('\n').map(l => l.trim()).filter(Boolean) : [];

  if (dirtyFiles.length > 0) {
    if (allowDirty) {
      console.warn('\x1b[33m[git] AVISO: Working tree con cambios no commiteados (ALLOW_DIRTY=true activo).\x1b[0m');
    } else {
      console.error('\x1b[31m[git] ERROR CRÍTICO: Working tree sucio detectado.\x1b[0m');
      console.error(dirtyFiles.join('\n'));
      console.error('\x1b[33mPara compilar en desarrollo local con cambios: ALLOW_DIRTY=true pnpm run build\x1b[0m');
      console.error('\x1b[33mPara producción: realiza commit de todos los cambios antes del build.\x1b[0m');
      process.exit(1);
    }
  } else {
    console.log('\x1b[32m[git] Git working tree limpio. OK.\x1b[0m');
  }
} catch (err) {
  console.error('[git] Error al verificar git status:', err.message);
  if (!allowDirty) {
    process.exit(1);
  }
}

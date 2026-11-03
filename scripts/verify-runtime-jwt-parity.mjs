#!/usr/bin/env node
import { execSync } from 'child_process';

/**
 * CI / DevOps Runtime JWT Parity Verifier
 * Valida que los contenedores en ejecución (supabase-auth, supabase-rest, supabase-realtime)
 * compartan exactamente el mismo JWT_SECRET efectivo en tiempo de ejecución.
 */

export function extractContainerEnv(containerName, envKey) {
  try {
    const output = execSync(
      `docker inspect ${containerName} --format "{{range .Config.Env}}{{println .}}{{end}}"`,
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
    );
    const line = output.split('\n').find(l => l.startsWith(`${envKey}=`));
    return line ? line.split('=')[1].trim() : null;
  } catch (err) {
    throw new Error(`Contenedor '${containerName}' no encontrado o no accesible: ${err.message}`);
  }
}

export function verifyJwtParity(options = { mode: 'live' }) {
  console.log('🔍 Iniciando verificación de paridad de JWT_SECRET en runtime de contenedores Docker...');

  let authSecret, restSecret, realtimeSecret;

  if (options.mode === 'simulate-mismatch-auth') {
    console.log('🧪 MODO SIMULACIÓN DEF-01-B ACTIVADO: Inyectando mismatch en supabase-auth (clave vieja vs realtime nueva)...');
    authSecret = 'old-placeholder-jwt-secret-used-in-legacy-containers-32char'; // Auth desincronizado
    restSecret = '34154622486773b91e85a8a1fc5e24dfea8e6af5baa1c01eb94bfd5819c4685a';
    realtimeSecret = '34154622486773b91e85a8a1fc5e24dfea8e6af5baa1c01eb94bfd5819c4685a';
  } else if (options.mode === 'simulate-mismatch-realtime' || options.mode === 'simulate-mismatch') {
    console.log('🧪 MODO SIMULACIÓN DEF-01 ACTIVADO: Inyectando mismatch en supabase-realtime (placeholder histórico)...');
    authSecret = '34154622486773b91e85a8a1fc5e24dfea8e6af5baa1c01eb94bfd5819c4685a';
    restSecret = '34154622486773b91e85a8a1fc5e24dfea8e6af5baa1c01eb94bfd5819c4685a';
    realtimeSecret = 'super-secret-jwt-token-with-at-least-32-characters-long'; // Realtime desincronizado
  } else {
    authSecret = extractContainerEnv('supabase-auth', 'GOTRUE_JWT_SECRET');
    restSecret = extractContainerEnv('supabase-rest', 'PGRST_JWT_SECRET');
    realtimeSecret = extractContainerEnv('supabase-realtime', 'JWT_SECRET');
  }

  console.log(`  - supabase-auth (GOTRUE_JWT_SECRET):     ${authSecret ? authSecret.substring(0, 10) + '...' : 'NULL'}`);
  console.log(`  - supabase-rest (PGRST_JWT_SECRET):     ${restSecret ? restSecret.substring(0, 10) + '...' : 'NULL'}`);
  console.log(`  - supabase-realtime (JWT_SECRET):       ${realtimeSecret ? realtimeSecret.substring(0, 10) + '...' : 'NULL'}`);

  const errors = [];
  if (!authSecret) errors.push('supabase-auth no tiene definida la variable GOTRUE_JWT_SECRET');
  if (!restSecret) errors.push('supabase-rest no tiene definida la variable PGRST_JWT_SECRET');
  if (!realtimeSecret) errors.push('supabase-realtime no tiene definida la variable JWT_SECRET');

  if (authSecret !== realtimeSecret) {
    errors.push(`Discrepancia detectada: supabase-auth (${authSecret?.substring(0, 8)}...) !== supabase-realtime (${realtimeSecret?.substring(0, 8)}...)`);
  }
  if (authSecret !== restSecret) {
    errors.push(`Discrepancia detectada: supabase-auth (${authSecret?.substring(0, 8)}...) !== supabase-rest (${restSecret?.substring(0, 8)}...)`);
  }
  if (restSecret !== realtimeSecret) {
    errors.push(`Discrepancia detectada: supabase-rest (${restSecret?.substring(0, 8)}...) !== supabase-realtime (${realtimeSecret?.substring(0, 8)}...)`);
  }

  if (errors.length > 0) {
    console.error('\n❌ FALLO CRÍTICO EN CI: Discrepancia o ausencia de JWT_SECRET en contenedores:');
    errors.forEach(e => console.error(`   ✖ ${e}`));
    return false;
  }

  console.log('\n✅ ÉXITO: Todos los contenedores de runtime comparten idéntico JWT_SECRET al 100%.');
  return true;
}

// Ejecución directa si se invoca como script CLI
const isDirectCall = process.argv[1]?.endsWith('verify-runtime-jwt-parity.mjs');
if (isDirectCall) {
  let mode = 'live';
  if (process.argv.includes('--simulate-mismatch-auth')) {
    mode = 'simulate-mismatch-auth';
  } else if (process.argv.includes('--simulate-mismatch-realtime') || process.argv.includes('--simulate-mismatch')) {
    mode = 'simulate-mismatch-realtime';
  }
  const success = verifyJwtParity({ mode });
  process.exit(success ? 0 : 1);
}

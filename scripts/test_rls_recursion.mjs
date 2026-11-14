/**
 * Arecofix CI/CD Gate: Automated RLS Anti-Recursion Test
 * Script: scripts/test_rls_recursion.mjs
 * 
 * Verifies that querying core multi-tenant tables does not trigger CWE-674
 * (infinite recursion / stack depth limit exceeded) or abnormal gateway codes (413/500/504).
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────
// Carga de variables de entorno
// ─────────────────────────────────────────────────────────
// En local: carga desde .env si existe.
// En CI (GitHub Actions): no hay .env, las variables vienen inyectadas
// por `env:` en el workflow desde los Secrets.
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('[RLS Audit] Loaded .env file from disk.');
} else {
  console.log('[RLS Audit] No .env file found. Reading from process.env (CI mode).');
}

// ─────────────────────────────────────────────────────────
// Resolución de variables con fallbacks múltiples
// ─────────────────────────────────────────────────────────
const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  'https://db.arecofix.com.ar';

const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_KEY ||
  process.env.ANON_KEY;

// ─────────────────────────────────────────────────────────
// Diagnóstico (sin exponer valores sensibles)
// ─────────────────────────────────────────────────────────
console.log('[RLS Audit] Environment diagnostics:');
console.log(`  - SUPABASE_URL defined:       ${!!process.env.SUPABASE_URL}`);
console.log(`  - SUPABASE_KEY defined:       ${!!process.env.SUPABASE_KEY}`);
console.log(`  - SUPABASE_ANON_KEY defined:  ${!!process.env.SUPABASE_ANON_KEY}`);
console.log(`  - ANON_KEY defined:           ${!!process.env.ANON_KEY}`);
console.log(`  - GITHUB_ACTIONS:             ${process.env.GITHUB_ACTIONS || 'false'}`);

// ─────────────────────────────────────────────────────────
// Validación de credenciales
// ─────────────────────────────────────────────────────────
if (!SUPABASE_KEY) {
  console.error('');
  console.error('[FATAL] Missing SUPABASE_KEY or SUPABASE_ANON_KEY in environment.');
  console.error('[FATAL] Local: ensure .env has SUPABASE_KEY.');
  console.error('[FATAL] CI: ensure GitHub Secret SUPABASE_KEY is set and injected via env:');
  console.error('');
  process.exit(1);
}

if (!SUPABASE_URL) {
  console.error('[FATAL] Missing SUPABASE_URL in environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false }
});

const CRITICAL_TABLES = [
  'profiles',
  'tenants',
  'user_roles',
  'branches',
  'orders',
  'order_items',
  'products',
  'repairs',
  'courses',
  'categories',
  'blog_posts'
];

async function testRecursion() {
  console.log('');
  console.log('======================================================');
  console.log('🛡️  ARECOFIX AUTOMATED RLS ANTI-RECURSION AUDIT GATE');
  console.log(`📡 Target URL: ${SUPABASE_URL}`);
  console.log(`⏰ Timestamp:  ${new Date().toISOString()}`);
  console.log('======================================================');
  console.log('');

  let failureCount = 0;

  for (const table of CRITICAL_TABLES) {
    process.stdout.write(`Evaluating RLS depth on [${table}]... `);
    const start = Date.now();

    try {
      const { data, error, status } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      const elapsed = Date.now() - start;

      if (error) {
        const errorMsg = error.message || JSON.stringify(error);
        if (
          errorMsg.toLowerCase().includes('stack depth limit exceeded') ||
          errorMsg.toLowerCase().includes('recursion') ||
          status === 413 ||
          status >= 500
        ) {
          console.log(`❌ FAILED (Status: ${status}) in ${elapsed}ms`);
          console.error(`   [CRITICAL RECURSION ERROR]: ${errorMsg}`);
          failureCount++;
          continue;
        }

        // Avisos menores (permisos, schema) no son fatales mientras no se exceda el depth limit
        console.log(`⚠️  Notice (${status || 400}) [${elapsed}ms]: ${error.message}`);
      } else {
        console.log(`✔ OK (Status: ${status || 200}) [${elapsed}ms]`);
      }
    } catch (err) {
      console.log(`❌ EXCEPTION in ${Date.now() - start}ms`);
      console.error(`   [FATAL EXCEPTION]: ${err.message}`);
      failureCount++;
    }
  }

  // Evaluación de la función RPC crítica
  process.stdout.write('Evaluating RPC [get_current_tenant_id]... ');
  try {
    const { data, error, status } = await supabase.rpc('get_current_tenant_id');
    if (error && error.message.toLowerCase().includes('stack depth')) {
      console.log('❌ FAILED: stack depth limit exceeded');
      failureCount++;
    } else {
      console.log(`✔ OK (Status: ${status || 200})`);
    }
  } catch (err) {
    console.log(`❌ EXCEPTION: ${err.message}`);
    failureCount++;
  }

  console.log('');
  console.log('------------------------------------------------------');
  if (failureCount > 0) {
    console.error(`🚨 AUDIT GATE FAILED: ${failureCount} table(s) exhibit RLS recursion or critical failures!`);
    process.exit(1);
  } else {
    console.log('✅ AUDIT GATE PASSED: Zero RLS infinite recursions detected across all tables.');
    process.exit(0);
  }
}

testRecursion();
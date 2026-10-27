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

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://db.arecofix.com.ar';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('[FATAL] Missing SUPABASE_KEY or SUPABASE_ANON_KEY in environment.');
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
  console.log('======================================================');
  console.log('🛡️  ARECOFIX AUTOMATED RLS ANTI-RECURSION AUDIT GATE');
  console.log(`📡 Target URL: ${SUPABASE_URL}`);
  console.log(`⏰ Timestamp:  ${new Date().toISOString()}`);
  console.log('======================================================\n');

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

        // Minor permission or schema notices are non-fatal as long as depth limit is not exceeded
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

  // Evaluate core RPC function
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

  console.log('\n------------------------------------------------------');
  if (failureCount > 0) {
    console.error(`🚨 AUDIT GATE FAILED: ${failureCount} table(s) exhibit RLS recursion or critical failures!`);
    process.exit(1);
  } else {
    console.log('✅ AUDIT GATE PASSED: Zero RLS infinite recursions detected across all tables.');
    process.exit(0);
  }
}

testRecursion();

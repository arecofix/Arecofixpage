#!/usr/bin/env node
/**
 * ==============================================================================
 * ARECOFIX - PRE-DEPLOY SCHEMA DRIFT VERIFIER (scripts/verify-schema.mjs)
 * ==============================================================================
 * Validador de contrato de esquema contra la API REST de Supabase/PostgREST.
 * Previene despliegues de código frontend/backend que dependan de columnas
 * que aún no existen en la base de datos o en la caché de PostgREST.
 * ==============================================================================
 */

import https from 'https';
import fs from 'fs';
import path from 'path';

let defaultKey = '';
try {
  const envPath = path.join(process.cwd(), 'src/environments/environment.prod.ts');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const keyMatch = content.match(/supabaseKey:\s*'([^']+)'/);
    if (keyMatch) defaultKey = keyMatch[1];
  }
} catch {}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://db.arecofix.com.ar';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || defaultKey;

const CRITICAL_SCHEMA_CHECKS = [
  {
    table: 'orders',
    query: 'select=id,order_number,session_id,status,tracking_code,tenant_id&limit=1',
    description: 'Tabla orders y columna tracking_code (Prevención de fallo en carrito)'
  },
  {
    table: 'products',
    query: 'select=id,name,price,is_active,tenant_id&limit=1',
    description: 'Catálogo de productos y campos esenciales'
  },
  {
    table: 'order_items',
    query: 'select=id,order_id,cart_item_id,product_id,quantity,unit_price&limit=1',
    description: 'Detalle de items de carrito y columna cart_item_id (Prevención de fallo BUG-001)'
  },
  {
    table: 'service_leads',
    query: 'select=id,service_id,name,phone&limit=0',
    description: 'Tabla de prospectos y leads'
  }
];

function checkEndpoint(table, query) {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: data
        });
      });
    });

    req.on('error', (err) => {
      resolve({ statusCode: 500, body: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ statusCode: 504, body: 'Timeout de conexión con PostgREST' });
    });
  });
}

async function main() {
  console.log('\x1b[36m[SCHEMA-CHECK]\x1b[0m Iniciando validación de contrato de esquema contra Supabase...');
  console.log(`\x1b[36m[TARGET]\x1b[0m Endpoint: ${SUPABASE_URL}/rest/v1\n`);

  let hasError = false;

  for (const check of CRITICAL_SCHEMA_CHECKS) {
    const { statusCode, body } = await checkEndpoint(check.table, check.query);
    if (statusCode >= 200 && statusCode < 300) {
      console.log(`  \x1b[32m✔ [OK]\x1b[0m ${check.description} -> HTTP ${statusCode}`);
    } else {
      console.error(`  \x1b[31m✖ [FAIL]\x1b[0m ${check.description} -> HTTP ${statusCode}`);
      try {
        const json = JSON.parse(body);
        console.error(`     \x1b[31mError PostgREST: [${json.code}] ${json.message}\x1b[0m`);
        if (json.details) console.error(`     Detalles: ${json.details}`);
        if (json.hint) console.error(`     Sugerencia: ${json.hint}`);
      } catch {
        console.error(`     Respuesta cruda: ${body.slice(0, 200)}`);
      }
      hasError = true;
    }
  }

  console.log('');
  if (hasError) {
    console.error('\x1b[31m❌ SCHEMA DRIFT DETECTADO: El esquema de la base de datos no coincide con lo esperado por el código.\x1b[0m');
    console.error('\x1b[31m   El despliegue ha sido abortado para proteger la operación de producción.\x1b[0m');
    process.exit(1);
  }

  console.log('\x1b[32m✅ CONTRATO DE ESQUEMA VÁLIDO: Todas las tablas y columnas requeridas existen y responden 200 OK.\x1b[0m\n');
  process.exit(0);
}

main();

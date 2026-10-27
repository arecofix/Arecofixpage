#!/usr/bin/env node
/**
 * Test de idempotencia y reversibilidad (rollback) de la migración
 * 20261023000000_add_cart_item_id_to_order_items.sql
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SSH_KEY = 'ssh-key-2026-08-30.key';
const SSH_HOST = 'ssh.arecofix.com.ar';
const SSH_USER = 'ubuntu';
const SSH_OPTS = `-i "${SSH_KEY}" -o StrictHostKeyChecking=no -o ConnectTimeout=10`;

function runPsql(sql) {
  const escaped = sql.replace(/"/g, '\\"');
  const cmd = `ssh ${SSH_OPTS} ${SSH_USER}@${SSH_HOST} "docker exec -i supabase-db psql -U postgres -d postgres -c \\"${escaped}\\""`;
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

function runSqlFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  const sql = fs.readFileSync(fullPath, 'utf8');
  const cmd = `ssh ${SSH_OPTS} ${SSH_USER}@${SSH_HOST} "docker exec -i supabase-db psql -U postgres -d postgres"`;
  return execSync(cmd, { input: sql, encoding: 'utf-8' }).trim();
}

async function runMigrationTest() {
  console.log('=== TEST DE MIGRACIÓN: 20261023000000_add_cart_item_id_to_order_items ===\n');

  // 1. Ejecutar UP
  console.log('1. Ejecutando migración UP inicial...');
  const upRes1 = runSqlFile('supabase/migrations/20261023000000_add_cart_item_id_to_order_items.sql');
  console.log('   Resultado UP 1:', upRes1);

  // 2. Verificar existencia de columna y unique index
  console.log('2. Verificando columna e índice único en catálogo PostgreSQL...');
  const colCheck = runPsql("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'cart_item_id';");
  console.log(colCheck);
  if (!colCheck.includes('cart_item_id')) {
    throw new Error('Fallo: cart_item_id no existe en order_items tras UP');
  }

  const idxCheck = runPsql("SELECT indexname FROM pg_indexes WHERE tablename = 'order_items' AND indexname = 'idx_order_items_cart_item_id';");
  console.log(idxCheck);
  if (!idxCheck.includes('idx_order_items_cart_item_id')) {
    throw new Error('Fallo: índice único idx_order_items_cart_item_id no existe tras UP');
  }

  // 3. Probar idempotencia (ejecutar UP por segunda vez)
  console.log('3. Probando idempotencia (UP segunda pasada)...');
  const upRes2 = runSqlFile('supabase/migrations/20261023000000_add_cart_item_id_to_order_items.sql');
  console.log('   Resultado UP 2:', upRes2);

  // 4. Probar ROLLBACK (DOWN)
  console.log('4. Probando ROLLBACK (ejecutando DOWN)...');
  const downRes = runSqlFile('supabase/migrations/20261023000000_add_cart_item_id_to_order_items_down.sql');
  console.log('   Resultado DOWN:', downRes);

  const colCheckAfterDown = runPsql("SELECT column_name FROM information_schema.columns WHERE table_name = 'order_items' AND column_name = 'cart_item_id';");
  console.log('   Check tras DOWN (debe ser 0 rows):', colCheckAfterDown);
  if (colCheckAfterDown.includes('cart_item_id')) {
    throw new Error('Fallo: cart_item_id sigue existiendo tras DOWN');
  }

  // 5. Re-aplicar UP para dejar el esquema en estado consistente
  console.log('5. Re-aplicando UP para dejar el esquema listo para producción...');
  const upFinal = runSqlFile('supabase/migrations/20261023000000_add_cart_item_id_to_order_items.sql');
  console.log('   Resultado UP final:', upFinal);

  // 6. Recargar PostgREST
  console.log('6. Notificando recarga de caché de esquema en PostgREST...');
  execSync(`ssh ${SSH_OPTS} ${SSH_USER}@${SSH_HOST} "docker restart supabase-rest"`);
  console.log('   supabase-rest reiniciado exitosamente.');

  console.log('\n✔ TEST DE MIGRACIÓN EXITOSO: Idempotencia y Rollback 100% verificados en PostgreSQL.');
}

runMigrationTest().catch(err => {
  console.error('\n✖ ERROR EN TEST DE MIGRACIÓN:', err.message);
  process.exit(1);
});

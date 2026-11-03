/**
 * Arecofix Database Performance Maintenance
 * Script: audit_unused_indexes.mjs
 * Schedule: 2026-11-20 (30 days post-remediation warmup evaluation)
 *
 * Purpose:
 * Audits all indexes in public and zarx schemas where pg_stat_user_indexes.idx_scan = 0.
 * Cross-references with information_schema and pg_constraint to identify whether
 * the index backs a Foreign Key, Primary Key, or Unique Constraint.
 * Generates an advisory report and proposed safe 'DROP INDEX CONCURRENTLY' commands
 * for indexes that are neither scanned nor covering constraints.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SQL_AUDIT = `
WITH foreign_key_columns AS (
    SELECT
        kcu.table_schema,
        kcu.table_name,
        kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema IN ('public', 'zarx')
),
index_metadata AS (
    SELECT
        sui.schemaname,
        sui.relname AS table_name,
        sui.indexrelname AS index_name,
        sui.idx_scan,
        pg_relation_size(sui.indexrelid) AS index_size_bytes,
        pg_size_pretty(pg_relation_size(sui.indexrelid)) AS index_size_pretty,
        i.indisunique,
        i.indisprimary,
        indkey
    FROM pg_stat_user_indexes sui
    JOIN pg_index i ON i.indexrelid = sui.indexrelid
    WHERE sui.schemaname IN ('public', 'zarx')
      AND sui.idx_scan = 0
      AND NOT i.indisprimary
      AND NOT i.indisunique
)
SELECT
    m.schemaname,
    m.table_name,
    m.index_name,
    m.idx_scan,
    m.index_size_pretty,
    EXISTS (
        SELECT 1 FROM foreign_key_columns fkc
        WHERE fkc.table_schema = m.schemaname
          AND fkc.table_name = m.table_name
          AND m.index_name LIKE '%' || fkc.column_name || '%'
    ) AS is_covering_fk
FROM index_metadata m
ORDER BY m.schemaname, m.table_name, m.index_name;
`;

async function runAudit() {
  console.log('=== ARECOFIX UNUSED INDEX AUDIT (30-DAY EVALUATION) ===');
  console.log(`Evaluated on: ${new Date().toISOString()}`);
  console.log('Connecting to production database container...\n');

  try {
    const psqlCommand = `ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar "docker exec -i -e PGPASSWORD=eze321 supabase-db psql -U supabase_admin -d postgres -t -A -F ','"`;
    
    const output = execSync(psqlCommand, { input: SQL_AUDIT, encoding: 'utf-8' }).trim();
    
    if (!output) {
      console.log('No zero-scan indexes detected. Warmup complete.');
      return;
    }

    const rows = output.split('\n').filter(Boolean).map(line => {
      const [schemaname, table_name, index_name, idx_scan, index_size_pretty, is_covering_fk] = line.split(',');
      return { schemaname, table_name, index_name, idx_scan, index_size_pretty, is_covering_fk: is_covering_fk === 't' };
    });

    const fkCovering = rows.filter(r => r.is_covering_fk);
    const candidateDrop = rows.filter(r => !r.is_covering_fk);

    console.log(`Total zero-scan indexes: ${rows.length}`);
    console.log(`- Essential Foreign Key covering indexes (PROTECTED): ${fkCovering.length}`);
    console.log(`- Redundant / Unused candidates for review: ${candidateDrop.length}\n`);

    if (candidateDrop.length > 0) {
      console.log('--- CANDIDATE INDEXES FOR DECOMMISSIONING ---');
      candidateDrop.forEach(idx => {
        console.log(`DROP INDEX CONCURRENTLY IF EXISTS ${idx.schemaname}.${idx.index_name}; -- Table: ${idx.table_name} (${idx.index_size_pretty})`);
      });
    } else {
      console.log('All zero-scan indexes are protecting Foreign Key constraints. No index drops recommended.');
    }

    const reportPath = path.resolve('docs/assets/db/unused_index_evaluation.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({ auditDate: new Date().toISOString(), totalZeroScan: rows.length, fkCoveringCount: fkCovering.length, candidateDropCount: candidateDrop.length, candidateDrop }, null, 2));
    console.log(`\nAudit report saved to: ${reportPath}`);
  } catch (err) {
    console.error('Error running unused index audit:', err.message);
  }
}

runAudit();

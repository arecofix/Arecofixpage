import { execSync } from 'child_process';
import fs from 'fs';

let sql = process.argv[2];
if (!sql) {
  console.error('Usage: node scripts/remote-psql.mjs "<SQL or file.sql>"');
  process.exit(1);
}

if (fs.existsSync(sql)) {
  sql = fs.readFileSync(sql, 'utf8');
}

try {
  const result = execSync(`ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar "docker exec -i supabase-db psql -U postgres"`, {
    input: sql,
    encoding: 'utf-8'
  });
  console.log(result);
} catch (e) {
  console.error('Remote error:', e.stderr || e.message);
  process.exit(1);
}

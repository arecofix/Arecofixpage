import { execSync } from 'child_process';
import fs from 'fs';

const sql = process.argv[2];
if (!sql) {
  console.error('Usage: node scripts/remote-psql.mjs "SELECT ..."');
  process.exit(1);
}

const b64 = Buffer.from(sql).toString('base64');
const remoteCmd = `echo ${b64} | base64 -d | docker exec -i supabase-db psql -U postgres`;

try {
  const result = execSync(`ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar "${remoteCmd}"`, {
    encoding: 'utf-8'
  });
  console.log(result);
} catch (e) {
  console.error('Remote error:', e.stderr || e.message);
  process.exit(1);
}

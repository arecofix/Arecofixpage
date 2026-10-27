import { execSync } from 'child_process';

const cmd = process.argv[2];
if (!cmd) {
  console.error('Usage: node scripts/ssh-cmd.mjs "<remote-bash-command>"');
  process.exit(1);
}

try {
  const result = execSync(`ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar ${JSON.stringify(cmd)}`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
  console.log(result);
} catch (e) {
  console.error('SSH Error:', e.stderr || e.message);
  process.exit(1);
}

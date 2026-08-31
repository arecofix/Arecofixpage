const fs = require('fs');
const CHUNK = '/home/ubuntu/arecofix/dist/arecofix/server/chunk-GXGKWF7B.mjs';

const content = fs.readFileSync(CHUNK, 'utf8');
const idx = content.indexOf('native WebSocket not found');

if (idx === -1) {
  console.log('String not found in chunk');
  process.exit(1);
}

// Show context around the error
console.log('=== CONTEXT (-200 chars) ===');
console.log(content.slice(Math.max(0, idx - 200), idx + 100));
console.log('=== END CONTEXT ===');

// Find the throw statement
const throwIdx = content.lastIndexOf('throw new Error', idx);
console.log('throw index:', throwIdx);
console.log('throw code:', content.slice(throwIdx, throwIdx + 100));

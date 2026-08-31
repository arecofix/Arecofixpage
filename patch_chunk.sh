#!/bin/bash
# patch_chunk.sh - Patches the compiled Supabase chunk to skip WebSocket check in SSR
CHUNK="/home/ubuntu/arecofix/dist/arecofix/server/chunk-GXGKWF7B.mjs"

if [ ! -f "$CHUNK" ]; then
  echo "ERROR: chunk not found at $CHUNK"
  exit 1
fi

# Check if already patched
if grep -q "PATCHED_WS_POLYFILL" "$CHUNK"; then
  echo "Already patched, skipping."
  exit 0
fi

echo "Patching $CHUNK..."

# The error comes from getWebSocketConstructor which checks:
# if(!globalThis.WebSocket) throw new Error("Node.js detected but native WebSocket not found.")
# We patch it to return a dummy WebSocket class instead of throwing
# 
# The exact code is: sr.getWebSocketConstructor=function(){if(typeof globalThis.WebSocket!="undefined")return globalThis.WebSocket;throw new Error("Node.js detected but native WebSocket not found.
# We replace the throw with a return of a dummy class

node -e "
const fs = require('fs');
const file = '$CHUNK';
let content = fs.readFileSync(file, 'utf8');

// Add marker to detect if already patched
if (content.includes('PATCHED_WS_POLYFILL')) {
  console.log('Already patched');
  process.exit(0);
}

// Patch: instead of throwing when no globalThis.WebSocket, return a dummy class
const oldCode = 'typeof globalThis.WebSocket!=\"undefined\"){return globalThis.WebSocket}throw new Error(\"Node.js detected but native WebSocket not found.';
const newCode = 'typeof globalThis.WebSocket!=\"undefined\"){return globalThis.WebSocket}return class DummyWS{constructor(){this.readyState=3}close(){}send(){}addEventListener(){}removeEventListener(){}dispatchEvent(){return true}}/* PATCHED_WS_POLYFILL */;throw new Error(\"UNREACHABLE';

if (!content.includes(oldCode.substring(0, 50))) {
  console.log('Pattern not found, trying alternative...');
  // Try to find and fix the error throw differently
  const throwPattern = 'throw new Error(\"Node.js detected but native WebSocket not found.';
  const idx = content.indexOf(throwPattern);
  if (idx === -1) {
    console.log('ERROR: Could not find the throw statement to patch');
    process.exit(1);
  }
  // Find the enclosing function and replace throw with return dummy
  // Look for the nearest semicolon or closing brace after the throw
  const endIdx = content.indexOf('\")', idx) + 2;
  const patch = content.slice(0, idx) + 
    'return class DummyWS{constructor(){this.readyState=3}close(){}send(){}addEventListener(){}removeEventListener(){}dispatchEvent(){return true}}/* PATCHED_WS_POLYFILL */' +
    content.slice(endIdx);
  fs.writeFileSync(file, patch);
  console.log('Patched (alternative method) at index', idx);
} else {
  const patched = content.replace(oldCode, newCode);
  fs.writeFileSync(file, patched);
  console.log('Patched successfully');
}
"

echo "Done patching."

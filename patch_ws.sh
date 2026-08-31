#!/bin/bash
FILE="/home/ubuntu/arecofix/dist/arecofix/server/server.mjs"
FIRST_LINE=$(head -c 25 "$FILE")
POLYFILL='import{createRequire}from"module";const _req=createRequire(import.meta.url);if(!globalThis.WebSocket){const {WebSocket:WS}=_req("ws");globalThis.WebSocket=WS;}'

if echo "$FIRST_LINE" | grep -q "createRequire"; then
  echo "Already patched, skipping."
else
  echo "Patching $FILE..."
  echo "$POLYFILL" | cat - "$FILE" > /tmp/server_patched.mjs
  mv /tmp/server_patched.mjs "$FILE"
  echo "Done!"
fi

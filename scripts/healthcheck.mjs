#!/usr/bin/env node
/**
 * ==============================================================================
 * ARECOFIX - PRODUCTION HEALTHCHECK & SRE MONITOR (scripts/healthcheck.mjs)
 * ==============================================================================
 * Diagnóstico rápido de disponibilidad, latencia y servicios en producción.
 *
 * Uso:
 *   node scripts/healthcheck.mjs
 *   pnpm run healthcheck
 * ==============================================================================
 */

import https from 'https';
import http from 'http';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TARGET_URL = process.env.DEPLOY_HEALTHCHECK_URL || 'https://arecofix.com.ar';
const SSH_HOST = process.env.DEPLOY_SSH_HOST || 'ssh.arecofix.com.ar';
const SSH_USER = process.env.DEPLOY_SSH_USER || 'ubuntu';
const SSH_KEY = process.env.DEPLOY_SSH_KEY || 'ssh-key-2026-08-30.key';

async function checkHttp(url) {
  const start = Date.now();
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { rejectUnauthorized: false, timeout: 7000 }, (res) => {
      let body = '';
      res.on('data', chunk => { if (body.length < 500) body += chunk; });
      res.on('end', () => {
        const latency = Date.now() - start;
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 400,
          statusCode: res.statusCode,
          headers: res.headers,
          latencyMs: latency,
          preview: body.slice(0, 120).replace(/\s+/g, ' ')
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        ok: false,
        error: err.message,
        latencyMs: Date.now() - start
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ok: false,
        error: 'Timeout (> 7000ms)',
        latencyMs: Date.now() - start
      });
    });
  });
}

function checkRemotePm2() {
  const keyPath = path.resolve(process.cwd(), SSH_KEY);
  if (!fs.existsSync(keyPath)) {
    return { ok: false, message: 'SSH key not found locally (skipped PM2 query)' };
  }

  try {
    const cmd = `ssh -i "${SSH_KEY}" -o StrictHostKeyChecking=no -o ConnectTimeout=5 ${SSH_USER}@${SSH_HOST} "pm2 jlist"`;
    const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const list = JSON.parse(output);
    const frontend = list.find(app => app.name === 'arecofix-frontend');
    if (!frontend) {
      return { ok: false, message: 'Process arecofix-frontend not found in PM2 list' };
    }

    return {
      ok: frontend.pm2_env.status === 'online',
      status: frontend.pm2_env.status,
      uptime: Math.round((Date.now() - frontend.pm2_env.pm_uptime) / 1000 / 60) + ' min',
      memoryMb: (frontend.monit.memory / 1024 / 1024).toFixed(1) + ' MB',
      cpu: frontend.monit.cpu + '%',
      restarts: frontend.pm2_env.restart_time
    };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}

async function run() {
  console.log('\x1b[1m\x1b[36m======================================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m   🩺 ARECOFIX PRODUCTION HEALTHCHECK & STATUS MONITOR\x1b[0m');
  console.log('\x1b[1m\x1b[36m======================================================================\x1b[0m\n');

  console.log(`📡 Consultando endpoint público: \x1b[4m${TARGET_URL}\x1b[0m...`);
  const httpResult = await checkHttp(TARGET_URL);

  if (httpResult.ok) {
    console.log(`\x1b[32m✔ HTTP Status:\x1b[0m ${httpResult.statusCode} OK`);
    console.log(`\x1b[32m✔ Latencia:\x1b[0m    ${httpResult.latencyMs} ms`);
    if (httpResult.headers['server']) {
      console.log(`\x1b[32m✔ Servidor:\x1b[0m    ${httpResult.headers['server']}`);
    }
  } else {
    console.log(`\x1b[31m✖ HTTP Falló:\x1b[0m  ${httpResult.statusCode || httpResult.error}`);
    console.log(`\x1b[31m✖ Latencia:\x1b[0m    ${httpResult.latencyMs} ms`);
  }

  console.log('\n🖥️  Consultando estado de PM2 en la VPS...');
  const pm2Result = checkRemotePm2();

  if (pm2Result.ok) {
    console.log(`\x1b[32m✔ PM2 Estado:\x1b[0m  ${pm2Result.status.toUpperCase()}`);
    console.log(`\x1b[32m✔ Memoria:\x1b[0m     ${pm2Result.memoryMb}`);
    console.log(`\x1b[32m✔ CPU:\x1b[0m         ${pm2Result.cpu}`);
    console.log(`\x1b[32m✔ Uptime:\x1b[0m      ${pm2Result.uptime}`);
    console.log(`\x1b[32m✔ Reinicios:\x1b[0m   ${pm2Result.restarts}`);
  } else {
    console.log(`\x1b[33m⚠ Info PM2:\x1b[0m    ${pm2Result.message}`);
  }

  console.log('\n\x1b[36m======================================================================\x1b[0m');
  if (httpResult.ok) {
    console.log('\x1b[1m\x1b[32m[PASS] El sistema se encuentra OPERATIVO y respondiendo en producción.\x1b[0m\n');
    process.exit(0);
  } else {
    console.log('\x1b[1m\x1b[31m[FAIL] El sistema presenta fallas o no responde.\x1b[0m\n');
    process.exit(1);
  }
}

run();

# 🚀 Arecofix - Production DevOps & Deployment Runbook

> **Complete SRE Guide: Automated Deployment, PM2 Process Management, Nginx, and Rollback Procedures.**

---

## 🎯 Quick Command Cheat-Sheet

The entire production deployment pipeline has been engineered down to **1 single master command**:

| Action | Command | Purpose |
|--------|---------|---------|
| **Master Production Deploy** | `pnpm run deploy` | Compiles Angular 21 SSR, packages tarball, creates remote backup on VPS, uploads via SCP, extracts, reloads PM2, and runs automated healthcheck with auto-rollback. |
| **Fast Deploy (Skip Build)** | `pnpm run deploy:quick` | Deploys existing `dist/` directly without rebuilding locally (useful for quick server config sync). |
| **Emergency Rollback** | `pnpm run deploy:rollback` | Reverts `dist/` on VPS to `dist_backup` immediately and restarts PM2 in < 2 seconds. |
| **Healthcheck & Latency** | `pnpm run healthcheck` | Tests live HTTP status, latency, Cloudflare headers, and PM2 memory/CPU statistics. |
| **View Remote PM2 Status** | `pnpm run pm2:status` | Shows status of all running apps on the VPS. |
| **Live Remote Server Logs** | `pnpm run pm2:logs` | Streams live output and error logs from the Node.js SSR server. |
| **Restart Remote Server** | `pnpm run pm2:restart` | Gracefully reloads the `arecofix-frontend` PM2 worker. |

---

## 🏗️ Production Infrastructure Topology

```
Internet (Clients)
       │
       ▼
Cloudflare CDN / WAF / SSL (arecofix.com.ar)
       │ (Authenticated Origin Pull / Full Strict SSL)
       ▼
Oracle Cloud VPS (Ubuntu Linux)
  ├── Port 22:   SSH Tunnel (ssh.arecofix.com.ar)
  ├── Port 80:   HTTP (Redirects to HTTPS)
  ├── Port 443:  Nginx Reverse Proxy
  │     ├── Static Cache -> /home/ubuntu/arecofix/dist/arecofix/browser
  │     ├── Proxy Pass -> http://127.0.0.1:4000 (Angular SSR Node.js / Express)
  │     └── Proxy Pass -> http://127.0.0.1:5000 (Flask Sync Engine API)
  └── PM2 Cluster Manager
        └── App: arecofix-frontend (Managed by ecosystem.config.cjs)
```

---

## 🔄 Deployment Flow Detail (`pnpm run deploy`)

The orchestrator script [scripts/deploy.mjs](file:///c:/git/Arecofixpage/scripts/deploy.mjs) executes the following sequence:

1. **SSH Authentication Verification**: Validates presence and permissions of the RSA deployment key.
2. **Production Compilation**: Executes `ng build --configuration production` (generating SSR server and client bundles).
3. **Atomic Tarball Packaging**: Compresses `dist/arecofix` into `dist.tar.gz` (reducing transfer time by ~85% compared to multi-file rsync).
4. **Remote Snapshot (Backup)**: Copies existing live bundle to `/home/ubuntu/arecofix/dist_backup/arecofix`.
5. **Secure SCP Transfer**: Transmits `dist.tar.gz` over the SSH tunnel.
6. **Remote In-Place Extraction**: Extracts files and rotates production assets cleanly.
7. **Zero-Downtime PM2 Reload**: Runs `pm2 reload arecofix-frontend`. If not already started, starts it.
8. **Automated Healthcheck**: Tests `https://arecofix.com.ar` with retries.
   - If `HTTP 200/301`: Deployment declared successful!
   - If failed: Automatically initiates **instant rollback** from `dist_backup` and alerts the engineer.

---

## ⚙️ PM2 Configuration (`ecosystem.config.cjs`)

The PM2 process manager runs the SSR server with automated memory safeguards:

```javascript
module.exports = {
  apps: [
    {
      name: 'arecofix-frontend',
      script: 'dist/arecofix/server/server.mjs',
      cwd: '/home/ubuntu/arecofix',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '600M',
      autorestart: true,
      max_restarts: 15,
      restart_delay: 2500,
      time: true,
      env: {
        PORT: 4000,
        NODE_ENV: 'production',
        HOST: '0.0.0.0'
      },
      env_file: '/home/ubuntu/arecofix/.env'
    }
  ]
};
```

---

## 🌐 Nginx Configuration

The production reverse proxy template is maintained in [docs/nginx/arecofix.conf](file:///c:/git/Arecofixpage/docs/nginx/arecofix.conf):

- **Cloudflare Real-IP Restoration**: Automatically parses Cloudflare IP ranges so logs and rate limits reflect real client IPs.
- **Micro-caching of Static Assets**: Immutable cache headers (`Cache-Control: "public, max-age=31536000, immutable"`) for hashed bundles.
- **Service Worker / PWA Safeguards**: Prevents caching `ngsw.json` and `manifest.webmanifest` to ensure users always receive instant client updates.
- **Gzip & Security Headers**: HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy.

---

## 🔐 Environment Variables & Secrets Management

Production secrets reside on the VPS at `/home/ubuntu/arecofix/.env` and are never committed to Git:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Local SSR port | `4000` |
| `NODE_ENV` | Runtime environment | `production` |
| `SUPABASE_URL` | Self-hosted PostgREST endpoint | `https://db.arecofix.com.ar` |
| `SUPABASE_KEY` | Public Anon JWT | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Service Role JWT (Backend only) | `eyJhbGci...` |
| `R2_BUCKET_NAME` | Cloudflare R2 bucket for images | `arecofix-assets` |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 API Key | `4a8f...` |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 Secret | `9b12...` |

See [.env.example](file:///c:/git/Arecofixpage/.env.example) for the full list of configurable options.

---

## 🆘 Disaster Recovery & Troubleshooting

### Issue 1: PM2 process crashing continuously
Check the error logs:
```bash
pnpm run pm2:logs
```
If memory limits are exceeded or port 4000 is occupied:
```bash
ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar "pm2 restart arecofix-frontend --update-env"
```

### Issue 2: Immediate rollback needed
Run the automated rollback command:
```bash
pnpm run deploy:rollback
```
This restores the backup copy taken right before the last deployment and restarts PM2 in seconds.

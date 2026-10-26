/**
 * ==============================================================================
 * ARECOFIX - PM2 STAGING PROCESS CONFIGURATION (ecosystem.staging.config.cjs)
 * ==============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'arecofix-frontend-staging',
      script: 'server-init.mjs',
      cwd: '/home/ubuntu/arecofix-staging',
      exec_mode: 'cluster',
      instances: 2,
      max_memory_restart: '400M',
      autorestart: true,
      time: true,
      merge_logs: true,
      error_file: '/home/ubuntu/.pm2/logs/arecofix-frontend-staging-error.log',
      out_file: '/home/ubuntu/.pm2/logs/arecofix-frontend-staging-out.log',
      env: {
        PORT: 4001,
        NODE_ENV: 'staging',
        HOST: '0.0.0.0',
        SUPABASE_URL: 'http://localhost:8002',
        DATABASE_URL: 'postgresql://postgres:eze321_staging@localhost:5433/postgres',
        NG_ALLOWED_HOSTS: 'arecofix.com.ar,www.arecofix.com.ar,staging.arecofix.com.ar,137.131.131.98,localhost,127.0.0.1'
      }
    }
  ]
};

module.exports = {
  apps: [
    {
      name: 'arecofix-frontend',
      script: './server-init.mjs',
    cwd: './',
      instances: 1,
      exec_mode: 'fork',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'arecofix-backend',
      cwd: './Back-End',
      script: './venv/bin/python',
      args: 'app.py',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
      env_file: '../.env',
      env: {
        FLASK_ENV: 'production'
      }
    },
    {
      name: 'arecofix-ai-worker',
      cwd: './Back-End',
      script: './venv/bin/python',
      args: 'scripts/ai_enrichment_worker.py',
      instances: 1,
      exec_mode: 'fork',
      interpreter: 'none',
      env_file: '../.env',
      env: {
        PYTHONUNBUFFERED: '1'
      }
    }
  ]
};

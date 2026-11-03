/**
 * ==============================================================================
 * ARECOFIX - PM2 PROCESS MANAGEMENT CONFIGURATION (ecosystem.config.cjs)
 * ==============================================================================
 * Configuración para el despliegue del servidor SSR de Angular en la VPS.
 * 
 * Uso:
 *   pm2 start ecosystem.config.cjs
 *   pm2 reload ecosystem.config.cjs --update-env
 *   pm2 status
 *   pm2 logs arecofix-frontend
 * ==============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'arecofix-frontend',
      script: 'server-init.mjs',
      cwd: '/home/ubuntu/arecofix',
      
      // Modo de ejecución: cluster con 2 workers para zero-downtime y alta disponibilidad
      exec_mode: 'cluster',
      instances: 2,

      // Gestión de memoria y reinicio: reiniciar si un worker supera 400 MB
      max_memory_restart: '400M',
      autorestart: true,
      max_restarts: 15,
      restart_delay: 2500,
      exp_backoff_restart_delay: 100,

      // Timeouts de salud
      kill_timeout: 5000,
      listen_timeout: 8000,

      // Monitoreo y Logging estructurado
      time: true,
      merge_logs: true,
      error_file: '/home/ubuntu/.pm2/logs/arecofix-frontend-error.log',
      out_file: '/home/ubuntu/.pm2/logs/arecofix-frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Variables de entorno por defecto (Producción)
      env: {
        PORT: 4000,
        NODE_ENV: 'production',
        HOST: '0.0.0.0'
      },

      // Soporte para variables desde archivo en la VPS
      env_file: '/home/ubuntu/arecofix/.env'
    }
  ]
};

#!/usr/bin/env bash
# ==============================================================================
# ARECOFIX - VPS PROVISIONING & SETUP AUTOMATION SCRIPT (scripts/setup-vps.sh)
# ==============================================================================
# Automatiza el aprovisionamiento de una nueva VPS en Ubuntu 22.04 / 24.04 LTS
# para ejecutar Arecofix (Angular 21 SSR + Express + PM2 + Nginx).
#
# Uso en la VPS:
#   chmod +x setup-vps.sh
#   sudo ./setup-vps.sh
# ==============================================================================

set -euo pipefail

echo "======================================================================"
echo "   🚀 Arecofix VPS Initial Setup & Provisioning"
echo "======================================================================"

# 1. Actualización del sistema base
echo "--> Actualizando repositorios del sistema..."
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git build-essential ufw fail2ban unzip htop rsync

# 2. Configuración de Firewall UFW
echo "--> Configurando UFW Firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw --force enable

# 3. Instalación de Node.js 22 LTS y pnpm
echo "--> Instalando Node.js 22 LTS y pnpm..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

corepack enable
corepack prepare pnpm@latest --activate

# 4. Instalación de PM2 global con módulo de logrotate
echo "--> Instalando PM2 y configurando rotación de logs..."
npm install -g pm2
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true

# 5. Instalación y configuración de Nginx
echo "--> Instalando Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# 6. Creación de directorios del proyecto
echo "--> Creando directorios para Arecofix..."
mkdir -p /home/ubuntu/arecofix/dist
mkdir -p /home/ubuntu/arecofix/dist_backup
chown -R ubuntu:ubuntu /home/ubuntu/arecofix

# 7. Configuración de inicio automático de PM2
echo "--> Configurando PM2 startup para usuario ubuntu..."
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "======================================================================"
echo "✔ Servidor aprovisionado con éxito."
echo "Próximos pasos:"
echo " 1. Copiar 'docs/nginx/arecofix.conf' a '/etc/nginx/sites-available/arecofix.conf'"
echo " 2. Enlazar: ln -s /etc/nginx/sites-available/arecofix.conf /etc/nginx/sites-enabled/"
echo " 3. Probar y reiniciar: nginx -t && systemctl reload nginx"
echo " 4. Subir archivo .env a /home/ubuntu/arecofix/.env"
echo " 5. Iniciar PM2: pm2 start ecosystem.config.cjs && pm2 save"
echo "======================================================================"

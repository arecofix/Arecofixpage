#!/bin/bash
# ==============================================================================
# Arecofix - Procedimiento de Rollback Automático para Rotación de JWT_SECRET
# Tiempo estimado de ejecución: < 45 segundos
# ==============================================================================
set -euo pipefail

BASE_DIR="${BASE_DIR:-/home/ubuntu/arecofix}"
BACKUP_DIR="${BASE_DIR}/backups/jwt_rotation_backup"
API_URL="${API_URL:-https://db.arecofix.com.ar}"
PM2_APP="${PM2_APP:-arecofix-frontend}"
N8N_URL="${N8N_URL:-http://127.0.0.1:5678/healthz}"

OLD_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg4NDUxOTI2LCJleHAiOjIxMDM4MTE5MjZ9.nZqQkOuevPpgU9Z4hOMwE5IBz1WinSKiBhcRI0fQkCs"
OLD_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjUwMDAwMDAwMH0.ggSddJmlqMhwsk_qnukbkeF-zaoDcpwdE8DZYdlR6no"
OLD_ANON_PREFIX="nZqQkOuevPpgU9Z4hOMwE5IBz1WinSKiBhcRI0fQkCs"

action="${1:-backup}"

case "$action" in
  backup)
    echo "[+] Creando snapshot de contingencia en ${BACKUP_DIR}..."
    mkdir -p "${BACKUP_DIR}"
    cp "${BASE_DIR}/docker-compose.yml" "${BACKUP_DIR}/docker-compose.yml"
    if [ -f "${BASE_DIR}/supabase/kong.yml" ]; then
      cp "${BASE_DIR}/supabase/kong.yml" "${BACKUP_DIR}/kong.yml"
    elif [ -f "${BASE_DIR}/kong.yml" ]; then
      cp "${BASE_DIR}/kong.yml" "${BACKUP_DIR}/kong.yml"
    fi
    cp "${BASE_DIR}/.env" "${BACKUP_DIR}/.env"
    if [ -d "${BASE_DIR}/dist" ]; then
      rm -rf "${BACKUP_DIR}/dist"
      cp -r "${BASE_DIR}/dist" "${BACKUP_DIR}/dist"
    fi
    echo "[✓] Snapshot creado exitosamente en ${BACKUP_DIR}."
    ;;

  restore)
    echo "[!] INICIANDO ROLLBACK DE EMERGENCIA (< 2 MIN)..."
    if [ ! -d "${BACKUP_DIR}" ]; then
      echo "[-] ERROR: Directorio de snapshot ${BACKUP_DIR} no encontrado!"
      exit 1
    fi

    echo "[1/4] Restaurando archivos de configuración..."
    cp "${BACKUP_DIR}/docker-compose.yml" "${BASE_DIR}/docker-compose.yml"
    if [ -f "${BASE_DIR}/supabase/kong.yml" ]; then
      cp "${BACKUP_DIR}/kong.yml" "${BASE_DIR}/supabase/kong.yml"
    elif [ -f "${BASE_DIR}/kong.yml" ]; then
      cp "${BACKUP_DIR}/kong.yml" "${BASE_DIR}/kong.yml"
    fi
    cp "${BACKUP_DIR}/.env" "${BASE_DIR}/.env"
    if [ -d "${BACKUP_DIR}/dist" ]; then
      rm -rf "${BASE_DIR}/dist"
      cp -r "${BACKUP_DIR}/dist" "${BASE_DIR}/dist"
    fi

    echo "[2/4] Reiniciando servicios supabase rest y auth..."
    if [[ "${BASE_DIR}" == *"staging"* ]]; then
      PROJECT_NAME="supabase-staging"
    else
      PROJECT_NAME="arecofix"
    fi
    (cd "${BASE_DIR}" && docker compose -p "${PROJECT_NAME}" up -d --force-recreate rest auth kong)
    sleep 3

    echo "[3/4] Reiniciando servicio PM2: ${PM2_APP}..."
    pm2 restart "${PM2_APP}"

    echo "[4/4] Ejecutando batería exhaustiva de verificaciones post-rollback..."

    # Verificación 1: OLD_ANON_KEY contra /rest/v1/orders
    HTTP_CODE_ANON=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "apikey: ${OLD_ANON_KEY}" \
      -H "Authorization: Bearer ${OLD_ANON_KEY}" \
      "${API_URL}/rest/v1/orders?limit=1")

    if [ "$HTTP_CODE_ANON" = "200" ] || [ "$HTTP_CODE_ANON" = "206" ]; then
      echo "[✓] Verificación 1: OLD_ANON_KEY contra ${API_URL}/rest/v1/orders respondió HTTP ${HTTP_CODE_ANON}."
    else
      echo "[-] ERROR Verificación 1: Falló OLD_ANON_KEY contra /orders (HTTP ${HTTP_CODE_ANON})."
      exit 1
    fi

    # Verificación 2: OLD_SERVICE_ROLE_KEY contra /rest/v1/orders
    HTTP_CODE_SERVICE_ORDERS=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "apikey: ${OLD_SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${OLD_SERVICE_ROLE_KEY}" \
      "${API_URL}/rest/v1/orders?limit=1")

    if [ "$HTTP_CODE_SERVICE_ORDERS" = "200" ] || [ "$HTTP_CODE_SERVICE_ORDERS" = "206" ]; then
      echo "[✓] Verificación 2: OLD_SERVICE_ROLE_KEY contra ${API_URL}/rest/v1/orders respondió HTTP ${HTTP_CODE_SERVICE_ORDERS}."
    else
      echo "[-] ERROR Verificación 2: Falló OLD_SERVICE_ROLE_KEY contra /orders (HTTP ${HTTP_CODE_SERVICE_ORDERS})."
      exit 1
    fi

    # Verificación 3: OLD_SERVICE_ROLE_KEY contra /rest/v1/knowledge_base
    HTTP_CODE_SERVICE_KB=$(curl -s -o /dev/null -w "%{http_code}" \
      -H "apikey: ${OLD_SERVICE_ROLE_KEY}" \
      -H "Authorization: Bearer ${OLD_SERVICE_ROLE_KEY}" \
      "${API_URL}/rest/v1/knowledge_base?limit=1")

    if [ "$HTTP_CODE_SERVICE_KB" = "200" ] || [ "$HTTP_CODE_SERVICE_KB" = "206" ]; then
      echo "[✓] Verificación 3: OLD_SERVICE_ROLE_KEY contra ${API_URL}/rest/v1/knowledge_base respondió HTTP ${HTTP_CODE_SERVICE_KB}."
    else
      echo "[-] ERROR Verificación 3: Falló OLD_SERVICE_ROLE_KEY contra /knowledge_base (HTTP ${HTTP_CODE_SERVICE_KB})."
      exit 1
    fi

    # Verificación 4: n8n healthz
    HTTP_CODE_N8N=$(curl -s -o /dev/null -w "%{http_code}" "${N8N_URL}")

    if [ "$HTTP_CODE_N8N" = "200" ]; then
      echo "[✓] Verificación 4: n8n respondió HTTP 200 en ${N8N_URL}."
    else
      echo "[-] ERROR Verificación 4: n8n no está respondiendo 200 (HTTP ${HTTP_CODE_N8N})."
      exit 1
    fi

    # Verificación 5: dist/ restaurado referencia OLD_ANON_KEY
    if [ -d "${BASE_DIR}/dist/arecofix/browser" ]; then
      ANON_COUNT=$(grep -rn "${OLD_ANON_PREFIX}" "${BASE_DIR}/dist/arecofix/browser"/*.js 2>/dev/null | wc -l || echo 0)
      if [ "$ANON_COUNT" -gt 0 ]; then
        echo "[✓] Verificación 5: dist/arecofix/browser contiene ${ANON_COUNT} ocurrencia(s) de OLD_ANON_KEY."
      else
        echo "[-] ERROR Verificación 5: dist/ restaurado NO contiene la clave original OLD_ANON_KEY."
        exit 1
      fi
    else
      echo "[!] Verificación 5 omitida: No existe directorio browser en ${BASE_DIR}/dist."
    fi

    echo "[✓] ROLLBACK EXITOSO: Todas las verificaciones pasaron satisfactoriamente."
    exit 0
    ;;

  *)
    echo "Uso: $0 {backup|restore}"
    exit 1
    ;;
esac

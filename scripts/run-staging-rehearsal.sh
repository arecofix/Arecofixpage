#!/bin/bash
set -euo pipefail

echo "=============================================================================="
echo "ENSAYO DE ROTACIÓN Y ROLLBACK COMPLETO EN AMBIENTE STAGING"
echo "=============================================================================="

STAGING_DIR="/home/ubuntu/arecofix-staging"
STAGING_API="http://127.0.0.1:8002"
PM2_STAGING="arecofix-frontend-staging"
N8N_HEALTH="http://127.0.0.1:5678/healthz"

OLD_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzg4NDUxOTI2LCJleHAiOjIxMDM4MTE5MjZ9.nZqQkOuevPpgU9Z4hOMwE5IBz1WinSKiBhcRI0fQkCs"
OLD_SERVICE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjUwMDAwMDAwMH0.ggSddJmlqMhwsk_qnukbkeF-zaoDcpwdE8DZYdlR6no"

echo "[PASO 1] Creando backup snapshot en staging..."
BASE_DIR="${STAGING_DIR}" "${STAGING_DIR}/rollback.sh" backup

echo "[PASO 2] Generando nuevo JWT_SECRET y nuevas claves temporales para staging..."
KEYS_JSON=$(/home/ubuntu/arecofix/generate-jwt.py "staging-rehearsal-secret-jwt-key-32-chars-long-2026")
NEW_ANON=$(python3 -c "import json, sys; print(json.loads(sys.stdin.read())['anon_key'])" <<< "${KEYS_JSON}")
NEW_SERVICE=$(python3 -c "import json, sys; print(json.loads(sys.stdin.read())['service_role_key'])" <<< "${KEYS_JSON}")
echo "Nueva ANON_KEY (staging): ${NEW_ANON:0:30}..."
echo "Nueva SERVICE_ROLE_KEY (staging): ${NEW_SERVICE:0:30}..."

echo "[PASO 3] Aplicando nuevo JWT_SECRET en docker-compose.yml de staging..."
sed -i 's/PGRST_JWT_SECRET: .*/PGRST_JWT_SECRET: staging-rehearsal-secret-jwt-key-32-chars-long-2026/' "${STAGING_DIR}/docker-compose.yml"
sed -i 's/GOTRUE_JWT_SECRET: .*/GOTRUE_JWT_SECRET: staging-rehearsal-secret-jwt-key-32-chars-long-2026/' "${STAGING_DIR}/docker-compose.yml"

echo "[PASO 4] Reiniciando supabase-staging-rest, supabase-staging-auth y supabase-staging-kong..."
(cd "${STAGING_DIR}" && docker compose -p supabase-staging up -d --force-recreate rest auth kong)
sleep 3

echo "[PASO 5] Verificando invalidación de claves viejas y aceptación de nuevas..."
CODE_OLD_ANON=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: ${OLD_ANON}" -H "Authorization: Bearer ${OLD_ANON}" "${STAGING_API}/rest/v1/orders?limit=1")
echo "OLD ANON_KEY respuesta HTTP: ${CODE_OLD_ANON} (Esperado: 401)"

CODE_NEW_ANON=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: ${NEW_ANON}" -H "Authorization: Bearer ${NEW_ANON}" "${STAGING_API}/rest/v1/orders?limit=1")
echo "NEW ANON_KEY respuesta HTTP: ${CODE_NEW_ANON} (Esperado: 200)"

CODE_OLD_SERVICE=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: ${OLD_SERVICE}" -H "Authorization: Bearer ${OLD_SERVICE}" "${STAGING_API}/rest/v1/orders?limit=1")
echo "OLD SERVICE_ROLE_KEY respuesta HTTP: ${CODE_OLD_SERVICE} (Esperado: 401)"

CODE_NEW_SERVICE=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: ${NEW_SERVICE}" -H "Authorization: Bearer ${NEW_SERVICE}" "${STAGING_API}/rest/v1/orders?limit=1")
echo "NEW SERVICE_ROLE_KEY respuesta HTTP: ${CODE_NEW_SERVICE} (Esperado: 200)"

if [ "$CODE_OLD_ANON" != "401" ] || [ "$CODE_NEW_ANON" != "200" ] || [ "$CODE_OLD_SERVICE" != "401" ] || [ "$CODE_NEW_SERVICE" != "200" ]; then
  echo "[-] ERROR EN VERIFICACIÓN DE CLAVES DE STAGING. Abortando ensayo."
  exit 1
fi
echo "[✓] Comprobado: Claves viejas retornan 401. Claves nuevas retornan 200."

echo "[PASO 6] Ejecutando rollback.sh restore en staging..."
BASE_DIR="${STAGING_DIR}" API_URL="${STAGING_API}" PM2_APP="${PM2_STAGING}" N8N_URL="${N8N_HEALTH}" "${STAGING_DIR}/rollback.sh" restore

echo "=============================================================================="
echo "ENSAYO DE STAGING FINALIZADO CON ÉXITO TOTAL"
echo "=============================================================================="

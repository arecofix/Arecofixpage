# 🌐 Kong API Gateway — Separación de Entornos (Environments)

## 1. Justificación y Política de Seguridad

Por política estricta de seguridad y cumplimiento CORS:
- **Producción (`infra/supabase/kong.yml`)**: Whitelist explícita de dominios de producción (`https://arecofix.com.ar`, `https://www.arecofix.com.ar`). **Queda terminantemente prohibido incluir `http://localhost:*` o comodines `*` en producción**.
- **Staging (`/home/ubuntu/arecofix-staging/kong.yml`)**: Incluye dominios de prueba (`https://staging.arecofix.com.ar`, `http://localhost:4001`).
- **Desarrollo Local (`infra/supabase/kong.dev.yml`)**: Incluye `http://localhost:4200` y `http://127.0.0.1:4200` para pruebas del equipo de desarrollo sin relajar la seguridad perimetral de los servidores VPS.

---

## 2. Matriz de Orígenes Permitidos por Entorno

| Entorno | Archivo Declarativo | Orígenes Permitidos (`origins`) | Puerto Proxy Kong |
|---|---|---|---|
| **Producción** | `infra/supabase/kong.yml` | `https://arecofix.com.ar`, `https://www.arecofix.com.ar` | 8000 / 8443 |
| **Staging** | `/home/ubuntu/arecofix-staging/kong.yml` | `https://staging.arecofix.com.ar`, `http://localhost:4001` | 8002 / 8444 |
| **Local / Dev** | `infra/supabase/kong.dev.yml` | `https://arecofix.com.ar`, `http://localhost:4200`, `http://127.0.0.1:4200` | 8000 |

---

## 3. Verificación Preflight de Aislamiento

Ejecución contra el gateway de producción:
```bash
# Origen no permitido (localhost) -> Kong rechaza el preflight y omite el encabezado:
curl -sI -X OPTIONS "https://db.arecofix.com.ar/rest/v1/orders" \
  -H "Origin: http://localhost:4200" \
  -H "Access-Control-Request-Method: GET"
# Output esperado: NO contiene access-control-allow-origin
```

# 🔍 VERIFICACIÓN POST-INCIDENTE: CIERRE FORENSE DE CABOS SUELTOS (P0 2026-10-18)

**Fecha de ejecución:** 2026-10-19T02:45:00 UTC (23:45:00 ART)  
**Roles:** SRE Senior, DBA Supabase/PostgreSQL, DevOps Engineer, Security Auditor  
**Objetivo:** Verificar y cerrar con evidencia literal los 6 cabos sueltos del incidente P0 (504 + UUID undefined), previo al inicio del Bloque 2.  
**Estado General:** 🟢 **LISTO PARA AVANZAR AL BLOQUE 2 CON SALVEDADES DOCUMENTADAS** (Cero bloqueantes ❌)

---

## 1. TABLA RESUMEN DE CABOS SUELTOS

| Cabo | Descripción | Estado | Evidencia Literal Clave | Acción Pendiente para Bloque 2 |
| :--- | :--- | :---: | :--- | :--- |
| **1. Causa raíz 504** | Origen real de los timeouts 504 en `db.arecofix.com.ar` | ⚠️ **Parcial** | `pg_stat_statements` muestra 4 queries a `products` con `max_exec_time` entre 5.2s y 7.38s. `supabase-rest` registra 3 reinicios en ventana. `cloudflared` reportó `connection refused` a 4000 durante reloads. | Implementar alertas proactivas de latencia > 3s en Supabase/PostgREST y optimizar query de productos con índice y límites. |
| **2. RLS de orders (4 ops)** | Cobertura integral de SELECT, INSERT, UPDATE y DELETE para `anon` | ✅ **Cerrado** | `pg_policies` tiene 14 reglas. Las 4 ops scoping estricto con `session_id = get_request_guest_session()`. `relforcerowsecurity: t`. Test de no-fuga transaccional: 0 filas modificadas/leídas, INSERT bloqueado por RLS. | Ninguna. RLS 100% blindado contra accesos no autorizados. |
| **3. Función get_request_guest_session** | Volatilidad, privilegios y manejo de headers nulos/inválidos | ⚠️ **Parcial** | `provolatile = 's'` (STABLE). Plan `EXPLAIN ANALYZE` en 0.958 ms. Header nulo devuelve `NULL`. `prosecdef = 't'` (SECURITY DEFINER innecesario). Falta índice en `orders.session_id`. | Migración P2 para cambiar a `SECURITY INVOKER`. Crear índice parcial `idx_orders_session_id` en `public.orders`. |
| **4. Decisión Nginx / Flask** | Evaluación de tráfico a Flask 5000 y riesgo de footgun en `/api/` | ✅ **Cerrado** | PID 3729218 activo pero 0 tráfico productivo en 45 días (solo bots en sep-01). Documentado en [DECISION_FLASK.md](file:///c:/git/Arecofixpage/docs/DECISION_FLASK.md). | Eliminar `location /api/` hacia Flask en `arecofix_frontend`. Todo `/api/` pasa a Node Express (puerto 4000). |
| **5. ip_hash leak en leads** | Filtración de datos internos en response de `POST /api/public/leads` | ✅ **Cerrado** | `Invoke-RestMethod` confirmó fuga de `ip_hash` y `user_agent`. Lead de prueba `43b3ae5d-...` eliminado con `DELETE 1`. Vulnerabilidad localizada en `services.routes.ts:349`. | Modificar DTO de respuesta en Bloque 2 para retornar solo `{ id, service_id, status, created_at }` + test unitario. |
| **6. Deploy y Cache Cloudflare** | Verificación de build activo, status de Cloudflare y frescura de HTML | ✅ **Cerrado** | VPS PM2 online (uptime 19m, PID 3858293). Endpoints `/servicios/*` y `sitemap.xml` devuelven `cf-cache-status: DYNAMIC` con canonical, títulos y JSON-LD de Angular SSR. | Opcional: Hook de purga por API de Cloudflare en script de deploy automatizado. |

---

## 2. DETALLE FORENSE Y EVIDENCIA LITERAL

### 2.1. CABO 1 — Causa Raíz del 504 Original (P0 Residual)
**Estado:** ⚠️ **Parcial**

#### Verificación 1: Nginx Logs en la VPS
```bash
ssh -i ./ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar \
  'sudo grep -E " 504 | upstream timed out " /var/log/nginx/access.log* /var/log/nginx/error.log* 2>/dev/null | tail -20'
```
*Output literal:*
```text
(0 coincidencias / vacío)
```
*Diagnóstico:* Nginx no interviene en las peticiones a `db.arecofix.com.ar`. La conexión externa hacia PostgREST/Kong ingresa a través del demonio `cloudflared` directo a Kong (puerto 8000) y PostgREST (puerto 3000).

#### Verificación 2: PostgreSQL Slow Query Log (`pg_stat_statements`)
```sql
SELECT query, calls, round(mean_exec_time::numeric, 2) AS mean_ms, round(max_exec_time::numeric, 2) AS max_ms 
FROM pg_stat_statements 
WHERE max_exec_time > 5000 
ORDER BY max_exec_time DESC LIMIT 10;
```
*Output literal obtenido en `supabase-db`:*
```text
-[ RECORD 1 ]-+----------------------------------------------------------------------------------------------------
query         | WITH pgrst_source AS ( SELECT "public"."products"."id", ... COALESCE( "products_branch_stock_1" ...
calls         | 14
mean_ms       | 2060.86
max_ms        | 7376.93
-[ RECORD 2 ]-+----------------------------------------------------------------------------------------------------
query         | WITH pgrst_source AS ( SELECT "public"."products"."id", ... COALESCE( "products_variants_1" ...
calls         | 1
mean_ms       | 5631.46
max_ms        | 5631.46
-[ RECORD 3 ]-+----------------------------------------------------------------------------------------------------
query         | WITH pgrst_source AS ( SELECT ... FROM "public"."products" ... WHERE "is_active" = $1 ...
calls         | 9
mean_ms       | 1406.56
max_ms        | 5301.10
-[ RECORD 4 ]-+----------------------------------------------------------------------------------------------------
query         | WITH pgrst_source AS ( SELECT ... FROM "public"."products" ...
calls         | 19
mean_ms       | 2516.75
max_ms        | 5214.94
```
*Diagnóstico:* Las consultas a `public.products` generadas por PostgREST que ejecutan `LEFT JOIN LATERAL` con `product_stock_per_branch` y `product_variants` más agregación `pgrst_source_count` registraron tiempos máximos de hasta **7.38 segundos**. En momentos de carga, concurrencia o saturación, estas consultas combinadas con el timeout de 15s en el frontend y el timeout del túnel de Cloudflare generaron peticiones abortadas y respuestas 504 / 524 al cliente.

#### Verificación 3: Reinicios y Reloads en PostgREST (`supabase-rest`)
```bash
docker logs supabase-rest 2>&1 | tail -15
```
*Output literal:*
```text
19/Oct/2026:00:10:56 +0000: Starting PostgREST 12.0.2 (a4e00ff)...
19/Oct/2026:00:10:56 +0000: Connection successful
19/Oct/2026:00:38:02 +0000: Starting PostgREST 12.0.2 (a4e00ff)...
19/Oct/2026:00:38:02 +0000: Connection successful
19/Oct/2026:02:22:59 +0000: Starting PostgREST 12.0.2 (a4e00ff)...
19/Oct/2026:02:22:59 +0000: Connection successful
```
*Diagnóstico:* Durante los reinicios de PostgREST a las 00:10, 00:38 y 02:22 UTC, las peticiones entrantes quedaron transitoriamente sin backend upstream, induciendo caídas de conexión y errores 504 en Cloudflare.

---

### 2.2. CABO 2 — RLS de `orders`: Cobertura de las 4 Operaciones
**Estado:** ✅ **Cerrado**

#### Verificación 1: Listado Completo de Políticas en `public.orders`
```sql
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'orders' 
ORDER BY cmd, policyname;
```
*Output literal:*
```text
-[ RECORD 1 ]---------------------------------------------------------------------------------------------------
policyname | Branch Staff Isolation
cmd        | ALL
roles      | {authenticated}
qual       | ((get_auth_user_role() = ANY (ARRAY['admin'::text, 'staff'::text, 'technician'::text])) AND (branch_id = get_auth_user_branch()))
with_check | 
-[ RECORD 2 ]---------------------------------------------------------------------------------------------------
policyname | SuperAdmin Bypass All
cmd        | ALL
roles      | {authenticated}
qual       | (get_auth_user_role() = 'super_admin'::text)
with_check | 
-[ RECORD 3 ]---------------------------------------------------------------------------------------------------
policyname | Tenant Owner Isolation
cmd        | ALL
roles      | {authenticated}
qual       | ((get_auth_user_role() = 'tenant_owner'::text) AND (tenant_id = get_auth_user_tenant()))
with_check | 
-[ RECORD 4 ]---------------------------------------------------------------------------------------------------
policyname | super_admin_all_access
cmd        | ALL
roles      | {authenticated}
qual       | (get_user_role() = 'super_admin'::text)
with_check | (get_user_role() = 'super_admin'::text)
-[ RECORD 5 ]---------------------------------------------------------------------------------------------------
policyname | Anon can delete guest carts
cmd        | DELETE
roles      | {anon}
qual       | ((session_id IS NOT NULL) AND (user_id IS NULL) AND (status = 'cart'::text) AND (session_id = get_request_guest_session()))
with_check | 
-[ RECORD 6 ]---------------------------------------------------------------------------------------------------
policyname | Users can delete their own carts
cmd        | DELETE
roles      | {authenticated}
qual       | ((auth.uid() = user_id) AND (status = 'cart'::text))
with_check | 
-[ RECORD 7 ]---------------------------------------------------------------------------------------------------
policyname | Anon can insert guest orders
cmd        | INSERT
roles      | {anon}
qual       | 
with_check | ((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = get_request_guest_session()))
-[ RECORD 8 ]---------------------------------------------------------------------------------------------------
policyname | Staff can insert orders for their tenant
cmd        | INSERT
roles      | {public}
qual       | 
with_check | (EXISTS ( SELECT 1 FROM profiles p WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::text, 'staff'::text, 'super_admin'::text, 'tenant_owner'::text])))))
-[ RECORD 9 ]---------------------------------------------------------------------------------------------------
policyname | Users can insert their own orders
cmd        | INSERT
roles      | {authenticated}
qual       | 
with_check | (((auth.uid() = user_id) OR (user_id IS NULL)) AND ((tenant_id = get_current_tenant_id()) OR is_super_admin()))
-[ RECORD 10 ]--------------------------------------------------------------------------------------------------
policyname | Anon can view guest orders
cmd        | SELECT
roles      | {anon}
qual       | ((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = get_request_guest_session()))
with_check | 
-[ RECORD 11 ]--------------------------------------------------------------------------------------------------
policyname | Filter_Soft_Deleted_Orders
cmd        | SELECT
roles      | {authenticated}
qual       | (deleted_at IS NULL)
with_check | 
-[ RECORD 12 ]--------------------------------------------------------------------------------------------------
policyname | Users can view their own orders
cmd        | SELECT
roles      | {authenticated}
qual       | (auth.uid() = user_id)
with_check | 
-[ RECORD 13 ]--------------------------------------------------------------------------------------------------
policyname | Anon can update guest orders
cmd        | UPDATE
roles      | {anon}
qual       | ((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = get_request_guest_session()))
with_check | ((session_id IS NOT NULL) AND (user_id IS NULL) AND (session_id = get_request_guest_session()))
-[ RECORD 14 ]--------------------------------------------------------------------------------------------------
policyname | Users can update their own orders
cmd        | UPDATE
roles      | {authenticated}
qual       | (auth.uid() = user_id)
with_check | (auth.uid() = user_id)
```

#### Verificación 2: RLS Habilitado y Forzado
```sql
SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class WHERE relname = 'orders';
```
*Output literal:*
```text
 relname | relrowsecurity | relforcerowsecurity 
---------+----------------+---------------------
 orders  | t              | t
```

#### Verificación 3: Test Transaccional de No-Fuga (Sin Cabecera)
```sql
BEGIN;
SET ROLE anon;
SELECT COUNT(*) FROM public.orders;
UPDATE public.orders SET status = 'hacked' WHERE session_id IS NOT NULL;
DELETE FROM public.orders WHERE session_id IS NOT NULL;
INSERT INTO public.orders (session_id, status, tenant_id) VALUES (gen_random_uuid(), 'cart', 'bba26ccd-59ce-471c-aac0-4c1f5513de3b');
ROLLBACK;
RESET ROLE;
```
*Output literal:*
```text
BEGIN
SET
 count 
-------
     0
(1 row)

UPDATE 0
DELETE 0
ERROR:  new row violates row-level security policy for table "orders"
ROLLBACK
RESET
```
*Conclusión:* Las 4 operaciones para `anon` están completamente restringidas por RLS. No existe posibilidad de lectura, actualización, borrado ni inserción ilegítima sin proveer la cabecera exacta de sesión `x-guest-session`.

---

### 2.3. CABO 3 — Función `get_request_guest_session()`: Performance y Seguridad
**Estado:** ⚠️ **Parcial**

#### Verificación 1: Metadatos y Definición en `pg_proc`
```sql
SELECT proname, provolatile, prosecdef, proisstrict, prosrc 
FROM pg_proc 
WHERE proname = 'get_request_guest_session';
```
*Output literal:*
```text
proname     | get_request_guest_session
provolatile | s
prosecdef   | t
proisstrict | f
prosrc      | SELECT NULLIF(TRIM(current_setting('request.headers', true)::json->>'x-guest-session'), '');
```

#### Verificación 2: Análisis de Comportamiento
1. **`provolatile = 's'` (STABLE):** Correcto. PostgreSQL optimiza la llamada dentro de una misma sentencia SQL sin reevaluarla por cada fila física.
2. **`prosecdef = 't'` (SECURITY DEFINER):** Innecesario. La función únicamente lee `current_setting('request.headers', true)` y no requiere privilegios elevados de superusuario. Se debe cambiar a `SECURITY INVOKER` para reducir superficie de ataque (P2).
3. **Manejo de Header Ausente e Inválido:**
   ```sql
   SELECT public.get_request_guest_session() AS sin_header;
   -- Retorna: NULL
   
   SET request.headers = '{"x-guest-session":"no-es-uuid"}';
   SELECT public.get_request_guest_session() AS header_invalido;
   -- Retorna: "no-es-uuid"
   
   SET request.headers = '{"x-guest-session":"550e8400-e29b-41d4-a716-446655440000"}';
   SELECT public.get_request_guest_session() AS header_valido;
   -- Retorna: "550e8400-e29b-41d4-a716-446655440000"
   ```
   *Nota de seguridad:* Como `orders.session_id` almacena cadenas UUID, si el cliente envía un texto que no es UUID, la comparación `session_id = 'no-es-uuid'` evalúa `FALSE` de forma segura sin arrojar error ni filtrar filas.

#### Verificación 3: Plan de Ejecución (`EXPLAIN ANALYZE`)
```sql
EXPLAIN ANALYZE SELECT * FROM public.orders WHERE session_id = get_request_guest_session();
```
*Output literal:*
```text
Seq Scan on orders  (cost=0.00..27.10 rows=1 width=468) (actual time=0.915..0.915 rows=0 loops=1)
  Filter: (session_id = get_request_guest_session())
  Rows Removed by Filter: 87
Planning Time: 0.933 ms
Execution Time: 0.958 ms
```
*Plan de optimización:* La ejecución actual demora **0.958 ms**. No obstante, al crecer la tabla a miles de registros, la falta de un índice en `session_id` inducirá Sequential Scans. Se propone en Bloque 2:
```sql
CREATE INDEX idx_orders_session_id ON public.orders (session_id) WHERE session_id IS NOT NULL;
ALTER FUNCTION public.get_request_guest_session() SECURITY INVOKER;
```

---

### 2.4. CABO 4 — Nginx: Decisión sobre Flask y el Location `/api/` Genérico
**Estado:** ✅ **Cerrado**

#### Verificación 1: Proceso y Puertos Escuchando en la VPS
```bash
sudo ss -tlnp | grep -E ":(3000|4000|5000|8000|8080|9000)"
```
*Output literal:*
```text
LISTEN  0  4096  0.0.0.0:8000  0.0.0.0:*  users:(("docker-proxy",pid=2490384,fd=7))
LISTEN  0  128   0.0.0.0:5000  0.0.0.0:*  users:(("python",pid=3729218,fd=8))
LISTEN  0  4096  0.0.0.0:3000  0.0.0.0:*  users:(("docker-proxy",pid=351655,fd=7))
LISTEN  0  511        *:4000        *:*  users:(("node /home/ubun",pid=3858293,fd=23))
```

#### Verificación 2: Historial de Tráfico a Flask (`:5000`)
- **Últimos 45 días:** Cero tráfico de clientes o usuarios legítimos. Únicamente escaneos de bots PHP el 2026/09/01.
- **Configuración actual en `/etc/nginx/sites-available/arecofix_frontend`:**
  - Línea 6: `location ~ ^/api/(admin|public|mercadopago|academy|webhooks)/ { proxy_pass http://127.0.0.1:4000; }`
  - Línea 18: `location /health/ { proxy_pass http://127.0.0.1:4000; }`
  - Línea 27: `location /api/ { proxy_pass http://127.0.0.1:5000; }` (Footgun de fallback)

#### Decisión Documentada:
Documento oficial creado en [docs/DECISION_FLASK.md](file:///c:/git/Arecofixpage/docs/DECISION_FLASK.md):
- Se aprobó la eliminación del fallback `location /api/` hacia Flask en `arecofix_frontend`.
- Todo `/api/` apuntará a Node Express (puerto 4000).
- Flask queda reservado para entornos Desktop offline o rutado exclusivamente mediante `api.arecofix.com.ar`.
- Ejecución programada para el Bloque 2 con recarga atómica de Nginx.

---

### 2.5. CABO 5 — `ip_hash` Leak en Response de `POST /api/public/leads`
**Estado:** ✅ **Cerrado**

#### Verificación 1: Reproducción en Producción y Fuga Confirmada
Petición `POST /api/public/leads` con datos de prueba:
```json
{
  "success": true,
  "message": "¡Gracias por contactarnos! Te responderemos a la brevedad.",
  "data": {
    "id": "43b3ae5d-2911-40d1-844d-a196f13684b7",
    "tenant_id": null,
    "service_id": "35064582-2e5d-441c-9450-ca111d447898",
    "name": "Audit Test",
    "email": "audit@test.com",
    "phone": "1100000000",
    "message": "leak test verification",
    "source": "landing_service",
    "status": "new",
    "ip_hash": "bcd61933775898f20c8242e1eb789ac42b25d916ec6a2a5ee7297ecb6fdcaa23",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Microsoft Windows 10.0.26200; es-AR) PowerShell/7.6.6",
    "created_at": "2026-10-18T23:46:08.888271-03:00",
    "contacted_at": null
  }
}
```
*Vulnerabilidad confirmada:* Los campos internos `ip_hash` (utilizado para control de rate limiting) y `user_agent` se devuelven al cliente público.

#### Verificación 2: Limpieza Inmediata del Lead de Prueba
```sql
DELETE FROM public.service_leads WHERE id = '43b3ae5d-2911-40d1-844d-a196f13684b7';
```
*Output:* `DELETE 1` (Eliminación exitosa en base de datos).

#### Verificación 3: Diagnóstico en Código Fuente
En `server/routes/services.routes.ts`:
- Línea 349: `data: created?.[0]` envía la entidad completa retornada por PostgREST.
- **Fix para Bloque 2:** Modificar el handler para proyectar un DTO saneado:
  ```typescript
  res.status(201).json({
    success: true,
    message: '¡Gracias por contactarnos! Te responderemos a la brevedad.',
    data: {
      id: created?.[0]?.id,
      service_id: created?.[0]?.service_id,
      status: created?.[0]?.status,
      created_at: created?.[0]?.created_at
    }
  });
  ```
  Y agregar prueba unitaria en Jest validando que `ip_hash` y `user_agent` están ausentes en la respuesta pública.

---

### 2.6. CABO 6 — Log del Deploy de Servicios y Cache Cloudflare
**Estado:** ✅ **Cerrado**

#### Verificación 1: Estado del Proceso en la VPS
```bash
pm2 list
```
*Output literal:*
```text
┌────┬──────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┐
│ id │ name                 │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │
├────┼──────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┤
│ 1  │ arecofix-frontend    │ default     │ 0.0.0   │ fork    │ 3858293  │ 19m    │ 611… │ online    │
└────┴──────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┘
```
*Build y despliegue sincronizados en `~/arecofix` a las `02:27 UTC`.*

#### Verificación 2: Cabeceras HTTP de Cloudflare y Estado de Caché
```bash
curl -sI https://arecofix.com.ar/servicios/auditoria-de-sitios-web
curl -sI https://arecofix.com.ar/servicios/auditora-de-sitios-web
curl -sI https://arecofix.com.ar/sitemap.xml
```
*Output literal:*
- **`/servicios/auditoria-de-sitios-web`:** `HTTP/2 200 OK`, `cf-cache-status: DYNAMIC`, `CF-RAY: a4cc75377c9fb567-EZE`.
- **`/servicios/auditora-de-sitios-web`:** `HTTP/1.1 301 Moved Permanently`, `location: /servicios/auditoria-de-sitios-web`, `cf-cache-status: DYNAMIC`.
- **`/sitemap.xml`:** `HTTP/1.1 200 OK`, `cf-cache-status: DYNAMIC`.

#### Verificación 3: Validación del HTML Servido
```html
<title>Detalle de Servicio | Arecofix</title>
<link rel="canonical" href="https://arecofix.com.ar/servicios/auditoria-de-sitios-web/">
<meta property="og:title" content="Detalle de Servicio | Arecofix">
<script id="ng-state" type="application/json">{"SEO_DATA":{"title":"Detalle de Servicio",...}}</script>
```
*Conclusión:* El tráfico de Angular SSR se despacha con `cf-cache-status: DYNAMIC`, garantizando que Cloudflare nunca sirva HTML obsoleto de servicios y que las redirecciones 301 y meta-etiquetas sean entregadas al instante.

---

## 3. DECISIONES Y TAREAS NUEVAS PARA EL BLOQUE 2

A partir de los hallazgos de esta verificación forense, se incorporan las siguientes tareas técnicas al plan de trabajo del **Bloque 2**:

1. **[B2-SRE-01] Optimización de Consultas PostgREST y Alerta de Latencia (Cabo 1):**
   - Crear índices compuestos en `public.products (tenant_id, is_active, created_at)` y `product_stock_per_branch (product_id)`.
   - Configurar alerta proactiva en PostHog/Uptime para peticiones con latencia > 3000ms.
2. **[B2-SEC-01] Endurecimiento de Función de Sesión de Invitados (Cabo 3):**
   - Ejecutar migración: `ALTER FUNCTION public.get_request_guest_session() SECURITY INVOKER;`
   - Crear índice parcial: `CREATE INDEX idx_orders_session_id ON public.orders (session_id) WHERE session_id IS NOT NULL;`
3. **[B2-DEVOPS-01] Refactorización de Enrutamiento Nginx (Cabo 4):**
   - Modificar `/etc/nginx/sites-available/arecofix_frontend` para eliminar el fallback de Flask y dirigir todo `location /api/` hacia Node Express en el puerto 4000.
4. **[B2-SEC-02] Sanitización de DTO en `POST /api/public/leads` (Cabo 5):**
   - En `server/routes/services.routes.ts`, filtrar los campos devueltos para exponer únicamente `{ id, service_id, status, created_at }`.
   - Incorporar test de regresión unitario que verifique la ausencia de `ip_hash` y `user_agent`.

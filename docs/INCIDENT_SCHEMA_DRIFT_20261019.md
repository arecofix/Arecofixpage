# 🚨 Post-Mortem: Incidente P0 de Schema Drift en Carrito de Compras (2026-10-19)

**Fecha**: 2026-10-19  
**Severidad**: P0 (Bloqueo Total de Ventas y Agregado al Carrito)  
**Estado**: 🟢 **RESUELTO Y BLINDADO**  
**Tiempo de Resolución**: ~20 minutos  
**Equipo de Respuesta**: DBA Senior, SRE / DevOps, Senior Angular SSR, QA Automation, Security & Compliance  

---

## 1. Resumen Ejecutivo del Incidente

Los clientes en producción (`https://arecofix.com.ar`) reportaron imposibilidad absoluta para añadir productos al carrito de compras. Al presionar el botón *"Añadir al Carrito"*, la interfaz desplegaba dos notificaciones críticas de error:
1. `Error de esquema en la base de datos: columna inexistente (Column 'tracking_code' of relation 'orders' does not exist).`
2. `Error al agregar el producto al carrito.`

El servicio de ventas quedó completamente interrumpido debido a una discrepancia de esquema (**Schema Drift**): el código de la aplicación serializaba y consultaba la columna `tracking_code` en la tabla `public.orders`, pero dicha columna nunca había sido aprovisionada en la base de datos PostgreSQL de producción ni en su caché de PostgREST.

---

## 2. Cronología de los Hechos (Timeline)

- **12:05**: Detección del incidente por reportes de clientes bloqueados al comprar.
- **12:08**: **Diagnóstico Forense iniciado**:
  - `grep_search` confirmó que `OrderMapper.toPersistence` (línea 85) enviaba `tracking_code: order.tracking_code ?? null` y `supabase-cart.repository.ts` ejecutaba `select('*')`.
  - Inspección directa de `information_schema.columns` en PostgreSQL confirmó que la tabla `public.orders` poseía 26 columnas, pero **carecía** de `tracking_code`.
  - Curl directo a `https://db.arecofix.com.ar/rest/v1/orders?select=id,tracking_code&limit=1` arrojó error `400 Bad Request` (`code: "42703", message: "column orders.tracking_code does not exist"`).
- **12:15**: **Remediación Segura**:
  - Dump preventivo de esquema de `orders` (`orders_schema_backup_1792424003.sql`, 12 KB) y de datos (`orders_data_backup_1792424011.dump`, 23 KB).
  - Creación de migración idempotente `supabase/migrations/20261019020000_add_tracking_code_to_orders.sql` y su respectivo `_down.sql`.
  - Aplicación de migración en Staging (`localhost:5433`) y Producción (`localhost:5432`) mediante `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_code TEXT;` e índice `idx_orders_tracking_code`.
  - Recarga de esquema en PostgREST (`NOTIFY pgrst, 'reload schema'` y reinicio de `supabase-rest`).
- **12:20**: **Verificación Técnica**:
  - Curl a PostgREST devolvió `HTTP 200 OK` con `[{"id":"...","tracking_code":null}]`.
  - Simulación de inserción de carrito con `x-guest-session` devolvió `HTTP 201 Created` con payload íntegro.
- **12:24**: **Validación E2E en Navegador Real**:
  - Subagente de navegador ejecutó compra real en `https://arecofix.com.ar/productos`. Agregó "Bicicleta Firebird rod 29" al carrito.
  - Contador de carrito incrementó a **1**, notificación de éxito confirmada, cero errores de esquema en consola y pantalla.
- **12:35**: **Blindaje Estructural**:
  - Creación de `scripts/verify-schema.mjs` para auditoría pre-deploy de contratos de esquema.
  - Reemplazo de consultas `select('*')` por `ORDER_SELECT_COLUMNS` en `supabase-cart.repository.ts`.
  - Integración obligatoria del verificador de esquema en `.github/workflows/deploy.yml` y `scripts/deploy.mjs`.

---

## 3. Causa Raíz (Root Cause Analysis - RCA)

1. **Desincronización de Contrato de Datos (Schema Drift)**:
   Se introdujo soporte para códigos de seguimiento de envío en la entidad de dominio `Order` (`src/app/features/orders/domain/entities/order.entity.ts`) y en `OrderMapper.toPersistence`. Sin embargo, la migración DDL correspondiente para la tabla `public.orders` no se incluyó en el flujo de despliegue ni se aplicó a la base de datos de producción.
2. **Uso de Comodín `select('*')`**:
   Las consultas de carrito en `supabase-cart.repository.ts` utilizaban `select('*')`. Al serializar el payload de inserción o intentar leer registros, PostgREST validó los campos contra su diccionario en memoria, rechazando la operación por columna desconocida.
3. **Ausencia de Pre-Deploy Schema Gate**:
   El pipeline de CI/CD ejecutaba pruebas unitarias y linters, pero carecía de una verificación automatizada que consultara la API REST real para validar que las columnas requeridas por el código estuvieran expuestas en el esquema.

---

## 4. Evidencias Literales de Diagnóstico y Resolución

### 4.1. Diagnóstico Inicial: Ausencia de la Columna en PostgreSQL
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'orders'
ORDER BY ordinal_position;
```
**Output literal:**
```text
    column_name    |        data_type         | is_nullable 
-------------------+--------------------------+-------------
 id                | uuid                     | NO
 order_number      | character varying        | NO
 user_id           | uuid                     | YES
 status            | text                     | YES
 total_amount      | numeric                  | NO
 payment_method    | text                     | YES
 shipping_address  | jsonb                    | YES
 created_at        | timestamp with time zone | NO
 notes             | text                     | YES
 discount          | numeric                  | YES
 tax               | numeric                  | YES
 subtotal          | numeric                  | YES
 total             | numeric                  | YES
 updated_at        | timestamp with time zone | YES
 invoice_url       | text                     | YES
 invoice_generated | boolean                  | YES
 tenant_id         | uuid                     | NO
 deleted_at        | timestamp with time zone | YES
 customer_name     | text                     | YES
 customer_email    | text                     | YES
 customer_phone    | text                     | YES
 branch_id         | uuid                     | YES
 session_id        | text                     | YES
 payment_proof_url | text                     | YES
 preference_id     | text                     | YES
 payment_id        | text                     | YES
(26 rows)
```
*(Confirma que `tracking_code` no figuraba en la tabla).*

### 4.2. Error Inicial en PostgREST (HTTP 400 Bad Request)
```bash
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  "https://db.arecofix.com.ar/rest/v1/orders?select=id,tracking_code&limit=1" \
  -H "apikey: [REDACTED]" -H "Authorization: Bearer [REDACTED]"
```
**Output literal:**
```json
{"code":"42703","details":null,"hint":null,"message":"column orders.tracking_code does not exist"}
HTTP_STATUS: 400
```

### 4.3. Backup Preventivo Ejecutado
```bash
docker exec -i supabase-db pg_dump -U postgres -d postgres -t public.orders --schema-only > /home/ubuntu/arecofix/backups/orders_schema_backup_1792424003.sql
docker exec -i supabase-db pg_dump -U postgres -d postgres -t public.orders -Fc > /home/ubuntu/arecofix/backups/orders_data_backup_1792424011.dump
```
**Archivos generados en VPS:**
- `/home/ubuntu/arecofix/backups/orders_schema_backup_1792424003.sql` (12 KB)
- `/home/ubuntu/arecofix/backups/orders_data_backup_1792424011.dump` (23 KB)

### 4.4. Aplicación de la Migración DDL
```sql
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_code TEXT;
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders(tracking_code);
COMMENT ON COLUMN public.orders.tracking_code IS 'Shipment courier tracking number or dispatch tracking reference.';
```
**Output literal en PostgreSQL:**
```text
ALTER TABLE
CREATE INDEX
COMMENT
```

### 4.5. Recarga de Caché de PostgREST
```sql
NOTIFY pgrst, 'reload schema';
```
```bash
docker restart supabase-rest supabase-staging-rest
```
**Output literal:**
```text
NOTIFY
supabase-rest
supabase-staging-rest
```

### 4.6. Verificación Post-Fix en PostgREST (HTTP 200 OK)
```bash
curl -s -w "\nHTTP_STATUS: %{http_code}\n" \
  "https://db.arecofix.com.ar/rest/v1/orders?select=id,tracking_code&limit=1" \
  -H "apikey: [REDACTED]" -H "Authorization: Bearer [REDACTED]"
```
**Output literal:**
```json
[{"id":"9859fa45-84ce-4325-9cd7-473c91a57057","tracking_code":null}]
HTTP_STATUS: 200
```

### 4.7. Test de Inserción Real de Carrito con `x-guest-session` (HTTP 201 Created)
```bash
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST "https://db.arecofix.com.ar/rest/v1/orders" \
  -H "apikey: [REDACTED]" \
  -H "Authorization: Bearer [REDACTED]" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -H "x-guest-session: f8a12345-0000-4000-a000-000000000001" \
  -d '{"order_number":"TEST-CART-001","session_id":"f8a12345-0000-4000-a000-000000000001","status":"cart","total_amount":1500,"subtotal":1500,"tenant_id":"bba26ccd-59ce-471c-aac0-4c1f5513de3b","tracking_code":null}'
```
**Output literal:**
```json
[{"id":"99d63360-f181-44ad-9df9-532732043ee3","order_number":"TEST-CART-001","user_id":null,"status":"cart","total_amount":1500.00,"payment_method":null,"shipping_address":null,"created_at":"2026-10-19T15:35:07.199198+00:00","notes":null,"discount":0.00,"tax":0.00,"subtotal":1500.00,"total":0.00,"updated_at":"2026-10-19T15:35:07.199198+00:00","invoice_url":null,"invoice_generated":false,"tenant_id":"bba26ccd-59ce-471c-aac0-4c1f5513de3b","deleted_at":null,"customer_name":null,"customer_email":null,"customer_phone":null,"branch_id":"de967f68-7b15-44c0-bc98-952ccf06e1e5","session_id":"f8a12345-0000-4000-a000-000000000001","payment_proof_url":null,"preference_id":null,"payment_id":null,"tracking_code":null}]
HTTP_STATUS: 201
```

### 4.8. Validación en Navegador Real (Browser Subagent)
- **URL**: `https://arecofix.com.ar/productos`
- **Acción**: Click en botón "Añadir al Carrito" de un producto con stock.
- **Resultado en pantalla**:
  - Contador de badge de carrito actualizado a **1**.
  - Cero notificaciones de error de esquema en base de datos.
  - Notificación de sistema confirmando producto añadido.
- **Evidencias multimedia registradas**:
  - Captura de pantalla: `cart_added_result_1792424173962.png`
  - Grabación WebP: `cart_add_validation_1792424130999.webp`

---

## 5. Medidas de Mitigación Estructural y Blindaje Definitivo

1. **Script de Verificación de Esquema (`scripts/verify-schema.mjs`)**:
   Implementado para auditar de forma determinista la disponibilidad de las columnas y tablas críticas (`orders`, `products`, `order_items`, `service_leads`) antes de cualquier paso de build o deploy.
   ```bash
   node scripts/verify-schema.mjs
   ```
   **Output:**
   ```text
   [SCHEMA-CHECK] Iniciando validación de contrato de esquema contra Supabase...
   [TARGET] Endpoint: https://db.arecofix.com.ar/rest/v1

     ✔ [OK] Tabla orders y columna tracking_code (Prevención de fallo en carrito) -> HTTP 200
     ✔ [OK] Catálogo de productos y campos esenciales -> HTTP 200
     ✔ [OK] Detalle de items de carrito -> HTTP 200
     ✔ [OK] Tabla de prospectos y leads -> HTTP 200

   ✅ CONTRATO DE ESQUEMA VÁLIDO: Todas las tablas y columnas requeridas existen y responden 200 OK.
   ```

2. **Inclusión en Pipeline CI/CD (`.github/workflows/deploy.yml`)**:
   Se añadieron pasos bloqueantes de `node scripts/verify-schema.mjs` en los jobs `test` y `verify_staging`. Si la base de datos de destino no expone las columnas requeridas, el pipeline falla de inmediato y no compila ni despliega el frontend.

3. **Inclusión en Scripts de Despliegue (`scripts/deploy.mjs` y `scripts/deploy-staging.mjs`)**:
   Cualquier invocación manual de `pnpm run deploy` o `pnpm run deploy:staging` ejecuta la validación de esquema como Paso 1.5 antes de generar el paquete o reiniciar PM2.

4. **Eliminación de `select('*')` en `SupabaseCartRepository`**:
   Se sustituyeron los comodines `select('*')` por la constante `ORDER_SELECT_COLUMNS`, acotando estrictamente el contrato de datos.

5. **Actualización de Normas de Contribución (`CONTRIBUTING.md`)**:
   Se incorporó la Sección 6 que prohíbe taxativamente el despliegue de cambios de modelo TypeScript sin la correspondiente migración SQL aplicada y verificada contra PostgREST.

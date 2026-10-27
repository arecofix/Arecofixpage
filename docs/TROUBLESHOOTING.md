# AUDITORÍA FORENSE & TROUBLESHOOTING: BUG DE DESCRIPCIÓN DE PRODUCTO NO VISIBLE

## 1. SÍNTOMA REPORTADO
- Al crear o editar un producto desde el panel de administración (/admin/products) ingresando una descripción (ej. `"Modulo para samsung a36. Calidad: OLED Original"`), el formulario guarda los cambios con éxito.
- Sin embargo, al ingresar a la página pública del producto (`/productos/detalle/:slug`), la sección de descripción mostraba el texto fallback: `"Sin descripción detallada."`.
- El resto de los atributos (nombre, precio, categoría, imagen) se visualizaban correctamente.

---

## 2. INVESTIGACIÓN Y REPRODUCCIÓN CONTROLADA (EVIDENCIA FORENSE)

### 2.1. Capa de Base de Datos (PostgreSQL en db.arecofix.com.ar)
Se consultó la API PostgREST y la base de datos para el producto real `modulo-samsung-a36-oled-original-5tkowy`:
```bash
curl -s "https://db.arecofix.com.ar/rest/v1/products?select=id,name,slug,description&slug=eq.modulo-samsung-a36-oled-original-5tkowy"
```
**Resultado**:
```json
[
  {
    "id": "e0b0e515-ca77-4dfd-b87d-8eaef0d6dd31",
    "name": "Modulo samsung a36 oled",
    "slug": "modulo-samsung-a36-oled-original-5tkowy",
    "description": "Modulo para samsung a36. Calidad: OLED Original"
  }
]
```
**Conclusión de DB**: La columna `description` existe como tipo `text`, nullable, con índice de búsqueda de texto completo (`search_tsv`). La creación y edición en el panel de administración guardaba el dato perfectamente en la base de datos. Se descartan las hipótesis de base de datos inexistente, tipo erróneo o truncamiento.

### 2.2. Capa de Servidor SSR en Producción
Se inspeccionó la respuesta HTML del servidor Node.js/SSR de producción (`https://arecofix.com.ar/productos/detalle/modulo-samsung-a36-oled-original-5tkowy`):
```html
<p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">Sin descripción detallada.</p>
```
El objeto transferido de estado SSR (`SEO_DATA`) contenía:
```json
{"title":"Modulo samsung a36 oled | Arecofix","description":"","image":"..."}
```
Esto demostró que el servidor SSR no recibía la descripción al resolver el producto por slug.

---

## 3. CAUSA RAÍZ (5 WHYS / ANÁLISIS DE FALLO)

1. **¿Por qué la página de detalle mostraba "Sin descripción detallada."?**
   Porque en el componente de detalle (`products-details-page.ts`), `product().description` llegaba como `undefined` o `null`.

2. **¿Por qué `product().description` llegaba vacío si estaba guardado en DB?**
   Porque el resolver de ruta `productSeoResolver` consultaba:
   `productService.getData({ _page: 1, slug: slug })`.

3. **¿Por qué `getData` no traía la descripción?**
   Porque `SupabaseProductRepository.findWithFilters` tenía como parámetro por defecto `minimal = true` para optimizar payloads de catálogo. Al estar `minimal = true`, la query PostgREST aplicaba una proyección restringida (`selectFields`) que **excluía intencionalmente** `description`, `gallery_urls`, `specifications`, `meta_title`, `meta_description`, `og_image`:
   ```typescript
   // ANTES (Causa del bug):
   const minimal = params.minimal ?? true;
   // Al buscar por slug, si no se pasaba minimal: false, excluía 'description'!
   ```

4. **¿Por qué no existía un método de dominio específico para obtener el producto completo por slug?**
   Faltaba el contrato `getBySlug(slug: string): Observable<Product | null>` en la interfaz del repositorio de dominio `ProductRepository`, forzando a la aplicación a reutilizar la consulta paginada genérica de catálogo.

5. **Causa secundaria en Template (`products-details-page.html`)**:
   El elemento `<p>` no tenía la clase CSS `whitespace-pre-line`, por lo que cualquier descripción con múltiples párrafos o saltos de línea se renderizaba colapsada en una sola línea continua.

6. **Causa secundaria en Mapper (`ProductMapper.mapFromDb`)**:
   Los campos `meta_title`, `meta_description` y `og_image` no estaban siendo mapeados desde la respuesta de la base de datos a la entidad `Product`.

---

## 4. SOLUCIÓN APLICADA (CLEAN ARCHITECTURE & CLEAN CODE)

### 4.1. Capa de Dominio (`src/app/features/products/domain/`)
1. **Entidad `Product`** (`product.entity.ts`):
   - Se tipó `description?: string | null;` de manera explícita y coherente con el esquema de base de datos.
2. **Contrato de Repositorio** (`repositories/product.repository.ts`):
   - Se incorporó el método abstracto de dominio:
     ```typescript
     abstract getBySlug(slug: string): Observable<Product | null>;
     ```

### 4.2. Capa de Infraestructura (`src/app/features/products/infrastructure/`)
1. **Repositorio Supabase** (`repositories/supabase-product.repository.ts`):
   - Implementación de `getBySlug(slug: string)` solicitando la proyección completa (todas las columnas de detalle, SEO, garantías, etc.).
   - Inferencia inteligente de proyección en `findWithFilters`: si la consulta incluye un identificador único (`slug` o `id`), `minimal` se evalúa como `false` por defecto a menos que se especifique lo contrario:
     ```typescript
     const isSingleLookup = Boolean(slug || id);
     const minimal = params.minimal !== undefined ? params.minimal : !isSingleLookup;
     ```
   - Inclusión de columnas completas cuando `!minimal`: `description`, `gallery_urls`, `media_metadata`, `specifications`, `meta_title`, `meta_description`, `og_image`, `seo_keywords`, `warranty_days`, `tax_percentage`, `weight`, `dimensions`, `cross_sell_products`, `offer_start_date`, `offer_end_date`.
2. **Repositorio Flask (Offline / Desktop)** (`repositories/flask-product.repository.ts`):
   - Implementación completa de `getBySlug` con búsqueda por slug y fallback por id.
3. **Mapper de Dominio** (`mappers/product.mapper.ts`):
   - Mapeo completo de `meta_title`, `meta_description` y `og_image`.

### 4.3. Capa de Aplicación / Servicios (`src/app/public/products/services/product.service.ts`)
- Implementación de `getBySlug(slug: string): Observable<Product | null>` delegando directamente en el repositorio de dominio inyectado (`this.productRepository.getBySlug(slug)`).

### 4.4. Capa de Enrutamiento & SSR (`src/app/core/resolvers/product-seo.resolver.ts`)
- `productSeoResolver` ahora consume directamente `productService.getBySlug(slug)` garantizando la carga del producto íntegro en la fase de resolución de ruta antes del renderizado SSR/CSR.

### 4.5. Capa de Presentación / UI (`products-details-page.html`)
- Inclusión de `id="product-description"` y `data-testid="product-description"`.
- Aplicación de la clase `whitespace-pre-line` para respetar formato y saltos de línea cargados por el administrador.

---

## 5. SUITE DE PRUEBAS & PREVENCIÓN DE REGRESIONES

### 5.1. Pruebas Unitarias (Jest)
- `supabase-product.repository.spec.ts`:
  - `debería solicitar todos los campos detallados (incluyendo description) en getBySlug`.
  - `debería solicitar campos mínimos en consultas de listado de catálogo`.
  - `debería solicitar campos detallados en findWithFilters si se especifica slug`.
  - `debería manejar errores de Supabase retornando throwError`.
- `product.mapper.spec.ts`:
  - Validación de mapeo de `description`, `meta_title`, `meta_description` y `og_image`.
- **Resultado Jest**: 31 suites de pruebas ejecutadas, **156 tests pasando (0 fallos)**.

### 5.2. Pruebas E2E (Cypress)
- `cypress/e2e/ui/product-description-audit.cy.ts`:
  1. `debería solicitar el campo description en la query de Supabase y renderizarlo en el DOM público`:
     - Intercepta la petición HTTP a `/rest/v1/products*` verificando que el parámetro `select` contenga `description`.
     - Verifica que `#product-description` esté visible en el DOM y contenga el texto exacto.
  2. `debería preservar saltos de línea (multiline) en la descripción del producto`:
     - Valida `whitespace-pre-line` en el elemento renderizado.
  3. `debería mostrar fallback "Sin descripción detallada." con estilo adecuado si el producto no tiene descripción`:
     - Valida manejo gracioso y accesible cuando `description` es `null` o vacío.
- **Resultado Cypress**: 3 tests ejecutados en Electron headless, **3 tests pasando (0 fallos)**.

### 5.3. Verificación de Compilación & SSR
- `pnpm exec ng build --configuration development`:
  - Compilación de bundle de cliente y bundle SSR sin errores de tipos (`any` prohibido, tipado estricto cumplido).
- Prueba con servidor SSR local (`dist/arecofix/server/server.mjs`):
  - Solicitud HTTP GET a `/productos/detalle/modulo-samsung-a36-oled-original-5tkowy`:
  - `<p id="product-description" ...>Modulo para samsung a36. Calidad: OLED Original</p>` generado correctamente en el HTML inicial.
  - Tag meta transferido: `"description":"Modulo para samsung a36. Calidad: OLED Original"`.

---

## 6. COMANDOS DE DESPLIEGUE A PRODUCCIÓN
Para desplegar la solución en el VPS:
```bash
pnpm run build && scp -i ssh-key-2026-08-30.key -r dist/ ubuntu@ssh.arecofix.com.ar:arecofix/ && ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar 'pm2 restart arecofix-frontend'
```

---

# AUDITORÍA FORENSE & SINCRONIZACIÓN COMPLETA: DASHBOARD INTEGRAL DE NEGOCIO (SUPER ADMIN)

## 1. SÍNTOMA REPORTADO
- Al acceder al **Dashboard Integral de Negocio** (`/admin/dashboard`), todas las métricas operativas y financieras figuraban en cero (`$ 0`, `0 pedidos`, `0 reparaciones`, `0 alumnos`).
- Gráficos vacíos: "Sin registros históricos para graficar" y "Sin movimientos registrados".
- Centro de Alertas Operativas: "Stock saludable. No hay productos por debajo del umbral mínimo", "Retiros al día. No hay equipos demorados", "Membresías al día".
- Filtro de fecha (Hoy, 7 Días, Este Mes, Este Año) no producía ningún cambio (todos los valores permanecían en 0).
- Sin embargo, en la base de datos real existían **2.775 productos**, **87 pedidos**, **41 reparaciones**, **32 movimientos de caja**, y **10 inscripciones de alumnos en academia**.

---

## 2. EVIDENCIA FORENSE Y CAUSAS RAÍZ IDENTIFICADAS

### Causa Raíz 1 (Capa de Base de Datos - RPC `get_admin_business_dashboard_metrics`):
- **Bloqueo de Tenant en Llamadas Administrativas / Service Role**:
  En la migración `20261018020000_systemic_tenant_isolation_all_modules.sql`, la función RPC incluía la siguiente guarda:
  ```sql
  IF NOT public.is_super_admin() THEN
      v_tenant_id := public.get_current_tenant_id();
  ELSE
      v_tenant_id := COALESCE(p_tenant_id, public.get_current_tenant_id());
  END IF;

  IF v_tenant_id IS NULL AND NOT public.is_super_admin() THEN
      RETURN jsonb_build_object('error', 'Tenant context required');
  END IF;
  ```
  Al ser invocada por el servidor backend de Express con la clave `SUPABASE_SERVICE_ROLE_KEY` (rol `service_role` en JWT de PostgREST, `auth.uid() = NULL`), la función `public.is_super_admin()` evaluaba a `FALSE`. Por ende, el código ignoraba cualquier parámetro y entraba a `get_current_tenant_id()`, el cual devolvía `NULL`. Al ser `v_tenant_id IS NULL`, la función abortaba inmediatamente devolviendo:
  `{"error": "Tenant context required"}`.

### Causa Raíz 2 (Capa de Base de Datos - Columnas Inexistentes en Esquema):
- La migración defectuosa intentaba consultar columnas que no existen en PostgreSQL:
  - En `repairs`: `r.repair_number`, `r.customer_name`, `r.device_model`. En PostgreSQL las columnas reales son `r.tracking_code`, `r.client_id`, `r.device_id`.
  - En `academy_subscriptions`: `s.grace_period_until`. La columna real en la base de datos es `s.grace_period_ends_at`.
  - En `academy_subscriptions`: `s.email`. Dicha tabla sólo contiene `s.user_id`, requiriendo un join con `profiles` o alias nulo al unirse con `course_enrollments`.
  Cualquier ejecución de dichas queries arrojaba error de PostgreSQL `42703 (column does not exist)`.

### Causa Raíz 3 (Capa de Backend - Rutas de Express):
- En `server/routes/admin-dashboard.routes.ts`:
  El middleware `requireAdminAuth` validaba la sesión del usuario pero no propagaba el `tenant_id` del perfil al handler downstream.
  Además, cualquier error retornado por PostgREST era capturado en un bloque `catch` que devolvía código HTTP 200 con un JSON de métricas en cero, silenciando el fallo e impidiendo que el frontend mostrara la pantalla de reintento.

### Causa Raíz 4 (Capa de Frontend - Desajuste de Nombres DTO):
- La migración previa había modificado las claves de retorno (`metrics` en lugar de `kpis`, `net_cashflow` en lugar de `net_balance`, `ecommerce_paid_count` en lugar de `ecommerce_orders_count`, `trend` en lugar de `charts.trend_6_months`). Al no coincidir con `BusinessDashboardData`, la función `sanitizeData` del frontend caía en el fallback por defecto en cero.

---

## 3. SOLUCIÓN IMPLEMENTADA Y MAPEO LIMPIO

### 3.1. Migración SQL (`20261018040000_fix_admin_business_dashboard_metrics_real_data.sql`):
1. **Detección de rol administrativo en PostgreSQL**:
   Reconoce peticiones provenientes de `service_role`, `postgres` o `super_admin`. Si no se especifica tenant, resuelve automáticamente al Tenant Principal de Arecofix (`bba26ccd-59ce-471c-aac0-4c1f5513de3b`).
2. **Corrección de Naming de Columnas**:
   - `repairs`: `tracking_code`, `client_name` via `LEFT JOIN profiles`.
   - `academy_subscriptions`: `grace_period_ends_at`.
   - `course_enrollments`: Incorporación de alumnos confirmados en `active_subscriptions_count`.
3. **Estructura Canónica + Aliases Retrocompatibles**:
   Devuelve `kpis`, `alerts`, `charts` y `period`, complementado con `metrics` y `trend` para compatibilidad universal.
4. **Zona Horaria Oficial de Argentina**:
   Aplica `AT TIME ZONE 'America/Argentina/Buenos_Aires'` (UTC-3) en `today`, `month` y `year` para cálculo exacto de días y meses comerciales.

### 3.2. Mapeo Métricas vs Tablas de Producción:
| Métrica en Dashboard | Fuente en Base de Datos | Filtros Aplicados | Valor Real Actual (Mes/Año) |
|---|---|---|---|
| **Balance Neto** | `cash_movements.amount` | `type = 'income' - type = 'expense'`, rango fecha | `$ 144.500` (Mes) / `$ 997.244` (Año) |
| **Ventas E-commerce** | `orders.total_amount` | `status IN ('paid','completed','delivered')` | `8 pedidos ($ 240.871,4)` (Año) |
| **Taller Pendiente** | `repairs.id` | `deleted_at IS NULL AND current_status_id NOT IN (6,7)` | `17 equipos activos (13 con demora > 7d)` |
| **Alumnos Academia** | `course_enrollments` + `academy_subscriptions` | `status IN ('confirmed','active')` | `7 alumnos activos` |
| **Stock Crítico** | `products` | `is_active = true AND stock <= COALESCE(min_stock_alert, 5)` | `2.589 en alerta` (Top 10 en alertas) |
| **Retiros > 48hs** | `repairs` | `current_status_id = 5 AND ready_since < now() - 48h` | `3 equipos demorados` (con horas y costos) |
| **Tendencia 6 Meses** | `cash_movements` | Agrupado por mes últimos 6 meses (Mayo a Octubre) | `6 meses con balance mensual exacto` |

---

## 4. VERIFICACIÓN Y TESTING

1. **Endpoint de Health Check Operativo**:
   `GET https://arecofix.com.ar/api/admin/dashboard/health` responde HTTP 200 en 29ms:
   `{"status":"healthy","database":"connected","elapsed_ms":29,"sample_kpis":{"net_balance":144500,"active_repairs_count":17,"active_subscriptions_count":7}}`.
2. **Script CLI Automatizado**:
   `pnpm run dashboard:healthcheck` valida los 4 rangos (`today`, `7days`, `month`, `year`) en 0.53s.
3. **Tests Unitarios de Jest**:
   - `admin-business-dashboard.service.spec.ts`: 4/4 pasando.
   - `admin-dashboard-page.spec.ts`: 5/5 pasando.
4. **Cypress E2E**:
   - `cypress/e2e/admin-dashboard/admin-dashboard-real-sync.cy.ts`: Verifica la reproducción de la línea base del bug y la resolución con datos reales.

---

# GUÍAS DE DIAGNÓSTICO Y RESOLUCIÓN (TROUBLESHOOTING PLAYBOOKS)

## CASO 1: Desmuteo y Diagnóstico del Test AF-155 (`seo-validation.cy.ts`)

### Síntoma
El test E2E de validación de tracking público dinámico (`AF-155`) permanecía marcado con `it.skip()` en `cypress/e2e/ui/seo-validation.cy.ts`. Los desarrolladores asumían falsamente que `cy.intercept()` fallaba debido a la hidratación SSR de Angular.

### Metodología de Diagnóstico Forense
1. **No asumir fallas de SSR o tooling**: En lugar de aislar el test con mocks que no representan la realidad, inspeccionar la base de datos subyacente.
2. **Verificación de existencia en PostgreSQL**:
   ```sql
   SELECT id, repair_number, tracking_code, current_status_id 
   FROM public.repairs 
   WHERE id = 'e4a8500c-50b8-4c36-a269-51c586e4ca0c' OR tracking_code = 'AF-155';
   ```
3. **Causa Real**: El test intentaba validar una orden `#110` en una ruta `/tracking/AF-155` donde el componente esperaba que existiera un registro real en la base de datos de producción con el tracking code correspondiente. Si se ejecutaba contra una base de datos vacía o staging sin seed, la página retornaba "No encontrada".
4. **Resolución**:
   - Se verificó que el registro existe de forma permanente en PostgreSQL (`e4a8500c-50b8-4c36-a269-51c586e4ca0c`, PlayStation 3, orden `#110`).
   - Se removió `it.skip` transformándolo en `it(...)`.
   - Se ajustó el selector a `cy.get('h1, h2, form, input', { timeout: 15000 }).should('exist')` para permitir la renderización SSR antes de validar las meta tags de Open Graph.
   - Resultado: 7/7 passing en `seo-validation.cy.ts` en 8 segundos.

---

## CASO 2: Diagnóstico de Bloqueos CSP y Adición Segura de Orígenes

### Síntoma
Un servicio externo (ej. pasarela de pago, analítica o widget) arroja errores en la consola del navegador:
`Refused to connect to 'https://api.nuevo-servicio.com' because it violates the following Content Security Policy directive...`

### Protocolo de Resolución
1. **Abrir DevTools**: Filtrar en la pestaña *Console* por `violates the following Content Security Policy`.
2. **Identificar la directiva afectada**:
   - Si es una llamada fetch/xhr/ws → directiva `connect-src`.
   - Si es un tag `<script>` → directiva `script-src`.
   - Si es un `<iframe>` → directiva `frame-src`.
   - Si es un worker → directiva `worker-src`.
3. **Editar la directiva** en `server/middleware/security.middleware.ts`.
4. **Regla de Prevención**: Nunca usar comodines abiertos como `https:*` en `script-src` o `connect-src`. Especificar el subdominio exacto o wildcard restringido (ej. `https://*.mercadopago.com`).
5. **Verificación**: Comprobar con `curl -sI https://arecofix.com.ar/` que el header se emita sin `-Report-Only` y que la funcionalidad opere sin alertas.

---

## CASO 3: Pasarela Mercado Pago (Token Inválido o Preferencia Fallida)

### Síntoma
Al hacer clic en "Confirmar Pedido Seguro", la UI muestra un toast de error o no redirige a `mercadopago.com.ar`.

### Checklist de Diagnóstico
1. **Verificar vigencia del Token MLA**:
   ```bash
   curl -s https://api.mercadopago.com/users/me -H "Authorization: Bearer $MP_ACCESS_TOKEN"
   ```
   Assertar que el JSON retorne `site_id: "MLA"` y el `id` numérico esperado (`374364423`). Si retorna HTTP 401 o `{"message":"invalid_token"}`, el token expiró o fue revocado en Mercado Pago.
2. **Verificar variables de entorno en el servidor**:
   Confirmar que `MP_ACCESS_TOKEN` existe en `/home/ubuntu/arecofix/.env` y no está vacío.
3. **Inspeccionar Logs de PM2**:
   ```bash
   pm2 logs arecofix-frontend --lines 50 | grep -i "mercadopago"
   ```
4. **Validar Payload de la Orden**: Mercado Pago rechaza preferencias con precios unitarios `<= 0`, o monedas distintas a `ARS`.

---

## CASO 4: Estabilización y Eliminación de Flakiness en Cypress

### Síntoma
Tests E2E que pasan localmente pero fallan aleatoriamente en el runner de CI/CD.

### Antipatrones y Soluciones
- ❌ **Antipatrón**: Usar `cy.wait(5000)` con tiempos fijos.
  - ✅ **Solución**: Usar `cy.wait('@alias', { timeout: 15000 })` para esperar resoluciones de red deterministas.
- ❌ **Antipatrón**: Buscar elementos genéricos antes de la hidratación (`cy.get('.btn').click()`).
  - ✅ **Solución**: Esperar a que el contenedor principal o resolver termine (`cy.get('app-root').should('be.visible')`).
- ❌ **Antipatrón**: Compartir estado entre tests.
  - ✅ **Solución**: Limpiar `localStorage`, `cookies` e `IndexedDB` en `beforeEach`:
    ```typescript
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.window().then((win) => win.indexedDB.deleteDatabase('arecofix_offline_sync'));
    ```

---

## CASO 5: Diagnóstico de Integridad y Duplicados en Base de Datos

### Síntoma
Errores en checkout por duplicados, datos huérfanos o lentitud en queries de productos.

### Protocolo de Auditoría Rápida
1. **Detección de Tablas sin RLS**:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;
   ```
   Si devuelve filas, aplicar inmediatamente `ALTER TABLE <tabla> ENABLE ROW LEVEL SECURITY;`.
2. **Detección de Índices Redundantes**:
   Consultar `pg_indexes` agrupando por `(tablename, indexdef)`. Eliminar duplicados para reducir la sobrecarga de I/O en escrituras.
3. **Detección de Desincronización en `orders`**:
   ```sql
   SELECT count(*) FROM orders WHERE total IS DISTINCT FROM total_amount;
   ```
   Ejecutar el script de sincronización documentado en [DATABASE_AUDIT_20261020.md](file:///c:/git/Arecofixpage/docs/DATABASE_AUDIT_20261020.md).


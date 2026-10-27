# 🌐 Cloudflare D1 Failover Schema & Architecture Documentation

## 1. Contexto y Propósito

El Cloudflare Worker `arecofix-d1-failover` (`https://arecofix-d1-failover.ezequielenrico15.workers.dev`) actúa como réplica de lectura en el Edge para mitigar caídas totales o latencias críticas del backend principal (Supabase / PostgreSQL en VPS).

Durante el incidente del 2026-10-19, se detectó que el cliente intentaba hacer failover de tablas dinámicas de sesión (`orders`), lo que provocó errores `500 {"error":"D1_ERROR: no such table: orders: SQLITE_ERROR"}`. Este documento formaliza qué tablas forman parte del Edge Failover y cuáles **deliberadamente NO**.

---

## 2. Inventario de Tablas: D1 vs PostgreSQL (`public`)

### 2.1 Tablas Replicadas en D1 (SQLite Edge)

| Tabla | Propósito en D1 Failover | Justificación |
|---|---|---|
| `categories` | Catálogo de categorías de la tienda | Lectura estática pública. Permite que la home y la navegación de productos carguen sin backend. |
| `products` | Catálogo de productos y repuestos | Lectura pública esencial para navegación y visualización de catálogo offline/failover. |
| `branches` | Sucursales y datos de contacto | Información de contacto y sedes físicas disponible ante caída de DB. |
| `tenants` | Configuración multitenant básica | Dominios, nombres y branding requeridos para resolución de tenant en SSR/Edge. |

### 2.2 Tablas Excluidas Deliberadamente de D1

| Tabla / Dominio | Razón de Exclusión |
|---|---|
| `orders`, `order_items` | **Transaccionalidad y Seguridad**. Los pedidos y carritos requieren RLS estricta (`get_request_guest_session()`), validación de inventario en tiempo real y consistencia ACID. No pueden ser leídos ni modificados en réplicas desincronizadas. |
| `service_leads`, `contact_messages` | **Privacidad PII y Escritura**. Son leads con datos personales (nombre, teléfono, mensaje) que se insertan en caliente con políticas RLS específicas. |
| `repairs`, `customer_devices`, `repair_*` | **Datos privados y de taller**. El módulo de reparaciones requiere autenticación de clientes y operarios, histórico y cambios de estado concurrentes. |
| `profiles`, `roles`, `user_roles`, `role_permissions` | **Seguridad y Autorización**. El control de acceso RBAC reside centralmente en Supabase Auth / PostgreSQL JWT tokens. Duplicar perfiles en SQLite generaría riesgo de fuga y desincronización de credenciales. |
| `courses`, `course_lessons`, `academy_*` | **Contenido protegido por suscripción**. El acceso a lecciones y videos requiere validación de membresía activa. |
| `cash_movements`, `invoices`, `purchases` | **Contabilidad y Facturación**. Datos financieros sensibles de estricto procesamiento en PostgreSQL con auditoría. |

---

## 3. Esquema DDL en Cloudflare D1 (SQLite)

```sql
CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subdomain TEXT NOT NULL,
    custom_domain TEXT,
    logo_url TEXT,
    primary_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

CREATE TABLE categories (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

CREATE TABLE products (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    category_id TEXT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- Índices de optimización
CREATE INDEX idx_tenants_domain ON tenants(custom_domain);
CREATE INDEX idx_products_tenant ON products(tenant_id);
CREATE INDEX idx_categories_tenant ON categories(tenant_id);
```

---

## 4. Estrategia de Sincronización

1. **Worker de Sincronización**: `cloudflare/workers/d1-sync` expone un endpoint POST para ingesta de eventos `INSERT`/`UPDATE` disparados desde Supabase Database Webhooks o scripts de mantenimiento.
2. **Periodicidad**: 
   - Webhook en tiempo real (cuando se modifica catálogo o sucursales).
   - Respaldo batch nocturno o manual vía script de migración SQLite.
3. **Comportamiento en Fallo**:
   - `src/app/core/services/supabase.service.ts` solo deriva requests `GET` de `categories` y `products` hacia D1 cuando Supabase está inalcanzable.
   - Las solicitudes de `orders` o mutaciones (`POST`, `PUT`, `DELETE`, `PATCH`) **nunca** son desviadas a D1.

---

## 5. Endpoint de Healthcheck (`/health`)

Implementado en `cloudflare/workers/d1-failover/src/index.js`:

```http
GET https://arecofix-d1-failover.ezequielenrico15.workers.dev/health
```

### Respuesta esperada:
```json
{
  "status": "ok",
  "tables": [
    "branches",
    "categories",
    "products",
    "tenants"
  ],
  "timestamp": "2026-10-19T03:28:05.697Z"
}
```

Integrado en la suite de CI (`.github/workflows/deploy.yml`) para validar que el worker esté saludable en cada push y despliegue.

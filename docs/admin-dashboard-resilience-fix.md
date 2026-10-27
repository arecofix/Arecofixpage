# 🛡️ Blindaje y Resiliencia del Admin Dashboard (/admin/dashboard)

## 📌 Resumen Ejecutivo

En producción, la ruta `/admin/dashboard` experimentaba un fallo crítico:
```text
TypeError: Cannot read properties of undefined (reading 'net_balance')
```
Este error se producía cuando el template de Angular intentaba acceder de manera síncrona y no segura a las propiedades de un objeto de métricas (`metrics.net_balance` o `dashboardData()?.kpis.net_balance`) mientras los datos aún estaban en tránsito, cuando la petición HTTP/RPC fallaba por red o error 500, o durante la fase de renderizado en servidor (SSR).

Se implementó una solución integral que abarca cuatro fases:
1. **Refactorización del Componente (`admin-dashboard-page.ts`)**: Inicialización de métricas por defecto seguras, señales reactivas (`isLoading`, `error`), función de sanitización estricta sin `any`, y protección para SSR (`isPlatformBrowser`).
2. **Blindaje del Template (`admin-dashboard-page.html`)**: Navegación segura (`?.`), DaisyUI Skeleton Loader durante `isLoading()`, panel de error con botón de "Reintentar" ante fallos de red (`error()`), y renderizado condicional de métricas reales.
3. **Auditoría de Backend y RPC**: Verificación de funciones SQL con `COALESCE` en agregados y endpoints Express con fallbacks consistentes.
4. **Validación E2E y Regresión (Cypress)**: Suite de 4 pruebas de resiliencia (`cypress/e2e/admin-dashboard/admin-dashboard-resilience.cy.ts`) cubriendo error de red 500, respuesta vacía `{}`, renderizado exitoso y control de excepciones fatales en consola (100% aprobado).

---

## 🏗️ FASE 1: Refactorización del Componente

Archivo modificado: [`src/app/admin/dashboard/admin-dashboard-page.ts`](file:///C:/git/Arecofixpage/src/app/admin/dashboard/admin-dashboard-page.ts)

### 1.1 Objeto Seguro por Defecto (`DEFAULT_DASHBOARD_METRICS`)
Se definió una constante inmutable y fuertemente tipada con todas las propiedades requeridas inicializadas en 0 y arrays vacíos:

```typescript
export const DEFAULT_DASHBOARD_METRICS: BusinessDashboardData = {
  period: {
    range: 'month',
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString()
  },
  kpis: {
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    ecommerce_orders_count: 0,
    ecommerce_amount: 0,
    active_repairs_count: 0,
    delayed_repairs_count: 0,
    has_delayed_alert: false,
    active_subscriptions_count: 0,
    academy_revenue: 0,
    critical_stock_count: 0
  },
  alerts: {
    critical_stock_items: [],
    overdue_pickup_repairs: [],
    expiring_grace_subscriptions: []
  },
  charts: {
    trend_6_months: [],
    revenue_by_origin: {
      ecommerce: 0,
      repairs: 0,
      academy: 0
    }
  }
};
```

### 1.2 Señales de Estado y Compatibilidad Retroactiva
Se implementaron señales de control de ciclo de vida y métricas calculadas que garantizan que el template o código externo siempre lean un objeto válido:

```typescript
isLoading = signal<boolean>(true);
loadingBusinessMetrics = computed(() => this.isLoading());
error = signal<string | null>(null);

metrics = computed(() => ({
  ...this.dashboardData()?.kpis,
  net_balance: this.dashboardData()?.kpis?.net_balance ?? 0,
  total_sales: this.dashboardData()?.kpis?.ecommerce_orders_count ?? 0,
  pending_repairs: this.dashboardData()?.kpis?.active_repairs_count ?? 0,
  active_students: this.dashboardData()?.kpis?.active_subscriptions_count ?? 0,
  charts: this.dashboardData()?.charts?.trend_6_months ?? []
}));
businessMetrics = computed(() => this.dashboardData() ?? DEFAULT_DASHBOARD_METRICS);
```

### 1.3 Sanitizador Estricto sin `any` (`sanitizeData`)
Evita la inyección de `null`, `undefined` o formatos inesperados provenientes de la red:
```typescript
private sanitizeData(
  raw: BusinessDashboardData | Record<string, unknown> | null | undefined,
  range: 'today' | '7days' | 'month' | 'year' = 'month'
): BusinessDashboardData
```

### 1.4 Manejo de Errores y Protección SSR
Se protegió el ciclo de vida de peticiones HTTP en SSR mediante `isPlatformBrowser(this.platformId)` y se aseguró la desactivación del estado de carga mediante `finalize()`:
```typescript
loadBusinessMetrics(range?: 'today' | '7days' | 'month' | 'year', branchId?: string, simulateFailure?: string) {
  if (!isPlatformBrowser(this.platformId)) {
    this.isLoading.set(false);
    return;
  }

  const targetRange = range || this.selectedRange();
  this.isLoading.set(true);
  this.error.set(null);

  this.businessDashboardService.getMetrics(targetRange, activeBranchId || undefined, simulateFailure).pipe(
    finalize(() => {
      this.isLoading.set(false);
      this.cdr.markForCheck();
    })
  ).subscribe({
    next: (res) => { ... },
    error: (err) => {
      const errMsg = err?.error?.error || err?.message || 'Error de conexión con el servidor al cargar las métricas.';
      this.error.set(errMsg);
      const safeData = this.sanitizeData(null, targetRange);
      this.dashboardData.set(safeData);
    }
  });
}
```

---

## 🎨 FASE 2: Blindaje del Template

Archivo modificado: [`src/app/admin/dashboard/admin-dashboard-page.html`](file:///C:/git/Arecofixpage/src/app/admin/dashboard/admin-dashboard-page.html)

### 2.1 DaisyUI Skeleton Loader
Mientras `isLoading()` es verdadero, se despliega una interfaz de carga elegante que previene saltos de diseño (CLS) y accesos prematuros:
```html
@if (isLoading()) {
  <div id="dashboard-skeleton-loader" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    <!-- 4 Tarjetas Skeleton con DaisyUI .skeleton -->
    <div class="card bg-base-100 border border-base-300 p-5 shadow-sm">
      <div class="skeleton h-4 w-28 mb-3"></div>
      <div class="skeleton h-8 w-36 mb-2"></div>
      <div class="skeleton h-3 w-48"></div>
    </div>
    ...
  </div>
}
```

### 2.2 Panel de Error con Botón de Reintento
Si `error()` contiene un mensaje de falla de red, se presenta una alerta visual interactiva:
```html
@if (error()) {
  <div id="dashboard-error-panel" class="alert alert-error shadow-lg mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-3">
      <svg ... class="stroke-current shrink-0 h-6 w-6"></svg>
      <div>
        <h4 class="font-bold text-base">Error al sincronizar métricas del dashboard</h4>
        <p class="text-xs opacity-90">{{ error() }}</p>
      </div>
    </div>
    <button id="btn-retry-dashboard" class="btn btn-sm btn-outline bg-base-100 text-error hover:bg-base-200" (click)="loadBusinessMetrics()">
      🔄 Reintentar
    </button>
  </div>
}
```

### 2.3 Navegación Segura en Métricas Reales
Todas las 42 interpolaciones de propiedades fueron blindadas con navegación segura (`?.`) y operadores de coalescencia nula (`??`):
```html
@if (!isLoading() && !error()) {
  ...
  <div class="stat-value text-2xl font-black text-emerald-600">
    ${{ (dashboardData()?.kpis?.net_balance ?? 0) | number:'1.0-0' }}
  </div>
  ...
}
```

---

## 🗄️ FASE 3: Verificación del Backend

1. **RPC de PostgreSQL (`get_admin_business_dashboard_metrics`)**:
   - Ubicación: [`supabase/migrations/20261017040000_admin_business_dashboard_metrics.sql`](file:///C:/git/Arecofixpage/supabase/migrations/20261017040000_admin_business_dashboard_metrics.sql)
   - Agregaciones blindadas con `COALESCE(SUM(amount), 0)`, `COALESCE(COUNT(*), 0)`.
   - Garantiza que la respuesta sea siempre un objeto JSON válido con los sub-nodos `period`, `kpis`, `alerts` y `charts`.
2. **Servicio y Controlador Express**:
   - Ubicación: [`server/routes/admin-dashboard.routes.ts`](file:///C:/git/Arecofixpage/server/routes/admin-dashboard.routes.ts)
   - Manejo de excepciones en cada módulo (Caja, Órdenes, Reparaciones, Academia) con registro de fallos parciales en `partialErrors` sin interrumpir la respuesta principal (resiliencia parcial).

---

## 🧪 FASE 4: Tests E2E de Cypress

Archivo creado: [`cypress/e2e/admin-dashboard/admin-dashboard-resilience.cy.ts`](file:///C:/git/Arecofixpage/cypress/e2e/admin-dashboard/admin-dashboard-resilience.cy.ts)

### Resultados de la Suite Completa de Tests:
```text
  Admin Dashboard: Blindaje y Resiliencia a Fallos de Red
    ✔ 1. Test de Error de Red (500): Muestra panel de error con botón "Reintentar" y NO crashea en consola
    ✔ 2. Test de Datos Vacíos ({}): Fallback seguro con KPIs en 0 sin lanzar excepciones de undefined
    ✔ 3. Test de Carga Exitosa: Fuerza respuesta mockeada y verifica renderizado de KPIs y gráficos
    ✔ 4. Test de Consola: Valida que ninguna operación fatal de undefined haya ocurrido en el Dashboard

  Admin Business Dashboard E2E: Métricas Consolidadas y Alertas Operativas
    ✔ 1. El dashboard carga las 4 tarjetas de KPI correctamente
    ✔ 2. El gráfico de tendencia renderiza sin errores de consola
    ✔ 3. Si hay un producto con stock crítico (mockeado), aparece en el panel de alertas
    ✔ 4. Al cambiar el filtro de fecha, el endpoint de métricas recibe los nuevos parámetros y actualiza las tarjetas
    ✔ 5. Test Adversarial: Si un endpoint falla (ej. DB de Academia), muestra aviso parcial sin romper la pantalla

  9 passing (12s)
```

---

## 🚀 Despliegue a Producción

- **Build de Producción**: `ng build --configuration production` completado sin errores.
- **Orquestador de Despliegue**: `pnpm run deploy` (`scripts/deploy.mjs`).
  - Creación de paquete atómico `dist.tar.gz` (71.08 MB).
  - Backup preventivo en la VPS (`/home/ubuntu/arecofix/dist_backup`).
  - Transferencia segura SCP y extracción atómica.
  - Recarga graciosa con PM2 (`pm2 reload arecofix-frontend`).
  - Healthcheck HTTP: `https://arecofix.com.ar` respondió **HTTP 200 OK**.
  - Logs de PM2 (`arecofix-frontend-error.log`): **0 errores**.

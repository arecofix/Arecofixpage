# 📊 Documentación Técnica: Dashboard Integral de Negocio Arecofix

## 1. Resumen Ejecutivo
El **Dashboard Integral de Negocio** (`/admin/dashboard`) consolida en una sola pantalla la información en tiempo real de todos los módulos del ecosistema Arecofix:
- 🛒 **E-commerce:** Pedidos pagados, despachos y facturación en ARS.
- 🛠️ **Taller de Reparaciones:** Equipos activos en taller, demoras operativas y retiros pendientes.
- 💵 **Caja y Tesorería:** Registro de ingresos, egresos, balance neto y libro diario.
- 🎓 **Academia:** Alumnos con suscripción activa e ingresos por cobro de membresías.
- 📦 **Inventario:** Detección de productos en stock crítico o agotados.

Todo el desarrollo se implementó de forma aislada sin modificar la lógica interna existente de los módulos individuales.

---

## 2. Arquitectura de Datos y Agregación Backend (FASE 1)

### 2.1 Función RPC en PostgreSQL (Zero N+1 Queries)
Se creó la función RPC con permisos `SECURITY DEFINER`:
```sql
public.get_admin_business_dashboard_metrics(
    p_tenant_id uuid DEFAULT NULL,
    p_range text DEFAULT 'month',
    p_start_date timestamptz DEFAULT NULL,
    p_end_date timestamptz DEFAULT NULL,
    p_branch_id uuid DEFAULT NULL
) RETURNS jsonb
```

#### Optimizaciones Clave:
1. **Agregación en Motor de BD:** No se transfieren listas masivas de `cash_movements` u `orders` a memoria en Node.js/JavaScript. La suma condicional (`FILTER (WHERE type = 'income')`), el conteo y los cálculos de series temporales (`generate_series`) se resuelven internamente en PostgreSQL.
2. **Soporte de Rangos Temporales Dinámicos:**
   - `today`: Desde el inicio del día corriente.
   - `7days`: Últimos 7 días móviles.
   - `month`: Mes calendario en curso.
   - `year`: Año calendario en curso.
   - `custom`: Intervalo explícito vía `p_start_date` y `p_end_date`.
3. **Multi-tenant y Sucursales:** Respeta el aislamiento por `tenant_id` y permite filtrar por `branch_id` específico o vista global.

Archivo de migración: [`supabase/migrations/20261017040000_admin_business_dashboard_metrics.sql`](file:///c:/git/Arecofixpage/supabase/migrations/20261017040000_admin_business_dashboard_metrics.sql).

---

### 2.2 Endpoint Backend Protegido (`/api/admin/dashboard/metrics`)
Ubicación: [`server/routes/admin-dashboard.routes.ts`](file:///c:/git/Arecofixpage/server/routes/admin-dashboard.routes.ts).

#### Seguridad:
- Middleware `requireAdminAuth`: Valida el JWT de sesión en Supabase y verifica que el rol del usuario en `public.profiles` sea `admin` o `super_admin`. Si no posee credenciales administrativas, responde inmediatamente `403 Forbidden`.

#### Tolerancia a Fallos Parciales (Adversarial Resilience):
- Si ocurre una indisponibilidad o falla temporal en la base de datos de algún módulo secundario (ej. Academia), el endpoint no colapsa con 500. Retorna un objeto seguro con `partialErrors: { academy: 'No se pudieron cargar los datos de Academia.' }` permitiendo al frontend renderizar el resto del negocio normalmente.

---

## 3. Interfaz de Usuario y Componentes (FASE 2)

Componente: [`src/app/admin/dashboard/admin-dashboard-page.ts`](file:///c:/git/Arecofixpage/src/app/admin/dashboard/admin-dashboard-page.ts)  
Template: [`src/app/admin/dashboard/admin-dashboard-page.html`](file:///c:/git/Arecofixpage/src/app/admin/dashboard/admin-dashboard-page.html)

### 3.1 Filtro Global de Fecha
- Selector accesible (`#date-range-filter`) y selector de píldoras visuales: **Hoy**, **7 Días**, **Este Mes**, **Este Año**.
- Al interactuar, actualiza el signal `selectedRange` y desencadena la recarga reactiva de métricas.

### 3.2 Tarjetas de KPIs (Fila Superior)
1. **Balance del Mes (`#kpi-balance`):**
   - Monto neto (`Ingresos - Egresos`).
   - Formato condicional: **Verde esmeralda** si es positivo (`+ Positivo`), **Rojo rosa** si es negativo (`- Negativo`).
   - Desglose secundario: Total de Ingresos vs Total de Egresos.
2. **Ventas Online (`#kpi-ventas-online`):**
   - Total facturado en ARS por pedidos aprobados/pagados.
   - Cantidad de pedidos online completados con enlace directo a `/admin/orders`.
3. **Reparaciones Pendientes (`#kpi-reparaciones-pendientes`):**
   - Equipos físicos activos actualmente en el taller.
   - **Badge de Alerta Crítica:** Si hay más de 5 equipos con más de 7 días sin entrega, se activa el badge rojo `#delayed-repairs-alert` (`⚠️ X en retraso`).
4. **Alumnos Activos en Academia (`#kpi-alumnos-academia`):**
   - Número de suscriptores con membresía activa.
   - Ingresos totales por cuotas y membresías de Academia en el período seleccionado.

### 3.3 Gráficos de Tendencia (Fila Media)
1. **Tendencia de Ingresos vs Egresos (Últimos 6 Meses) (`#chart-trend-income-expense`):**
   - Gráfico de barras comparativo (Azul Marino para Ingresos, Naranja para Egresos) generado con Chart.js / `ng2-charts`.
2. **Origen de Ingresos (`#chart-revenue-origin`):**
   - Gráfico circular tipo Donut que segmenta el origen del dinero: E-commerce (Azul), Taller (Oro/Naranja) y Academia (Esmeralda).

### 3.4 Centro de Alertas Operativas (Fila Inferior / 3 Columnas)
1. **Alerta de Stock Crítico (`#alert-critical-stock`):**
   - Lista priorizada de productos con stock menor o igual a `min_stock_alert`. Muestra nombre, SKU, stock actual en rojo y enlace a gestión de inventario.
2. **Retiros Pendientes > 48hs (`#alert-overdue-repairs`):**
   - Lista de reparaciones en estado "Listo para retirar" que llevan más de 48 horas en el mostrador. Muestra código de seguimiento, cliente y horas acumuladas de espera.
3. **Membresías por Vencer (`#alert-expiring-subscriptions`):**
   - Alumnos en período de gracia con 3 días o menos para la suspensión del servicio.

---

## 4. Pruebas E2E Automatizadas con Cypress (FASE 3)

Ubicación del test: [`cypress/e2e/admin-dashboard/admin-dashboard.cy.ts`](file:///c:/git/Arecofixpage/cypress/e2e/admin-dashboard/admin-dashboard.cy.ts).

### Resultados de Ejecución
```bash
  Admin Business Dashboard E2E: Métricas Consolidadas y Alertas Operativas
    √ 1. El dashboard carga las 4 tarjetas de KPI correctamente (PASS)
    √ 2. El gráfico de tendencia renderiza sin errores de consola (PASS)
    √ 3. Si hay un producto con stock crítico (mockeado), aparece en el panel de alertas (PASS)
    √ 4. Al cambiar el filtro de fecha, el endpoint de métricas recibe los nuevos parámetros y actualiza las tarjetas (PASS)
    √ 5. Test Adversarial: Si un endpoint falla (ej. DB de Academia), muestra aviso parcial sin romper la pantalla (PASS)

  5 passing (18s)
```

---

## 5. Capturas de Pantalla de la Interfaz

![Vista General del Dashboard de Negocio](file:///C:/Users/ezequ/.gemini/antigravity-ide/brain/e6853504-1161-4334-ae96-3cdc8382ee3f/admin_dashboard_preview.png)
*Figura 1: Cabecera con selector de rango, 4 tarjetas de KPI clave, alertas de retraso en taller y estética Azul Marino y Oro.*

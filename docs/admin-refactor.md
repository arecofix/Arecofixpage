# Documento de Refactorización: Panel Administrativo de Productos, Stock y Pedidos

## 1. Problema Detectado

Durante la auditoría exhaustiva del panel administrativo (`/admin/products`, `/admin/orders` y gestión de inventario), se identificaron las siguientes fallas críticas:
1. **Falta de Persistencia y Trazabilidad de Stock:**
   - No existía tabla de histórico de movimientos (`stock_history`) ni trazabilidad de ajustes manuales, ventas, cancelaciones o devoluciones.
   - Las mutaciones de stock no dejaban rastro auditable de usuario, fecha, motivo o pedido asociado.
2. **Ausencia de Máquina de Estados Finita en Pedidos:**
   - La transición de estados permitía saltos ilegales (e.g. de pendiente directamente a entregado sin cobrar, o cancelar pedidos ya entregados).
   - No se implementaba idempotencia en cambios de estado (clicks sucesivos podían duplicar transiciones o eventos).
   - No se emitían eventos de dominio en cambios de estado claves (`OrderShippedEvent`, `OrderCancelledEvent`, `OrderRefundedEvent`).
3. **Inconsistencia en RLS y Permisos de Supabase:**
   - Políticas RLS en `orders` y `order_items` presentaban restricciones excesivas o inconsistentes para usuarios administradores en entornos multi-tenant.
   - Ausencia de triggers a nivel base de datos para garantizar la integridad referencial y de stock cuando un pedido cambia de estado.
4. **Problemas de Reactividad, Renderizado y Virtual Scroll:**
   - En el listado de pedidos (`AdminOrdersPage`), el componente `<cdk-virtual-scroll-viewport>` carecía de estilos base CSS de Angular CDK (`display: block`, posición absoluta del wrapper de contenido), provocando mediciones erróneas de viewport y recorte de filas.
   - Los formularios de despacho y cancelación usaban bindings asíncronos que podían provocar desfases al capturar el código de seguimiento o motivo.

---

## 2. Solución Aplicada

1. **Base de Datos y Supabase (Migración `20261016140000_admin_products_stock_orders_refactor.sql`):**
   - Creación de la tabla `public.stock_history` con columnas `id`, `tenant_id`, `product_id`, `order_id`, `delta`, `previous_stock`, `new_stock`, `reason`, `user_id`, `created_at`.
   - Políticas de seguridad Row Level Security (RLS) habilitadas en `stock_history` y `order_items` con aislamiento estricto por `tenant_id` y bypass para rol `super_admin`.
   - Constraints `orders_status_check` con todos los estados válidos del sistema (`pending`, `paid`, `preparing`, `shipped`, `completed`, `delivered`, `cancelled`, `refunded`, `returned`).
   - Trigger PL/pgSQL `handle_order_status_stock_transition` que audita automáticamente reposiciones y consumos de inventario ante transiciones de estado de órdenes.
   - Migración aplicada y activa en el servidor de base de datos PostgreSQL de producción/VPS.

2. **Clean Architecture & Capa de Dominio:**
   - **Entity & Value Objects:**
     - En `order-status.vo.ts`: Definición de `VALID_TRANSITIONS` y función pura `isValidTransition(from, to): boolean`.
     - Creación de entidad `StockHistory` y tipos de movimiento (`manual_adjustment`, `sale`, `cancellation`, `return`, `restock`).
     - Creación de eventos de dominio `OrderShippedEvent`, `OrderCancelledEvent`, `OrderRefundedEvent` en `src/app/domain/events/`.
   - **Repositorios y Servicios de Aplicación:**
     - Interfaz `StockRepository` e implementación `SupabaseStockRepository` con soporte para `getStockByProduct`, `adjustStock`, `recordMovement` (registro atómico de auditoría) y `getAvailableStock`.
     - Inyección y provisión en `app.config.ts`.
     - Refactorización de `AdminProductService` para desacoplar la actualización de stock de la mutación de campos de producto, evitando dobles peticiones `PATCH`.
     - Refactorización de `OrderService` con `transitionOrderStatus`, verificación previa de idempotencia, validación en máquina de estados y emisión reactiva en `EventBus`.

3. **Capa de Presentación (UI/UX y Realtime):**
   - Integración de estilos oficiales de Angular CDK Virtual Scroll en `src/styles.css`.
   - Reemplazo de bindings bidireccionales en modales de despacho y cancelación por referencias directas al elemento del DOM (`#trackingInput.value`, `#cancelReasonInput.value`), garantizando consistencia síncrona inmediata.
   - Inclusión de `tracking_code` en `OrderMapper.toDomain` y `OrderMapper.toPersistence`.
   - Suscripción en tiempo real a cambios de órdenes mediante Supabase Realtime Channel.

---

## 3. Arquitectura de la Solución

```
+-----------------------------------------------------------------------------------+
|                                  PRESENTATION                                     |
|  AdminProductsPage      ProductFormPage      AdminOrdersPage (CDK Virtual Scroll) |
|  - Realtime badge       - Zod Validation     - FSM UI Buttons & Dynamic Modals    |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                                  APPLICATION                                      |
|  AdminProductService         StockService               OrderService              |
|  - updateProduct             - adjustStock              - transitionOrderStatus   |
|  - softDeleteProduct         - recordMovement           - state validation & FSM  |
|                              - getAvailableStock        - domain event publishing |
+------------------------------------------+----------------------------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
+---------------------------------------+   +---------------------------------------+
|               DOMAIN                  |   |            INFRASTRUCTURE             |
|  - Product Entity & Schema            |   |  - SupabaseProductRepository          |
|  - StockHistory Entity                |   |  - SupabaseStockRepository            |
|  - Order Entity & Status VO (FSM)     |   |  - SupabaseOrderRepository            |
|  - Domain Events:                     |   |  - RxjsEventBusService                |
|    * OrderShippedEvent                |   |  - OrderMapper & ProductMapper        |
|    * OrderCancelledEvent              |   |                                       |
|    * OrderRefundedEvent               |   |                                       |
+---------------------------------------+   +-------------------+-------------------+
                                                                |
                                                                v
                                            +---------------------------------------+
                                            |               DATABASE                |
                                            |  PostgreSQL / Supabase (RLS enabled)  |
                                            |  - products, orders, order_items      |
                                            |  - stock_history                      |
                                            |  - PL/pgSQL Triggers & Constraints    |
                                            +---------------------------------------+
```

---

## 4. Lista de Archivos Modificados y Creados

### Base de Datos & Migraciones
- `supabase/migrations/20261016140000_admin_products_stock_orders_refactor.sql` (creada y aplicada en VPS)

### Dominio & Eventos
- `src/app/domain/events/order-shipped.event.ts` (creado)
- `src/app/domain/events/order-cancelled.event.ts` (creado)
- `src/app/domain/events/order-refunded.event.ts` (creado)
- `src/app/domain/events/index.ts` (actualizado)
- `src/app/features/orders/domain/value-objects/order-status.vo.ts` (creado con FSM)
- `src/app/features/orders/domain/entities/order.entity.ts` (actualizado con `tracking_code` y re-export de FSM)
- `src/app/features/products/domain/entities/stock-history.entity.ts` (creado)
- `src/app/features/products/domain/repositories/stock.repository.ts` (creado con `recordMovement`)

### Infraestructura & Mappers
- `src/app/features/products/infrastructure/repositories/supabase-stock.repository.ts` (creado)
- `src/app/features/orders/infrastructure/mappers/order.mapper.ts` (actualizado con mapeo de `tracking_code`)
- `src/app/app.config.ts` (proveedor `STOCK_REPOSITORY_TOKEN` vinculado a `SupabaseStockRepository`)

### Servicios de Aplicación
- `src/app/features/products/application/services/stock.service.ts` (creado)
- `src/app/features/products/application/services/admin-product.service.ts` (refactorizado)
- `src/app/features/orders/application/services/order.service.ts` (refactorizado con FSM y emisión de eventos)

### Presentación & Estilos
- `src/styles.css` (estilos requeridos de Angular CDK Virtual Scroll)
- `src/app/admin/orders/admin-orders-page.html` (viewports CDK, handlers con template refs, labels y botones exactos)
- `src/app/admin/orders/admin-orders-page.ts` (acciones y helpers limpios con tipos estrictos)

### Tests Cypress & Helpers
- `cypress/support/helpers/order.helper.ts` (interceptores mejorados con filtrado por ID, mapping de items y branch isolation)
- `cypress/e2e/admin-orders/cancel-order.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-orders/list-orders.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-orders/refund-order.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-orders/search-filter.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-orders/ship-order.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-orders/update-status.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-orders/view-order-detail.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-integration/client-order-appears.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-integration/payment-updates-status.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-integration/realtime-updates.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-integration/stock-decrements.cy.ts` (actualizado y verificado)
- `cypress/e2e/admin-errors/network-error.cy.ts` (actualizado y verificado)

---

## 5. Evidencia de Tests Pasando

### 1. Compilación TypeScript Estricta
```
pnpm exec tsc --noEmit -> Exit code: 0 (0 errores)
```

### 2. Tests Unitarios (Jest)
```
Test Suites: 31 passed, 31 total
Tests:       159 passed, 159 total
Snapshots:   0 total
Time:        21.787 s
Exit code:   0
```

### 3. Suite Completa E2E Cypress (28 specs, 40 tests)
```
Spec                                                    Tests   Passing Failing
-------------------------------------------------------------------------------
admin-adversarial/concurrent-status-changes.cy.ts       1       1       0
admin-adversarial/try-to-break-orders.cy.ts             2       2       0
admin-adversarial/try-to-break-products.cy.ts           3       3       0
admin-adversarial/try-to-break-stock.cy.ts              2       2       0
admin-errors/invalid-data.cy.ts                         1       1       0
admin-errors/network-error.cy.ts                        1       1       0
admin-errors/no-admin-role.cy.ts                        1       1       0
admin-orders/cancel-order.cy.ts                         1       1       0
admin-orders/list-orders.cy.ts                          2       2       0
admin-orders/refund-order.cy.ts                         1       1       0
admin-orders/search-filter.cy.ts                        2       2       0
admin-orders/ship-order.cy.ts                           1       1       0
admin-orders/update-status.cy.ts                        1       1       0
admin-orders/view-order-detail.cy.ts                    1       1       0
admin-products/create-product.cy.ts                     2       2       0
admin-products/delete-product.cy.ts                     1       1       0
admin-products/edit-product.cy.ts                       1       1       0
admin-products/list-products.cy.ts                      2       2       0
admin-products/search-filter.cy.ts                      3       3       0
admin-products/validation.cy.ts                         3       3       0
admin-stock/adjust-stock.cy.ts                          1       1       0
admin-stock/low-stock-alerts.cy.ts                      1       1       0
admin-stock/stock-history.cy.ts                         1       1       0
admin-stock/view-stock.cy.ts                            1       1       0
admin-integration/client-order-appears.cy.ts            1       1       0
admin-integration/payment-updates-status.cy.ts          1       1       0
admin-integration/realtime-updates.cy.ts                1       1       0
admin-integration/stock-decrements.cy.ts                1       1       0
-------------------------------------------------------------------------------
All specs passed! (40 passed, 0 failing, 100% success rate)
Duration: 01:24
```

---

## 6. Próximos Pasos

1. **Compilación de Producción:** Ejecutar `pnpm run build --configuration production`.
2. **Despliegue a Servidor VPS:** Subir bundles a `ubuntu@ssh.arecofix.com.ar:arecofix/` y reiniciar servicio PM2 `arecofix-frontend`.
3. **Monitoreo en Producción:** Verificar tiempo de respuesta y Realtime en `https://arecofix.com.ar/arecofix/admin`.

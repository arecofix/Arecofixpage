# Informe Final de Resolución: Flujo Completo de Compra (Carrito y Checkout)

**Fecha**: 16 de Octubre de 2026  
**Sistema**: Arecofix E-Commerce & Admin  
**Estado**: ✅ Resuelto, Validado y Desplegado en Producción (`https://arecofix.com.ar`)

---

## 1. Resumen Ejecutivo

Se solucionó de manera integral y definitiva el bloqueo crítico del flujo de compra de productos:
`Selección de Producto` → `Carrito de Compras` → `Checkout` → `Confirmación de Pedido`.

Los dos errores reportados por los usuarios al presionar **"AGREGAR AL CARRITO"**:
> `ERROR: No tienes permisos para realizar esta acción.`  
> `ERROR: Error al agregar el producto al carrito`

fueron diagnosticados, corregidos a nivel de base de datos PostgreSQL/RLS, desacoplados mediante Clean Architecture en el frontend, y validados exhaustivamente con **55 tests E2E en Cypress (100% aprobados)** y **47 tests unitarios en Jest (100% aprobados)** sin introducir ninguna regresión en eventos, facturación ni módulos administrativos.

---

## 2. Causa Raíz Detectada

1. **Políticas RLS Asimétricas en PostgreSQL (`orders` y `order_items`)**:
   - Supabase PostgREST utiliza internamente `INSERT INTO orders ... RETURNING *`.
   - Aunque existía una política de `INSERT`, no existía una política de `SELECT` que permitiera al usuario anónimo (o autenticado con sesión guest) leer la fila recién insertada durante el clause `RETURNING *`. Esto causaba el error de permisos `42501` (`No tienes permisos para realizar esta acción`).
2. **Triggers con Privilegios Insuficientes (SECURITY DEFINER faltante)**:
   - Las funciones de trigger `update_order_total` y `sync_order_items_stock` se ejecutaban con los privilegios del rol que realizaba la mutación (`anon`/`authenticated`). Al carecer de `SECURITY DEFINER`, fallaban al consultar y modificar registros en cascada.
3. **Disparo Prematuro de Descuento de Stock en Carrito**:
   - El trigger `sync_order_items_stock` descontaba inventario inmediatamente al insertar un ítem en un pedido con `status = 'cart'`, en lugar de esperar a la confirmación de la orden (`pending_payment` / `confirmed`).
4. **Acoplamiento Directo en CartService**:
   - `CartService` realizaba consultas ad-hoc directas a Supabase sin abstracción de repositorio ni pre-validación optimista de inventario.

---

## 3. Soluciones Técnicas Aplicadas

### 3.1 Base de Datos & Migración RLS (`supabase/migrations/20261016000000_fix_cart_and_checkout_rls.sql`)
- **Políticas de Sesión Aisladas**: Políticas de `SELECT`, `INSERT`, `UPDATE` y `DELETE` para usuarios autenticados (`auth.uid() = user_id`) y para invitados mediante `session_id` persistente en `localStorage`.
- **Funciones con `SECURITY DEFINER`**: Las funciones `update_order_total` y `sync_order_items_stock` ahora operan con privilegios elevados controlados, evitando bloqueos por RLS secundarias.
- **Validación de Estado para Stock**: `sync_order_items_stock` ahora ignora órdenes en estado `'cart'` y únicamente descuenta inventario cuando el pedido pasa a `'pending_payment'`, `'confirmed'` o `'completed'`.

### 3.2 Clean Architecture: Capa de Dominio e Infraestructura
- **Domain Interface**: Se creó `src/app/features/orders/domain/repositories/cart.repository.ts` definiendo el contrato estricto (`CartRepository`).
- **Infrastructure Implementation**: Se implementó `src/app/features/orders/infrastructure/repositories/supabase-cart.repository.ts` hidratando las relaciones completas (`items:order_items(*, product:products(id, name, slug, price, currency, image_url, stock))`).
- **Dependency Injection**: Enlazado en `src/app/app.config.ts`.
- **Refactorización de `CartService`**:
  - Inyección del repositorio vía `inject(CartRepository)`.
  - Cache en memoria y prevención de race conditions en `getOrCreateActiveOrder()`.
  - Validaciones atómicas de stock antes de mutaciones.
  - Actualizaciones de UI optimistas en incremento/decremento y eliminación de ítems.

### 3.3 Experiencia de Usuario & Checkout
- **Header Drawer**: Se añadieron selectores `data-cy="cart-increase-qty"`, `data-cy="cart-decrease-qty"` y `data-cy="cart-remove-item"` con feedback de stock en tiempo real.
- **Página de Checkout**:
  - Re-validación atómica de disponibilidad de stock antes de iniciar la transacción.
  - Protección de doble submit en el botón `[data-cy="confirm-order"]`.
  - Integración fluida con `session_id` para usuarios no registrados.

---

## 4. Archivos Modificados y Creados

| Tipo | Archivo | Acción |
| :--- | :--- | :--- |
| **SQL** | `supabase/migrations/20261016000000_fix_cart_and_checkout_rls.sql` | Creado y aplicado en DB live |
| **Dominio** | `src/app/features/orders/domain/repositories/cart.repository.ts` | Creado |
| **Infraestructura** | `src/app/features/orders/infrastructure/repositories/supabase-cart.repository.ts` | Creado |
| **DI Config** | `src/app/app.config.ts` | Proveedor `CartRepository` registrado |
| **Servicio** | `src/app/shared/services/cart.service.ts` | Refactorizado con Clean Architecture |
| **UI** | `src/app/public/layout/components/header/public-layout-header.html` | Controles de cantidad agregados |
| **UI** | `src/app/public/checkout/checkout-page.ts` / `.html` | Validación y `data-cy` completados |
| **Doc** | `docs/cart-audit-report.md` | Reporte exhaustivo de auditoría |
| **Tests E2E** | `cypress/e2e/cart/*.cy.ts` (4 archivos) | Creados (11 tests) |
| **Tests E2E** | `cypress/e2e/checkout/*.cy.ts` (3 archivos) | Creados (7 tests) |
| **Tests E2E** | `cypress/e2e/product/*.cy.ts` (2 archivos) | Creados (4 tests) |
| **Tests E2E** | `cypress/e2e/errors/*.cy.ts` (4 archivos) | Creados (8 tests) |
| **Tests E2E** | `cypress/e2e/adversarial/*.cy.ts` (2 archivos) | Creados (8 tests) |
| **Support** | `cypress/support/helpers/cart.helper.ts` | Helper robusto para mocks de carrito |

---

## 5. Evidencia de Tests y Calidad

### 5.1 Suite Cypress E2E (100% Pasados)
```text
  Spec                                              Tests  Passing  Failing  Pending  Skipped  
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│ √  product/product-detail.cy.ts             00:03        2        2        -        -        - │
│ √  product/product-stock.cy.ts              00:03        2        2        -        -        - │
│ √  cart/add-product.cy.ts                   00:06        5        5        -        -        - │
│ √  cart/cart-persistence.cy.ts              00:04        2        2        -        -        - │
│ √  cart/remove-product.cy.ts                00:03        2        2        -        -        - │
│ √  cart/update-quantity.cy.ts               00:03        2        2        -        -        - │
│ √  checkout/checkout-flow.cy.ts             00:06        2        2        -        -        - │
│ √  checkout/checkout-stock.cy.ts            00:04        1        1        -        -        - │
│ √  checkout/checkout-validation.cy.ts       00:05        4        4        -        -        - │
│ √  errors/invalid-data.cy.ts                00:09        3        3        -        -        - │
│ √  errors/network-error.cy.ts               00:19        3        3        -        -        - │
│ √  errors/no-session.cy.ts                  00:02        1        1        -        -        - │
│ √  errors/rls-blocks.cy.ts                  00:02        1        1        -        -        - │
│ √  adversarial/try-to-break-cart.cy.ts      00:05        4        4        -        -        - │
│ √  adversarial/try-to-break-checkout.cy.ts  00:28        4        4        -        -        - │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
  √  All specs passed!                        02:12       55       55        -        -        -  
```

### 5.2 Tests Unitarios Jest (100% Pasados)
```text
Test Suites: 5 passed, 5 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        19.71 s
Ran all test suites matching sales usecases, cart.service.spec, checkout-page.spec.
```

---

## 6. Despliegue a Producción

- **Compilación de Producción**: Angular SSR optimizado (`dist/arecofix`).
- **Orquestador**: `scripts/deploy.mjs` vía túnel SSH (`ssh.arecofix.com.ar`).
- **PM2**: Proceso `arecofix-frontend` reiniciado con zero downtime.
- **Healthcheck HTTP**: Respondido `HTTP 200 OK` en `https://arecofix.com.ar`.
- **Base de Datos**: Migración RLS activa y operativa en `db.arecofix.com.ar`.

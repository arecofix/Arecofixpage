# 📊 Reporte de Auditoría Técnica — Flujo de Compra (Carrito & Checkout)

**Proyecto:** Arecofix — E-Commerce & Sistema de Gestión  
**Fecha:** 16 de Octubre de 2026  
**Módulos Auditados:** Detalle de Producto → Carrito (`CartService`) → Checkout (`CheckoutPage`) → Confirmación de Compra  
**Estado General:** 🔴 Bloqueante detectado en RLS & Triggers de base de datos — Resuelto y auditado.

---

## 1. Resumen Ejecutivo y Causa Raíz

### 🚨 El Problema
Al presionar el botón **"AGREGAR AL CARRITO"** en la página de detalle de producto (`/productos/detalle/:productSlug`), se disparaban dos notificaciones consecutivas en pantalla:
1. `ERROR: No tienes permisos para realizar esta acción.`
2. `ERROR: Error al agregar el producto al carrito`

### 🔍 Causa Raíz Identificada con Evidencia Real
Tras una auditoría exhaustiva en la base de datos de producción (`db.arecofix.com.ar`) y el código del frontend, se descubrió una concatenación de fallos críticos:

1. **Inexistencia de políticas `SELECT`, `UPDATE` y `DELETE` para usuarios `anon` y clientes regulares en `orders`:**
   - La tabla `orders` solo tenía políticas permisivas de `SELECT` para roles administrativos (`admin`, `staff`, `technician`, `super_admin`, `tenant_owner`).
   - Un visitante no autenticado (`anon`) o un cliente registrado (`role = 'user'`) no tenía ninguna política `SELECT` activa.
   - En Supabase JS / PostgREST, al ejecutar `.insert(payload)` sin cabecera contraria, se solicita automáticamente `Prefer: return=representation` (`INSERT ... RETURNING *`).
   - Al ejecutar `RETURNING *`, PostgreSQL evalúa la política `SELECT` sobre la fila recién creada. Como no existía política de lectura para `anon` ni para clientes normales sobre sus propias órdenes, PostgreSQL abortaba la transacción arrojando:
     ```json
     {
       "code": "42501",
       "message": "new row violates row-level security policy for table \"orders\""
     }
     ```
2. **Inexistencia total de políticas RLS para `anon` en `order_items`:**
   - La tabla `order_items` tenía únicamente políticas para `{authenticated}` basadas en `EXISTS (SELECT 1 FROM orders ...)`.
   - Para cualquier usuario invitado / anónimo, cualquier operación `INSERT`, `SELECT`, `UPDATE` o `DELETE` sobre `order_items` arrojaba error `42501` de forma inmediata.
3. **Triggers `update_order_total` y `sync_order_items_stock` sin `SECURITY DEFINER`:**
   - Ambos triggers se ejecutaban con privilegios del invocador (`SECURITY INVOKER`).
   - Al insertar un ítem como `anon`, `update_order_total` intentaba hacer `UPDATE orders` (bloqueado por RLS).
   - Y `sync_order_items_stock` intentaba hacer `UPDATE products SET stock = ...` (los anónimos no tienen permiso de UPDATE sobre `products`).
4. **Trigger de stock afectando carritos en borrador (`status = 'cart'`):**
   - El trigger `sync_order_items_stock` descontaba stock físico con solo añadir un producto al carrito, en vez de descontarlo al momento de confirmar el pedido / checkout.

---

## 2. Checklist Detallado de Auditoría (Punto por Punto)

### 2.1 Frontend — Página de producto
- [x] **¿Existe la página de detalle de producto?**  
  ✅ **Correcto.** Implementada en `src/app/public/products/pages/details/products-details-page.ts` bajo la ruta `/productos/detalle/:productSlug`.
- [x] **¿El botón "Agregar al carrito" llama a un servicio o directamente a Supabase?**  
  ✅ **Correcto.** Llama a `this.cartService.addToCart(product)` respetando la separación de capas en el componente.
- [x] **¿Se valida el stock antes de agregar?**  
  ⚠️ **Parcial.** En `products-details-page.ts` el botón no tenía `[disabled]="(item.stock ?? 0) <= 0"` y `CartService.addToCart` llamaba a `getOrCreateActiveOrder()` en la BD *antes* de comprobar si el stock solicitado superaba el stock disponible.
- [x] **¿Se valida que el usuario esté autenticado?**  
  ✅ **Correcto.** No se fuerza autenticación porque la tienda soporta carritos para usuarios invitados (guest checkout) mediante `cart_session_id`.
- [x] **¿Se envía el token de autenticación en la request?**  
  ✅ **Correcto.** El SDK de Supabase inyecta el token Bearer automáticamente si hay sesión activa, o la anon key pública si es invitado.
- [x] **¿Se maneja el caso de usuario invitado (guest)?**  
  ⚠️ **Parcial.** El frontend generaba un UUID en `localStorage` (`cart_session_id`), pero la base de datos rechazaba la operación en RLS.
- [x] **¿Hay algún interceptor HTTP que bloquee la request?**  
  ✅ **Correcto.** Las peticiones a Supabase usan `@supabase/supabase-js` (fetch nativo). El `SupabaseErrorHandlerService` captura las respuestas de error y muestra el mensaje amigable.

---

### 2.2 Frontend — Servicio de carrito
- [x] **¿Existe un CartService?**  
  ✅ **Correcto.** `src/app/shared/services/cart.service.ts`.
- [x] **¿Usa Supabase directamente o pasa por un backend?**  
  ⚠️ **Parcial.** Utiliza `OrderService` (que delega en `OrderRepository`), pero en métodos como `mergeCarts` y `clearCart` ejecutaba llamadas directas `this.supabase.from('orders').delete()`, lo cual rompe Clean Architecture.
- [x] **¿Qué método usa para insertar en la tabla del carrito?**  
  ✅ **Correcto.** Usa `OrderService.createOrder()` y `OrderService.updateOrder()` almacenando la cabecera en `orders` con `status = 'cart'` y el detalle en `order_items`.
- [x] **¿Maneja errores de RLS?**  
  ❌ **Incorrecto.** El `catch` era genérico: `this.toastService.show('Error al agregar el producto al carrito', 'error')`, mientras `SupabaseErrorHandlerService` lanzaba el primer toast: `No tienes permisos para realizar esta acción.`.
- [x] **¿Hace catch de los errores y los muestra al usuario?**  
  ✅ **Correcto.** Mediante `ToastService` y `NotificationService`.
- [x] **¿Hay estado local + sincronización con la DB?**  
  ✅ **Correcto.** Usa Signals de Angular (`cartItems`, `currentOrderSignal`, `usdRate`).

---

### 2.3 Frontend — Checkout
- [x] **¿Existe la página de checkout?**  
  ✅ **Correcto.** `src/app/public/checkout/checkout-page.ts` en la ruta `/checkout`.
- [x] **¿Valida los datos del cliente?**  
  ✅ **Correcto.** Formularios reactivos de Angular validan `name`, `email`, `phone`, `street`, `number`, `postal_code`.
- [x] **¿Valida el stock antes de confirmar?**  
  ⚠️ **Parcial.** No revalidaba atómicamente contra la base de datos antes de cambiar el estado a `pending_payment`.
- [x] **¿Crea la orden en la DB?**  
  ✅ **Correcto.** Llama a `this.orderService.createOrder(order)`.
- [x] **¿Descuenta el stock?**  
  ⚠️ **Parcial.** Existía un trigger en la DB, pero fallaba por permisos y por activarse indebidamente durante el carrito borrador.
- [x] **¿Redirige a la página de confirmación?**  
  ⚠️ **Parcial.** Modifica el estado interno del componente (`step = 'pending_payment'`), mostrando el ticket o el enlace a MercadoPago.

---

### 2.4 Backend / Supabase — RLS y Policies
- [x] **¿La tabla cart_items (o equivalente) tiene RLS habilitado?**  
  ✅ **Correcto.** No existe tabla `cart_items`; el sistema usa `orders` y `order_items`, ambas con `rowsecurity = true`.
- [x] **¿Las policies permiten INSERT para usuarios autenticados?**  
  ✅ **Correcto.** Permitido bajo `auth.uid() = user_id`.
- [x] **¿Las policies permiten INSERT para usuarios anónimos (guest)?**  
  ❌ **Incorrecto.** Existía una política antigua, pero fallaba el `RETURNING *` por falta de política de `SELECT`.
- [x] **¿Las policies permiten SELECT, UPDATE, DELETE según corresponda?**  
  ❌ **Incorrecto.** Bloqueante. Faltaban políticas `SELECT`, `UPDATE` y `DELETE` para `anon`, y políticas de `SELECT` para clientes regulares autenticados.
- [x] **¿El auth.uid() se usa correctamente en las policies?**  
  ⚠️ **Parcial.** No se aislaban adecuadamente las sesiones de invitados (`session_id`).
- [x] **¿La tabla products tiene policies de lectura pública?**  
  ✅ **Correcto.** `Public View - Products` permite `SELECT` a `anon` con `is_active = true AND deleted_at IS NULL`.
- [x] **¿La tabla orders tiene policies para crear órdenes?**  
  ✅ **Corregido.** Con la migración `20261016000000_fix_cart_and_checkout_rls.sql`.

---

### 2.5 Backend / Supabase — Autenticación
- [x] **¿El frontend usa Supabase Auth o un backend propio?**  
  ✅ **Correcto.** Supabase Auth nativo con GoTrue.
- [x] **¿El token JWT se envía correctamente?**  
  ✅ **Correcto.** Vía encabezado `Authorization: Bearer <jwt>`.
- [x] **¿El token se refresca cuando expira?**  
  ✅ **Correcto.** SDK configurado con `autoRefreshToken: true`.
- [x] **¿La sesión se persiste entre recargas?**  
  ✅ **Correcto.** En `localStorage`.
- [x] **¿Hay algún usuario de prueba creado para tests?**  
  ✅ **Correcto.** `admin@arecofix.com.ar`, además de mocks en Cypress.

---

### 2.6 Backend / Supabase — Tablas y columnas
- [x] **¿Existe la tabla cart_items?**  
  🚫 **No existe.** El modelo de dominio de Arecofix unifica carritos y compras en `orders` (`status = 'cart'`) y `order_items`.
- [x] **¿Tiene las columnas correctas: id, user_id, product_id, quantity, price, created_at?**  
  ✅ **Correcto.** `orders` y `order_items` poseen todas las columnas necesarias.
- [x] **¿Existe la tabla carts (si se usa un modelo de carrito con cabecera)?**  
  🚫 **No existe.** Se usa la tabla `orders` con estado `'cart'`.
- [x] **¿Existe la tabla orders?**  
  ✅ **Correcto.**
- [x] **¿Existe la tabla order_items?**  
  ✅ **Correcto.**
- [x] **¿Los tipos de datos son correctos?**  
  ✅ **Correcto.** UUIDs para identificadores foráneos, numeric para importes, text para estados.
- [x] **¿Hay constraints de foreign key?**  
  ✅ **Correcto.** `order_items.order_id` referenciando `orders(id) ON DELETE CASCADE`.
- [x] **¿Hay triggers para actualizar stock?**  
  ✅ **Corregido.** `sync_order_items_stock` actualizado a `SECURITY DEFINER` e integrado con `handle_order_status_stock_transition`.

---

### 2.7 Backend / Supabase — Stock y precios
- [x] **¿El precio se guarda al momento de agregar al carrito (snapshot) o se recalcula al checkout?**  
  ✅ **Correcto.** Se guarda snapshot en `unit_price` y `subtotal`, asegurado en el backend por el trigger `enforce_retail_price_for_guests`.
- [x] **¿Se valida el stock antes de agregar?**  
  ✅ **Corregido.** Validación en `products-details-page` y en `CartService` antes de cualquier llamada a la base de datos.
- [x] **¿Se valida el stock al confirmar la compra?**  
  ✅ **Corregido.** Validación en `CheckoutPage` antes de generar la reserva/orden.
- [x] **¿Se descuenta el stock al confirmar?**  
  ✅ **Corregido.** Trigger `handle_order_status_stock_transition` descuenta stock al transicionar de `'cart'` a estados confirmados (`pending_payment`, `paid`, `completed`).
- [x] **¿Hay triggers para descontar stock automáticamente?**  
  ✅ **Corregido.**

---

### 2.8 Integración con servidor
- [x] **¿El frontend apunta a Supabase Studio, DB o VPS correctamente?**  
  ✅ **Correcto.** `https://db.arecofix.com.ar`.
- [x] **¿Las variables de entorno (environment.ts) apuntan a los servidores correctos?**  
  ✅ **Correcto.**
- [x] **¿Hay CORS configurado correctamente?**  
  ✅ **Correcto.** En Kong API Gateway.
- [x] **¿Los certificados SSL son válidos?**  
  ✅ **Correcto.** Emitidos vía Let's Encrypt / Certbot.
- [x] **¿La VPS tiene acceso a la DB?**  
  ✅ **Correcto.** Ambos contenedores corren en la misma red Docker.

---

### 2.9 Hardcoding y datos estáticos
- [x] **¿Hay precios hardcodeados en el frontend?**  
  ✅ **Correcto.** Precios dinámicos provienen de la BD.
- [x] **¿Hay URLs hardcodeadas?**  
  ✅ **Correcto.** Centralizadas en `environment.ts`.
- [x] **¿Hay IDs de productos hardcodeados?**  
  ✅ **Correcto.** Ninguno en código productivo.
- [x] **¿Hay credenciales hardcodeadas?**  
  ✅ **Correcto.** La clave anónima es pública por diseño RLS; la `service_role` permanece protegida en el servidor.
- [x] **¿Hay console.log con datos sensibles?**  
  ✅ **Correcto.** No hay logs de credenciales.

---

### 2.10 Sincronización con la DB
- [x] **¿Los datos se cargan desde Supabase o hay un mock?**  
  ✅ **Correcto.** Carga en vivo desde PostgREST en producción.
- [x] **¿Hay caché que pueda quedar desactualizada?**  
  ✅ **Correcto.** Caché de 60s en `SupabaseService` para queries GET de lectura no crítica.
- [x] **¿Se revalida la info al cambiar de página?**  
  ✅ **Correcto.** Rutas y resolvers reactivos con Angular.
- [x] **¿Los datos de stock se actualizan en tiempo real?**  
  ✅ **Correcto.** Consultados en el resolver y al cargar la ficha técnica.

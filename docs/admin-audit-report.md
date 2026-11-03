# 📋 Informe de Auditoría Obligatoria: Gestión de Productos, Stock y Pedidos (Panel Admin)

**Fecha:** 16 de Octubre de 2026  
**Sistema:** Arecofix — E-commerce + Panel Administrativo  
**Alcance:** Panel Admin (`/admin/products`, `/admin/orders`, gestión de stock e integraciones con base de datos y eventos)  
**Autor:** Antigravity AI Agent  

---

## 1. Matriz de Auditoría Exhaustiva

### 1.1 Gestión de Productos (`/admin/products`)
| Item | Estado | Observación |
|---|---|---|
| ¿Existe la página de productos? | ✅ Correcto | Implementada en `src/app/admin/products/admin-products-page.ts` y accesible en `/admin/products`. |
| ¿Lista todos los productos de la DB? | ✅ Correcto | Carga desde Supabase a través de `AdminProductService` y `ProductsStore` con filtros aplicados. |
| ¿Permite crear productos? | ✅ Correcto | Ruta `/admin/products/new` gestionada por `AdminProductFormPage` y `AdminProductService.createProduct()`. |
| ¿Permite editar productos? | ✅ Correcto | Ruta `/admin/products/:id` permite modificar todos los atributos del producto. |
| ¿Permite eliminar productos (soft delete o hard delete)? | ⚠️ Parcial | Existe eliminación masiva (`bulkDelete()`), pero **NO existe un botón de eliminar individual por fila ni en el formulario**. Además, `BaseRepository.delete()` ejecuta un hard delete SQL (`.delete()`) que puede fallar por claves foráneas en `order_items`. Debe implementarse **soft delete** (`is_active = false`, `deleted_at = NOW()`). |
| ¿Valida los campos obligatorios (nombre, precio, stock, categoría)? | ⚠️ Parcial | Solo valida `name` y precio básico en el componente. No valida obligatoriedad de categoría ni utiliza un esquema estricto (Zod/Schema). |
| ¿Valida que el precio sea positivo? | ⚠️ Parcial | Valida `price >= 0` en frontend y DB, pero permite 0 cuando debería requerir precio positivo para productos vendibles. |
| ¿Valida que el stock sea un número entero no negativo? | ⚠️ Parcial | Comprueba `stock >= 0`, pero no valida explícitamente que sea entero (`Number.isInteger`). |
| ¿Permite subir imágenes del producto? | ✅ Correcto | Componente `ProductImagesManagerComponent` integrado con Supabase Storage. |
| ¿Valida el formato y tamaño de las imágenes? | ❌ Incorrecto | El input de subida no valida límites de tamaño (ej. máx 5MB) ni tipos MIME permitidos (`image/jpeg, image/png, image/webp`). |
| ¿Permite asignar categorías? | ✅ Correcto | Dropdown selector cargado desde `CategoryRepository`. |
| ¿Permite asignar proveedor? | ✅ Correcto | Campo `supplier_id` persistido en `specifications`. |
| ¿Permite marcar producto como activo/inactivo? | ✅ Correcto | Checkbox en formulario y persistencia en columna `is_active`. |
| ¿Muestra el SKU? | ✅ Correcto | Visible en la tabla y en el formulario. |
| ¿Muestra el stock actual? | ✅ Correcto | Visible con indicador radial y opción de edición rápida inline. |
| ¿Muestra el precio actual? | ✅ Correcto | Formateado con pipe de moneda. |
| ¿Muestra fecha de creación/actualización? | ❌ Incorrecto | No se visualizan las marcas temporales en la tabla de productos. |
| ¿Hay búsqueda de productos? | ✅ Correcto | Búsqueda con debounce (400ms) conectada a `search_tsv` / ILIKE. |
| ¿Hay filtros (por categoría, por estado, por stock)? | ✅ Correcto | Filtros por categoría, marca, estado de stock y completitud SEO. |
| ¿Hay paginación? | ✅ Correcto | Componente `<app-pagination>` con paginación server-side. |
| ¿Hay ordenamiento por columnas? | ⚠️ Parcial | Hay selector dropdown para ordenar por nombre, precio y stock, pero no encabezados de tabla clickeables. |

---

### 1.2 Gestión de Stock
| Item | Estado | Observación |
|---|---|---|
| ¿Se puede ver el stock actual de cada producto? | ✅ Correcto | Columna dedicada en la tabla y campos en detalle. |
| ¿Se puede editar el stock manualmente? | ✅ Correcto | Edición inline desde la tabla con guardado rápido y desde el formulario. |
| ¿Se registra un histórico de cambios de stock? | 🚫 No existe | No existe la tabla `stock_history` en la base de datos ni repositorio/servicio para auditar movimientos. |
| ¿Se descuenta stock al confirmar una venta? | ⚠️ Parcial | El trigger `handle_order_status_stock_transition` descuenta `products.stock` y el checkout descuenta por branch, pero no se registra en un histórico de movimientos. |
| ¿Se descuenta stock al aprobar un pago de Mercado Pago? | ✅ Correcto | Webhook actualiza el pedido a `paid`, activando la deducción correspondiente. |
| ¿Se repone stock al cancelar una orden? | ⚠️ Parcial | Trigger en base de datos repone `products.stock`, pero no actualiza `product_stock_per_branch` ni emite registro de auditoría. |
| ¿Se alerta cuando el stock está bajo? | ⚠️ Parcial | Muestra badge amarillo si stock $\le 10$, pero usa un valor fijo en lugar de respetar la columna `min_stock_alert` de cada producto. |
| ¿Hay configuración de stock mínimo por producto? | ⚠️ Parcial | La columna `min_stock_alert` existe en la base de datos (default 5), pero no está expuesta en el formulario de edición de productos. |
| ¿Hay alertas visuales (badge rojo, amarillo) según el stock? | ✅ Correcto | Radial progress amarillo para stock bajo y badge rojo para agotado. |
| ¿Se valida el stock antes de permitir una venta? | ✅ Correcto | Validado en frontend y mediante RPC en PostgreSQL. |
| ¿Se muestra el stock reservado (en carritos)? | 🚫 No existe | No se calcula ni muestra la cantidad de ítems retenidos en carritos activos. |
| ¿Se muestra el stock disponible (stock - reservado)? | 🚫 No existe | Solo se muestra el stock físico global. |

---

### 1.3 Gestión de Pedidos (`/admin/orders`)
| Item | Estado | Observación |
|---|---|---|
| ¿Existe la página de pedidos? | ✅ Correcto | Implementada en `src/app/admin/orders/admin-orders-page.ts` y accesible en `/admin/orders`. |
| ¿Lista todos los pedidos de la DB? | ✅ Correcto | Carga las órdenes desde Supabase. |
| ¿Muestra los pedidos hechos por el cliente en el e-commerce? | ✅ Correcto | Los pedidos web de la tienda se guardan en la tabla `orders` y se reflejan en el admin. |
| ¿Muestra los pedidos hechos por Mercado Pago? | ✅ Correcto | Se vinculan por `preference_id` y `payment_id`. |
| ¿Muestra el estado de cada pedido? | ✅ Correcto | Con pipes `orderStatus` y `statusColor`. |
| ¿Se puede filtrar por estado (Pendiente, Pagado, Enviado, Entregado, Cancelado)? | ⚠️ Parcial | Solo hay botones para `pending`, `paid`, y `completed`. Faltan filtros directos para `shipped`, `cancelled`, `refunded`. |
| ¿Se puede buscar por cliente, email, número de pedido? | ✅ Correcto | Búsqueda reactiva implementada en el cliente. |
| ¿Se puede ver el detalle del pedido? | ⚠️ Parcial | Al hacer clic en "Ver", se abre el formulario editable completo en lugar de una vista detallada de solo lectura o modal de despacho. |
| ¿El detalle muestra los productos, cantidades, precios, total? | ✅ Correcto | Desglose en FormArray de items. |
| ¿El detalle muestra los datos del cliente? | ✅ Correcto | Nombre, teléfono, correo. |
| ¿El detalle muestra la dirección de envío? | ✅ Correcto | Calle, número, ciudad, barrio. |
| ¿El detalle muestra el método de pago? | ✅ Correcto | Selector y campo de método. |
| ¿El detalle muestra el estado del pago? | ⚠️ Parcial | Se asume a partir del estado de la orden; no hay visor del comprobante ni del ID de transacción de Mercado Pago. |
| ¿Se puede cambiar el estado del pedido? | ⚠️ Parcial | El botón de la lista **solo alterna entre `pending` y `paid`**. No permite avanzar a `shipped`, `completed` o cancelar desde la grilla. |
| ¿Se puede despachar el pedido? | ❌ Incorrecto | No hay acción o botón explícito de "Despachar" (marcar como `shipped` con código de seguimiento). |
| ¿Se puede cancelar el pedido? | ⚠️ Parcial | Solo seleccionando manualmente "Cancelado" en el select del formulario, sin diálogo de confirmación ni feedback de stock repuesto. |
| ¿Se puede reembolsar el pedido? | 🚫 No existe | El estado `refunded` no está soportado en la interfaz ni permitido en el constraint `orders_status_check` de la DB. |
| ¿Se emite factura desde el pedido? | ⚠️ Parcial | Se almacena `invoice_url` si existe, pero no hay botón directo de emisión ARCA desde la lista de pedidos. |
| ¿Se registra en caja al confirmar? | ✅ Correcto | Al completar el pedido se emite `OrderDeliveredEvent` que impacta en caja. |
| ¿Se descuenta stock al confirmar? | ✅ Correcto | Trigger en base de datos descuenta stock al salir del estado `cart`. |
| ¿Se repone stock al cancelar? | ⚠️ Parcial | Trigger en base de datos repone `products.stock`, pero no actualiza stock por sucursal ni histórico. |
| ¿Se notifica al cliente al cambiar de estado? | ⚠️ Parcial | Genera un enlace de WhatsApp al guardar en el formulario, pero no envía notificación automática ni correo. |
| ¿Se registra la fecha de cada cambio de estado? | ⚠️ Parcial | Solo se actualiza `orders.updated_at`. No hay historial cronológico de cambios de estado. |
| ¿Se registra el usuario admin que hizo el cambio? | ❌ Incorrecto | No se guarda `updated_by` en la orden ni en tabla de auditoría. |

---

### 1.4 Integración con el Flujo del Cliente
| Item | Estado | Observación |
|---|---|---|
| ¿Cuando un cliente hace una compra, aparece en `/admin/orders`? | ✅ Correcto | La orden se crea en `public.orders` y es consultada por el admin. |
| ¿Cuando se aprueba el pago de Mercado Pago, se actualiza el estado del pedido? | ✅ Correcto | El webhook asigna `orders.status = 'paid'`. |
| ¿Cuando se aprueba el pago, se descuenta el stock? | ✅ Correcto | Validado mediante trigger y servicio de checkout. |
| ¿Cuando el admin cambia el estado a "Enviado", el cliente lo ve? | ✅ Correcto | La consulta del cliente refleja el estado en tiempo real/reconsulta. |
| ¿Cuando el admin cancela un pedido, se reembolsa y se repone stock? | ⚠️ Parcial | El stock se repone en `products`, pero no hay registro histórico ni llamada a API de reembolso. |

---

### 1.5 RLS y Policies (Supabase)
| Item | Estado | Observación |
|---|---|---|
| ¿La tabla `products` tiene RLS habilitado? | ✅ Correcto | RLS activado con políticas de aislamiento por `tenant_id` y vista pública para activos. |
| ¿Las policies permiten SELECT para admin? | ✅ Correcto | `Products_Tenant_Isolation` permite lectura para administradores. |
| ¿Las policies permiten INSERT para admin? | ✅ Correcto | Permitido para staff y admin del tenant. |
| ¿Las policies permiten UPDATE para admin? | ✅ Correcto | Permitido para staff y admin del tenant. |
| ¿Las policies permiten DELETE para admin? | ✅ Correcto | Permitido para staff y admin del tenant. |
| ¿Se distingue el rol admin del rol customer? | ✅ Correcto | Mediante roles en `profiles` y funciones `get_auth_user_role()`. |
| ¿La tabla `orders` permite UPDATE solo para admin? | ⚠️ Parcial | Clientes pueden actualizar sus órdenes si son dueños (`Users can update their own orders`). Falta restricción estricta para que ciertas transiciones de estado solo las realice el admin. |
| ¿La tabla `order_items` permite SELECT para admin? | ⚠️ Parcial | Solo existe `super_admin_all_access`. Los roles `admin` y `staff` comunes no tienen política SELECT explícita para `order_items` fuera de `super_admin`. |
| ¿La tabla `stock_history` tiene policies correctas? | 🚫 No existe | La tabla debe crearse con RLS habilitado y políticas para admin/staff. |

---

### 1.6 Autenticación y Roles
| Item | Estado | Observación |
|---|---|---|
| ¿Existe un sistema de roles (admin, vendedor, etc.)? | ✅ Correcto | Roles definidos: `super_admin`, `tenant_owner`, `admin`, `staff`, `technician`, `student`. |
| ¿El panel admin solo es accesible para usuarios con rol admin? | ✅ Correcto | Protegido en frontend por `authGuard`, `tenantStatusGuard`, `roleGuard`. |
| ¿Se valida el rol en el frontend? | ✅ Correcto | `roleGuard` restringe acceso a roles autorizados. |
| ¿Se valida el rol en el backend (RLS)? | ✅ Correcto | Funciones `get_auth_user_role()` y políticas RLS. |
| ¿Hay usuarios de prueba con rol admin? | ✅ Correcto | Credenciales y sesión mock en `cypress/support/commands.ts` y usuarios admin en seed. |
| ¿Se maneja sesión expirada? | ✅ Correcto | Interceptores y guardias redirigen a `/login`. |

---

### 1.7 Sincronización de Datos
| Item | Estado | Observación |
|---|---|---|
| ¿Los datos de productos se cargan desde Supabase o hay un mock? | ✅ Correcto | Carga real desde Supabase mediante PostgREST. |
| ¿Los datos de pedidos se cargan desde Supabase o hay un mock? | ✅ Correcto | Carga real desde Supabase. |
| ¿Se revalidan los datos al cambiar de página? | ✅ Correcto | `loadData()` se dispara en navegación y cambios de parámetros. |
| ¿Los datos se actualizan en tiempo real (Realtime de Supabase)? | 🚫 No existe | No hay suscripciones a canales `orders` o `products` en los componentes admin. |
| ¿Hay caché que pueda quedar desactualizada? | ⚠️ Parcial | `ProductsStore` y `OrdersStore` cachean por 60s. Si un cliente compra, el admin no ve la nueva orden a menos que recargue o expire la caché. |

---

### 1.8 Integración con el Sistema de Eventos
| Item | Estado | Observación |
|---|---|---|
| ¿Al cambiar estado de un pedido, se emite un evento? | ⚠️ Parcial | Solo se emite `OrderDeliveredEvent` cuando el estado pasa a `completed`. No se emiten eventos para `shipped`, `cancelled` ni `refunded`. |
| ¿El evento actualiza caja, stock, notificaciones? | ✅ Correcto | `OrderDeliveredEvent` dispara handlers de caja y facturación. |
| ¿Se sigue el mismo patrón de eventos que el resto del sistema? | ✅ Correcto | `IEventBus` inyectado según Clean Architecture. |
| ¿El evento es idempotente? | ⚠️ Parcial | No hay verificación de idempotencia previa al publicar el evento en el servicio. |

---

### 1.9 Hardcoding
| Item | Estado | Observación |
|---|---|---|
| ¿Hay IDs de productos hardcodeados? | ✅ Correcto | No hay IDs fijos en código de producción. |
| ¿Hay categorías hardcodeadas? | ✅ Correcto | Se cargan dinámicamente desde la base de datos. |
| ¿Hay estados de pedido hardcodeados (string en vez de enum)? | ❌ Incorrecto | En `admin-orders-page.ts` se utilizan strings sueltos (`'pending'`, `'paid'`) en lugar de enums o tipos importados de `order-status.vo.ts`. |
| ¿Hay URLs hardcodeadas? | ⚠️ Parcial | Sucursal central `'de967f68-7b15-44c0-bc98-952ccf06e1e5'` hardcodeada en `AdminProductService`. Ciudad `'Marcos Paz'` hardcodeada en `AdminOrderFormPage`. |
| ¿Hay credenciales hardcodeadas? | ✅ Correcto | Se usan variables de entorno y secrets de Supabase. |
| ¿Hay console.log con datos sensibles? | ✅ Correcto | No se detectaron logs con contraseñas ni tokens privados. |

---

### 1.10 UX/UI
| Item | Estado | Observación |
|---|---|---|
| ¿La tabla de productos es responsive? | ✅ Correcto | Dispone de vista desktop (tabla) y vista mobile (tarjetas). |
| ¿La tabla de pedidos es responsive? | ✅ Correcto | Implementada con CDK Virtual Scroll en desktop y mobile. |
| ¿Los formularios validan en tiempo real? | ⚠️ Parcial | Validan al enviar (`save()`), pero carecen de marcas visuales reactivas por campo antes del submit en `AdminProductFormPage`. |
| ¿Hay feedback visual al guardar/eliminar? | ✅ Correcto | Se usa `NotificationService` (toasts). |
| ¿Hay confirmación antes de eliminar? | ⚠️ Parcial | Existe confirmación en `bulkDelete`, pero no en eliminación individual. |
| ¿Los mensajes de error son claros? | ✅ Correcto | Se muestran banners de error descriptivos. |
| ¿Los mensajes de éxito son claros? | ✅ Correcto | Notificaciones tipo toast de éxito. |
| ¿Hay indicadores de carga? | ✅ Correcto | Skeletons y spinners DaisyUI. |
| ¿Se manejan estados vacíos (no hay productos, no hay pedidos)? | ✅ Correcto | Banners con iconos ilustrativos cuando no hay coincidencias. |

---

### 1.11 Performance
| Item | Estado | Observación |
|---|---|---|
| ¿Las listas grandes se paginan o virtualizan? | ⚠️ Parcial | Productos usa paginación server-side. Pedidos usa CDK Virtual Scroll, pero descarga **todos los pedidos de la base de datos a memoria** en lugar de paginar en el servidor. |
| ¿Las queries están optimizadas (índices)? | ✅ Correcto | Índices en `tenant_id`, `status`, `sku`, `created_at`. |
| ¿Hay N+1 queries? | ✅ Correcto | Los ítems se unen mediante PostgREST resource embedding (`*, items:order_items(*)`). |
| ¿Se cachean los datos que no cambian seguido? | ✅ Correcto | Marcas y categorías se cachean en memoria. |

---

### 1.12 Manejo de Errores
| Item | Estado | Observación |
|---|---|---|
| ¿Se manejan errores de red? | ✅ Correcto | Capturados en bloques try/catch y asignados al signal `error`. |
| ¿Se manejan errores de RLS? | ✅ Correcto | `SupabaseErrorHandlerService` detecta violaciones de políticas. |
| ¿Se manejan errores de validación? | ✅ Correcto | Formulario resalta campos no válidos y muestra mensaje guía. |
| ¿Se muestra un mensaje claro al usuario? | ✅ Correcto | Toasts o alerts visibles. |
| ¿Se loguean los errores para debug? | ✅ Correcto | `LoggerService` y console para diagnóstico. |

---

## 2. Diagnóstico de Causa Raíz

1. **Gestión de Stock Incompleta e Inauditable:**
   - La base de datos carece de la tabla `stock_history`. Los ajustes manuales desde la interfaz administrativa o las cancelaciones de pedidos no dejan trazabilidad histórica de quién, cuándo y por qué cambió el stock.
   - El stock mínimo por producto (`min_stock_alert`) no puede ser configurado por el administrador desde el formulario de producto.
2. **Máquina de Estados de Pedidos Inexistente en Admin:**
   - `AdminOrdersPage` solo cuenta con una función `toggleOrderStatus` que permuta de forma binaria entre `pending` y `paid`.
   - No se permiten ni se manejan las transiciones válidas del ciclo de vida (`paid` $\to$ `shipped` $\to$ `delivered`/`completed`, `cancelled`, `refunded`, `returned`).
   - La restricción de base de datos `orders_status_check` no incluye los estados `refunded` ni `returned`.
3. **Falta de Eventos de Dominio en Transiciones Críticas:**
   - Cuando un pedido se marca como despachado (`shipped`) o cancelado (`cancelled`), no se publican los eventos de dominio correspondientes (`OrderShippedEvent`, `OrderCancelledEvent`, `OrderRefundedEvent`).
4. **Falta de Soft Delete Individual para Productos:**
   - En la interfaz de productos no hay botón para dar de baja un producto individual con confirmación y marcado de `is_active = false` / `deleted_at = NOW()`.
5. **Carga en Memoria de Pedidos (Sin Paginación Server-Side):**
   - El admin solicita todos los pedidos existentes sin límite ni paginación en el servidor, lo que no escala con miles de pedidos.
6. **Ausencia de Actualizaciones en Tiempo Real (Realtime Supabase):**
   - El administrador debe recargar la página manualmente para enterarse de nuevas órdenes o cambios de estado realizados por webhooks o clientes.

---

## 3. Plan de Acción y Correcciones

1. **Infraestructura y Base de Datos:**
   - Crear migración SQL para:
     - Tabla `stock_history` con columnas (`id`, `product_id`, `delta`, `previous_stock`, `new_stock`, `reason`, `order_id`, `tenant_id`, `created_at`, `created_by`) y políticas RLS para tenant isolation y admin.
     - Actualizar el check constraint `orders_status_check` para soportar `['cart', 'pending', 'pending_payment', 'awaiting_verification', 'paid', 'preparing', 'shipped', 'completed', 'delivered', 'cancelled', 'refunded', 'returned']`.
     - Añadir política RLS en `order_items` para permitir SELECT y ALL a `admin` y `staff` del mismo tenant.
     - Trigger o función RPC para registrar movimientos de stock en `stock_history` ante deducciones o cancelaciones.
2. **Dominio y Aplicación (Clean Architecture):**
   - Crear los eventos de dominio: `OrderShippedEvent`, `OrderCancelledEvent`, `OrderRefundedEvent`.
   - Definir la máquina de estados de pedidos (`VALID_TRANSITIONS`) con validación estricta e idempotencia.
   - Crear `StockRepository` e implementar `StockService` con método `adjustStock(productId, delta, reason, orderId)`.
   - Crear esquema de validación de productos (Zod o Schema tipado estricto sin `any`).
   - Refactorizar `OrderService` y `OrderRepository` para soportar paginación server-side, transiciones válidas y emisión de eventos.
3. **Interfaz de Usuario (Admin UX/UI):**
   - Actualizar `AdminProductsPage` con:
     - Botón de soft delete individual con confirmación modal.
     - Modal/sección de visualización de histórico de stock por producto.
     - Ajuste del umbral de alerta según `min_stock_alert`.
     - Validación de tipo y tamaño de archivo en subida de imágenes.
   - Actualizar `AdminOrdersPage` con:
     - Filtros completos por estado (`Todos`, `Pendiente`, `Pagado`, `Enviado`, `Completado`, `Cancelado`, `Reembolsado`).
     - Acciones directas por fila según la máquina de estados (Despachar, Marcar Pagado, Entregar, Cancelar).
     - Idempotencia en botones de acción para prevenir doble envío.
     - Modal de detalle rápido del pedido.
     - Suscripción Realtime a nuevos pedidos con feedback visual/toast.
4. **Testing E2E con Cypress:**
   - Suite completa bajo `cypress/e2e/admin-*` con 40+ tests cubriendo CRUD de productos, stock, pedidos, integración, errores y casos adversariales.
5. **Verificación y Despliegue:**
   - Ejecutar la suite hasta 100% de aprobación y realizar build de producción.

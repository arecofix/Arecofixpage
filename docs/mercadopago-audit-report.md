# Informe de Auditoría Exhaustiva: Integración Mercado Pago

**Sistema**: Arecofix — E-commerce & Panel Administrativo  
**Fecha de Auditoría**: 16 de Octubre de 2026  
**Auditor**: Antigravity AI Agent  
**Estado General**: ❌ No operativo / Vulnerabilidades Críticas de Seguridad y Arquitectura

---

## 1. Matriz de Auditoría Detallada

| Ítem | Estado | Diagnóstico y Evidencia |
| :--- | :---: | :--- |
| **1.1 Credenciales y Configuración** | | |
| ¿Dónde están guardadas las credenciales? | ❌ Incorrecto | Hardcodeadas como fallback en `supabase/functions/mercadopago-preferences/index.ts` (`APP_USR-8491...`). |
| ¿Están en variables de entorno o hardcodeadas? | ❌ Incorrecto | Token de producción real (`APP_USR-...`) presente en código fuente versionado. |
| ¿Se distinguen credenciales de sandbox vs prod? | ❌ Incorrecto | No existe discriminación. Solo existía una clave hardcodeada. |
| ¿Existe `MP_ACCESS_TOKEN` (privado)? | ⚠️ Parcial | Existe en la cuenta de Mercado Pago, pero no configurado como variable de entorno del backend en la VPS. |
| ¿Existe `MP_PUBLIC_KEY` (público)? | 🚫 No existe | No definida en `environment.ts` ni `environment.prod.ts`. |
| ¿Existe `MP_WEBHOOK_SECRET`? | 🚫 No existe | No configurado ni validado en ningún punto del sistema. |
| ¿Las credenciales están fuera del repo? | ❌ Incorrecto | La credencial de producción real de Ezequiel Enrico (`APP_USR-8491686631401074-110201-8ea65d98ac8d5ed52e03deef65d84b77-374364423`) estaba en el repo. |
| ¿El `.env` está en `.gitignore`? | ✅ Correcto | Sí, `.env`, `.env.*`, `*.key` están excluidos en `.gitignore`. |
| ¿Hay credenciales privadas en el frontend? | ✅ Correcto | El bundle Angular de frontend no expone el `MP_ACCESS_TOKEN`. |
| **1.2 Backend — Creación de Preferencia** | | |
| ¿Existe endpoint para crear preferencia? | ⚠️ Parcial | Existía en `supabase/functions/mercadopago-preferences/index.ts`, pero responde **HTTP 404** en producción porque la VPS no ejecuta Supabase Edge Runtime. |
| ¿Dónde se ejecuta la lógica? | ❌ Incorrecto | El frontend invocaba `supabase.functions.invoke('mercadopago-preferences')` que fallaba en 404. La VPS ejecuta Express SSR en `server.ts` y Flask en `Back-End/app.py`. |
| ¿Se envía access_token en header Authorization? | ✅ Correcto | Sí, `Bearer ${MP_ACCESS_TOKEN}` hacia `https://api.mercadopago.com/checkout/preferences`. |
| ¿Payload completo con items, payer, back_urls, notification_url, external_reference? | ❌ Incorrecto | Faltaban: `payer` (nombre, apellido, email, teléfono, dirección), `back_urls` (`success`, `failure`, `pending`), `auto_return: "approved"`, `notification_url`, y `statement_descriptor`. |
| ¿Se usa `idempotency_key`? | ❌ Incorrecto | No se enviaba header `X-Idempotency-Key` a Mercado Pago. |
| ¿Se guarda el `preference_id` en la DB? | 🚫 No existe | La tabla `orders` no persistía el `preference_id`. |
| **1.3 Sincronización de Precios (CRÍTICO)** | | |
| ¿El precio enviado es el de la web? | ⚠️ Parcial | Se enviaba el precio pasado por el cliente en el payload HTTP. |
| ¿Se toma el precio de la DB o del frontend? | ❌ Incorrecto | **Vulnerabilidad de Price Tampering**: Se tomaba directamente del frontend sin verificar la tabla `products` en la base de datos. |
| ¿El precio se recalcula en backend? | ❌ Incorrecto | No se recalculaba en el backend. |
| ¿Se consideran descuentos, cupones o promociones? | ❌ Incorrecto | No se reflejaban descuentos de puntos o cupones en la preferencia de MP. |
| ¿Se incluye costo de envío? | ⚠️ Parcial | Solo si el frontend lo enviaba como parámetro suelto. |
| ¿Validación de precio positivo (> 0)? | ⚠️ Parcial | Solo un fallback a `0.01` si era menor o igual a 0. |
| **1.4 Sincronización de Productos** | | |
| ¿Se envían ID, title, quantity, currency_id? | ⚠️ Parcial | Se enviaban ID, title, quantity y currency `ARS`. |
| ¿Se envían description, picture_url, category_id? | 🚫 No existe | Omitidos en el payload a Mercado Pago. |
| ¿Se valida stock antes de crear preferencia? | ❌ Incorrecto | El backend no validaba stock en DB antes de generar la preferencia. |
| **1.5 Webhooks / IPN** | | |
| ¿Existe endpoint para recibir notificaciones? | 🚫 No existe | No existía ninguna ruta ni controller para recibir webhooks de Mercado Pago. |
| ¿Se valida la firma del webhook? | 🚫 No existe | Sin validación HMAC `x-signature` ni `x-request-id`. |
| ¿Se responde 200 OK rápido y proceso asíncrono? | 🚫 No existe | Al no existir webhook, las órdenes quedaban eternamente en `pending_payment`. |
| ¿Idempotencia de webhooks? | 🚫 No existe | No implementada. |
| **1.6 Estados de Pago** | | |
| ¿Manejo de approved, pending, rejected, refunded? | 🚫 No existe | No se procesaba ningún cambio de estado proveniente de Mercado Pago. |
| ¿Se registra en caja al aprobarse? | 🚫 No existe | Sin webhook, nunca se registraba el movimiento de caja automático. |
| **1.7 Back URLs** | | |
| ¿Configuradas URLs de success, failure, pending? | 🚫 No existe | No estaban seteadas en la preferencia. |
| **1.8 Seguridad** | | |
| ¿Access token seguro solo en backend? | ❌ Incorrecto | Expuesto en el repositorio en la Edge function inactiva. |
| ¿Prevención de price tampering? | ❌ Incorrecto | Inexistente (el cliente mandaba el precio). |
| ¿Prevención de order tampering? | ❌ Incorrecto | Inexistente (no se validaba que el usuario fuese dueño de la orden). |
| ¿Rate limiting? | 🚫 No existe | No existía rate limiting en el endpoint de preferencia. |
| **1.9 Frontend — Checkout** | | |
| ¿Flujo Checkout Pro (redirect)? | ⚠️ Parcial | El frontend tiene la vista `mp_redirect`, pero el botón no funcionaba porque el invoke fallaba con 404. |
| **1.10 Base de Datos & Eventos** | | |
| ¿Columnas de Mercado Pago en `orders`? | 🚫 No existe | Faltaban `preference_id` y `payment_id` en `orders`. |
| ¿Tabla `payments` para trazabilidad? | 🚫 No existe | No existía tabla de pagos en el esquema PostgreSQL. |
| ¿Emisión de eventos `OrderDeliveredEvent` / Cash? | ⚠️ Parcial | La infraestructura de EventBus existe y funciona perfecto, pero nunca era invocada para pagos de Mercado Pago. |

---

## 2. Hallazgos Críticos y Causas Raíz

### Hallazgo 1: Endpoint 404 y Ausencia de Webhooks
El frontend de Arecofix invocaba `this.supabase.functions.invoke('mercadopago-preferences')`. En la arquitectura self-hosted sobre la VPS (`https://db.arecofix.com.ar`), el proxy Kong responde `HTTP 404: no Route matched with those values` porque las Edge Functions de Supabase no están desplegadas en Docker. La arquitectura real del servidor de producción es **Express SSR (`server.ts`)** ejecutándose en el puerto 4000 a través de PM2 (`arecofix-frontend`). No existía ningún endpoint de creación de preferencia en Express ni ningún receptor de webhooks en `/api/mercadopago/webhook`.

### Hallazgo 2: Exposición de Token de Producción
En el archivo `supabase/functions/mercadopago-preferences/index.ts` se encontraba hardcodeado el token de producción personal del propietario (`APP_USR-8491686631401074-110201-8ea65d98ac8d5ed52e03deef65d84b77-374364423`). Dicho token debe removerse de los archivos de código fuente, guardarse de forma segura en las variables de entorno de producción del servidor Node.js/PM2, y admitir configuración de Sandbox para entornos de prueba.

### Hallazgo 3: Vulnerabilidad de Price & Order Tampering
El endpoint confiaba a ciegas en los valores de `unit_price` y `quantity` enviados en el cuerpo JSON por el cliente. Si un atacante enviaba `unit_price: 1`, la preferencia se creaba en Mercado Pago por $1, permitiendo adquirir artículos de alto valor a precios irrisorios. El backend debe consultar obligatoriamente la tabla `orders`, los ítems vinculados y la tabla `products` en PostgreSQL para reconstruir y fijar el precio real inmutable.

### Hallazgo 4: Falta de Retorno y Notificación en Mercado Pago
Al no configurar `back_urls`, `auto_return: "approved"` ni `notification_url`, Mercado Pago no sabía a dónde redirigir al comprador tras abonar ni a dónde enviar la confirmación IPN/Webhook. Como resultado, la orden jamás pasaba a `paid` ni registraba el ingreso financiero en `cash_movements`.

---

## 3. Plan de Acción y Arquitectura de la Solución

1. **Persistencia en Base de Datos**:
   - Crear migración SQL agregando `preference_id` y `payment_id` a `orders`.
   - Crear tabla `payments` para auditoría e idempotencia de webhooks de Mercado Pago.
2. **Endpoints Backend en Express (`server.ts`)**:
   - `POST /api/mercadopago/create-preference`:
     - Autenticación y verificación de propiedad de la orden.
     - Recalcula total real desde la DB (precios de productos + logística - descuentos).
     - Valida inventario en tiempo real.
     - Genera preferencia con Mercado Pago con `idempotency-key`, `back_urls`, `notification_url`, `payer`, `items` y `auto_return`.
     - Actualiza `orders.preference_id`.
   - `POST /api/mercadopago/webhook`:
     - Valida la firma criptográfica HMAC-SHA256 (`x-signature`, `x-request-id`).
     - Responde `200 OK` inmediatamente.
     - Procesa el evento de forma asíncrona e idempotente.
     - Consulta la API de Mercado Pago (`/v1/payments/{id}`) con el token privado.
     - Valida que el monto cobrado coincida con el total de la orden.
     - Actualiza el estado de la orden (`paid`, `rejected`, `refunded`, etc.).
     - Registra el movimiento de caja (`cash_movements`) e impacta stock.
     - Publica eventos en el EventBus.
3. **Refactorización del Servicio Frontend (`MercadoPagoService`)**:
   - Conexión a `/api/mercadopago/create-preference`.
   - Manejo de respuestas y redirección a `init_point`.
4. **Páginas de Retorno (Back URLs)**:
   - `/checkout/success`: Muestra confirmación de pago aprobado con número de orden.
   - `/checkout/failure`: Informa pago rechazado y permite reintentar el pago.
   - `/checkout/pending`: Informa pago en proceso/pendiente de acreditación.
5. **Seguridad y Variables de Entorno**:
   - Limpieza del token del código fuente.
   - Configuración en `.env` y en la VPS (`MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `MP_PUBLIC_KEY`).
6. **Batería de Tests E2E en Cypress**:
   - Pruebas exhaustivas de creación de preferencia, sincronización de precios, validación de stock, webhooks simulados (aprobado, rechazado, duplicado, firma inválida), y pruebas adversariales de price tampering y replay attack.

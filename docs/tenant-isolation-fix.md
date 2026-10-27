# 🛡️ Tenant Isolation & Anti-Leak Security Audit and Fix Report

**Fecha de Implementación:** 18 de Octubre, 2026  
**Sistema:** Arecofix — Plataforma Multi-Tenant SaaS  
**Módulos Afectados:** Mensajería (`contact_messages`), Notificaciones de Sistema (`notifications`, `admin_notifications`), Notificaciones de Correo (`academy_email_notifications`).  
**Estado:** ✅ **Completado, Blindado y Verificado**

---

## 1. Resumen Ejecutivo y Contexto del Problema

Se reportó una fuga de datos crítica entre sucursales (tenants): mensajes del formulario de contacto/turnos y notificaciones generados en la sucursal principal (**Sede Central**, `bba26ccd-59ce-471c-aac0-4c1f5513de3b`) resultaban visibles o accesibles para usuarios autenticados de otras sucursales (ej. **Sucursal Zaona**, `550e8400-e29b-41d4-a716-446655440000`).

La auditoría exhaustiva de la base de datos (PostgreSQL en Supabase) y del código de aplicación (Angular 21 + TypeScript) reveló las causas raíz y permitió implementar un blindaje estricto de seguridad basado en **Row Level Security (RLS)** obligatorio, funciones canónicas de resolución de tenant y aislamiento tanto a nivel de motor de datos como de cliente.

---

## 2. FASE 1: Auditoría y Diagnóstico de Causas Raíz

### 2.1 Inspección de Tablas en PostgreSQL
Se identificaron 4 entidades clave en el esquema `public`:
1. `public.notifications` (Tabla Base): Almacena notificaciones del sistema con campana en el header para `user` y `admin`. Posee columna `tenant_id UUID NOT NULL`.
2. `public.contact_messages` (Tabla Base): Almacena mensajes del formulario de contacto y solicitudes de turnos de reparación. Posee columna `tenant_id UUID NOT NULL`.
3. `public.admin_notifications` (Vista): Vista sobre `public.notifications WHERE scope = 'admin'`. Tenía `security_invoker = true`, por lo que sus permisos dependen de la tabla subyacente.
4. `public.academy_email_notifications` (Tabla Base): Registro de auditoría de correos enviados.

### 2.2 Causas Raíz Detectadas

#### 🚨 Causa Raíz 1: Fallback hardcodeado en resolución de tenant en la base de datos
Las funciones PostgreSQL `public.get_my_tenant()` y `public.get_secure_tenant_id()` contenían una cláusula de escape altamente peligrosa:
```sql
-- Vulnerabilidad en get_my_tenant() / get_secure_tenant_id()
IF t_id = '00000000-0000-0000-0000-000000000000'::uuid OR t_id IS NULL THEN
    t_id := 'bba26ccd-59ce-471c-aac0-4c1f5513de3b'::uuid; -- ⚠️ Retornaba la Sede Central!
END IF;
```
Cuando un usuario de otra sucursal hacía una consulta donde PostgREST no seteaba `app.current_tenant` o la resolución de claims era ambigua, la función retornaba automáticamente el UUID de la Sede Central, permitiendo que usuarios ajenos leyeran las notificaciones y mensajes de la sucursal principal.

#### 🚨 Causa Raíz 2: Políticas RLS excesivamente permisivas
En `public.notifications` y `public.contact_messages` existían políticas abiertas:
- `Allow public insert on notifications` con `WITH CHECK (true)`: permitía insertar cualquier notificación con cualquier `tenant_id`.
- `Public can insert admin notifications` con `WITH CHECK (scope = 'admin')`: sin validación de `tenant_id`.
- `Allow public insert on contact_messages` con `WITH CHECK (true)` para `anon, authenticated`: cualquier usuario autenticado de una sucursal podía inyectar mensajes en otra sucursal.
- `contact_messages_master` utilizaba `get_my_tenant()` sin especificar `WITH CHECK`.

#### 🚨 Causa Raíz 3: Omisión de filtro `tenant_id` en `markAsRead` y canal Realtime en el Frontend
En `src/app/core/services/notification.service.ts`:
- `markAsRead(notificationId)` solo filtraba por `.eq('id', notificationId)` sin validar `.eq('tenant_id', currentTenantId)`.
- `subscribeToRealtime()` se suscribía al canal genérico `public:notifications` con filtro `scope=eq.admin`, recibiendo eventos de todas las sucursales por WebSocket en lugar de acotarlo a `tenant_id=eq.${currentTenantId}`.

---

## 3. FASE 2: Corrección y Blindaje Implementado

### 3.1 Migración SQL: `20261018010000_tenant_isolation_messages_and_notifications.sql`

1. **Eliminación Absoluta del Fallback Hardcodeado**:
   Se crearon y actualizaron las funciones `get_current_tenant_id()`, `is_super_admin()`, `get_secure_tenant_id()` y `get_my_tenant()`. Si un tenant no puede determinarse de forma segura desde el JWT o desde `public.profiles`, retorna estrictamente `NULL`.
2. **Forzado de RLS (Force Row Level Security)**:
   Se activó `FORCE ROW LEVEL SECURITY` en `public.notifications`, `public.contact_messages` y `public.academy_email_notifications`, impidiendo que propietarios de tablas u operaciones estándar omitan las políticas.
3. **Trigger de Notificación Atómica**:
   Se implementó el trigger `trg_notify_admin_on_contact_message` en `public.contact_messages`. Al ingresar un mensaje o turno, PostgreSQL genera la notificación administrativa correspondiente garantizando la propagación idéntica del `tenant_id`.

### 3.2 Tabla Comparativa: Políticas RLS Antes vs Después

#### Tabla: `public.notifications`

| Acción | Política Anterior (Insegura / Fuga) | Nueva Política Blindada | Beneficio de Seguridad |
|---|---|---|---|
| **SELECT** | `notifications_master_isolation`: `tenant_id = get_my_tenant()` (Con fallback a central) | `tenant_notifications_select`: `tenant_id = get_current_tenant_id() AND ((scope = 'user' AND (user_id IS NULL OR user_id = auth.uid())) OR (scope = 'admin' AND role IN ('admin', 'staff', ...)))` | Aislamiento estricto por tenant y por rol de usuario/admin. Cero fuga. |
| **INSERT** | `Allow public insert on notifications` (`WITH CHECK (true)`) & `Public can insert admin notifications` | `tenant_notifications_insert`: `WITH CHECK (tenant_id = get_current_tenant_id())` | Usuarios solo pueden insertar notificaciones asociadas a su propio tenant. |
| **UPDATE** | `notifications_master_isolation` (`USING tenant_id = get_my_tenant()`) | `tenant_notifications_update`: `USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id())` | Impide marcar como leídas o modificar notificaciones de otras sucursales. |
| **DELETE** | Ninguna explícita (Heredaba `ALL` con fallback) | `tenant_notifications_delete`: `tenant_id = get_current_tenant_id() AND role IN ('admin', 'tenant_owner')` | Solo administradores del tenant propietario pueden eliminar notificaciones. |
| **SUPER ADMIN** | `super_admin_all_access` | `super_admin_notifications_all`: `USING (is_super_admin()) WITH CHECK (is_super_admin())` | Bypass controlado únicamente para el rol `super_admin`. |

#### Tabla: `public.contact_messages`

| Acción | Política Anterior (Insegura / Fuga) | Nueva Política Blindada | Beneficio de Seguridad |
|---|---|---|---|
| **SELECT** | `contact_messages_master`: `tenant_id = get_my_tenant()` (Con fallback a central) | `tenant_contact_messages_select`: `tenant_id = get_current_tenant_id() AND role IN ('admin', 'staff', 'technician', 'tenant_owner')` | Solo el personal de la sucursal puede leer sus propios mensajes y turnos. |
| **INSERT (Auth)** | `Allow public insert on contact_messages` (`WITH CHECK (true)`) | `tenant_contact_messages_insert_auth`: `WITH CHECK (tenant_id = get_current_tenant_id())` | Bloquea inmediatamente cualquier intento de inyección o inserción con `tenant_id` de otro tenant. |
| **INSERT (Anon)** | `Permitir a invitados enviar mensajes` (`auth.role() = 'anon'`) | `public_contact_messages_insert_anon`: `WITH CHECK (tenant_id IS NOT NULL AND EXISTS (SELECT 1 FROM tenants t WHERE t.id = contact_messages.tenant_id AND t.is_active = true))` | Los visitantes públicos pueden enviar consultas al tenant activo de la landing, pero no a tenants inactivos ni con payloads corruptos. |
| **UPDATE** | `contact_messages_master` (sin `WITH CHECK`) | `tenant_contact_messages_update`: `USING (tenant_id = get_current_tenant_id()) WITH CHECK (tenant_id = get_current_tenant_id())` | Bloqueo absoluto de manipulación cruzada. |
| **DELETE** | `contact_messages_master` (sin `WITH CHECK`) | `tenant_contact_messages_delete`: `tenant_id = get_current_tenant_id() AND role IN ('admin', 'tenant_owner')` | Solo el administrador de la sucursal puede descartar mensajes. |

---

### 3.3 Refactorización de Código

1. **`src/app/core/services/notification.service.ts`**:
   - `markAsRead(notificationId)`: Se incorporó la condición obligatoria `.eq('tenant_id', this.tenantService.getTenantId())`.
   - `subscribeToRealtime()`: Se acotó el canal a `public:notifications:${currentTenantId}` y el filtro PostgREST Realtime a `tenant_id=eq.${currentTenantId}`, evitando el tráfico WebSocket entre sucursales.
2. **`src/app/core/services/contact.service.ts`**:
   - Se removió la inserción directa en el cliente de `notifications` en `createMessage()` y `createReservation()`, delegando la creación de la notificación de campana al trigger transaccional en PostgreSQL con `SECURITY DEFINER`.

---

## 4. FASE 3: Verificación y Pruebas

### 4.1 Verificación de Seguridad en Base de Datos (PostgreSQL en VPS)
Se ejecutaron simulaciones de roles con `SET ROLE authenticated` y claims JWT para el usuario `3d027aa6-d59a-4b04-aa38-38c8d263c877` (perteneciente a Sucursal Zaona `550e8400-e29b-41d4-a716-446655440000`):
- **Intento de lectura cruzada:**
  ```sql
  SELECT count(*) FROM public.notifications WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
  -- Resultado: 0
  SELECT count(*) FROM public.contact_messages WHERE tenant_id = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';
  -- Resultado: 0
  ```
- **Intento de inserción cruzada:**
  ```sql
  INSERT INTO public.contact_messages (name, email, message, tenant_id)
  VALUES ('Attacker', 'attack@test.com', 'Cross tenant attack', 'bba26ccd-59ce-471c-aac0-4c1f5513de3b');
  -- Resultado: ERROR: new row violates row-level security policy for table "contact_messages"
  ```
- **Operación legítima en propio tenant:**
  ```sql
  INSERT INTO public.contact_messages (name, email, message, tenant_id)
  VALUES ('Valid', 'valid@test.com', 'Legit', '550e8400-e29b-41d4-a716-446655440000') RETURNING id;
  -- Resultado: INSERT 0 1 (Exitoso)
  ```

### 4.2 Suite de Tests E2E de Seguridad en Cypress (`cypress/e2e/tenant-isolation/tenant-isolation.cy.ts`)
1. **Test 1: Test de fuga:** Validación de que consultas directas a Supabase filtrando por `tenant_id` de otro tenant devuelven array vacío y no exponen datos.
2. **Test 2: Test de UI:** Comprobación de que la bandeja de entrada (`/admin/messages`) y la campana de notificaciones no renderizan mensajes confidenciales de otras sucursales.
3. **Test 3: Test de inserción:** Validación de bloqueo y rechazo (código `42501` / RLS Policy Violation) ante intentos de inyectar registros en tenants ajenos.
4. **Test 4: Test de regresión:** Verificación de que la gestión regular de mensajes (lectura, marcar como leído) funciona con normalidad en la sucursal activa.

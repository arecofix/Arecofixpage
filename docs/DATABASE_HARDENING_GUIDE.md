# Guía de Buenas Prácticas y Hardening de Base de Datos PostgreSQL / Supabase

**Proyecto**: Arecofix SaaS Ecosystem  
**Última Actualización**: 20 de Octubre de 2026  
**Audiencia**: DBAs, Desarrolladores Backend, SREs, Auditores de Seguridad  
**Referencia de Estándares**: CIS PostgreSQL 15 Benchmark, OWASP Top 10, Supabase Security Best Practices  

---

## 1. Principios Fundamentales de Seguridad y Arquitectura

1. **Defensa en Profundidad (Defense in Depth)**: RLS no es un sustituto de la validación a nivel de aplicación ni de la gestión granular de privilegios (`GRANT`/`REVOKE`). Ambos niveles deben coexistir.
2. **Principio de Menor Privilegio (PoLP)**:
   - El rol `anon` nunca debe tener privilegios `ALL` ni de modificación en tablas que no sean de recepción pública explícita y validada (e.g. `service_leads`).
   - Los triggers de base de datos y funciones de sistema (`handle_new_user`, `sync_order_items_stock`) deben estar revocados de la API de PostgREST (`REVOKE EXECUTE ... FROM anon, authenticated, public`).
3. **Inmutabilidad y Trazabilidad**: Todo cambio de esquema, política o función debe ser versionado en `supabase/migrations/` con un script UP transaccional y su correspondiente script DOWN de reversión.

---

## 2. Hardening de Funciones y Procedimientos (SECURITY DEFINER)

### ⚠️ Regla de Oro: Evitar CWE-426 (Untrusted Search Path)

Toda función con `SECURITY DEFINER` se ejecuta con los privilegios del usuario creador (usualmente `postgres` o `supabase_admin`). Si no fija explícitamente su `search_path`, un usuario malicioso puede crear un objeto con el mismo nombre en un schema temporal o accesible para secuestrar el flujo de ejecución.

### ✅ Estándar Obligatorio para Declaración de Funciones:

```sql
CREATE OR REPLACE FUNCTION public.mi_funcion_segura(p_param text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    v_user_id uuid;
BEGIN
    -- 1. Validar autenticación explícita si no es un endpoint público
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Acceso no autorizado' USING ERRCODE = '42501';
    END IF;

    -- 2. Validar autorización de rol o pertenencia a tenant
    IF NOT (public.is_admin() OR public.get_auth_user_tenant() = ...) THEN
        RAISE EXCEPTION 'Permisos insuficientes para esta operación' USING ERRCODE = '42501';
    END IF;

    -- 3. Lógica de negocio
    RETURN jsonb_build_object('status', 'success');
END;
$$;

-- Revocar acceso público por defecto y otorgar solo a roles requeridos
REVOKE EXECUTE ON FUNCTION public.mi_funcion_segura(text) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.mi_funcion_segura(text) TO authenticated;
```

### 🚫 Anti-patrones Prohibidos:
- ❌ Declarar `SECURITY DEFINER` sin `SET search_path = ...`.
- ❌ Usar `SECURITY DEFINER` en funciones de lectura simples donde las políticas RLS del usuario son suficientes (`SECURITY INVOKER` debe ser la opción por defecto).
- ❌ Dejar permisos de ejecución automáticos a `PUBLIC` tras crear una función.

---

## 3. Optimización de Políticas RLS y Planes de Ejecución (InitPlan)

### ⚠️ El Problema de Rendimiento: Evaluación por Fila

Cuando una política RLS invoca directamente `auth.uid()` o `auth.jwt()`, el optimizador de PostgreSQL puede interpretarlo como una función volátil que debe ser recalculada por cada registro analizado durante un Sequential Scan o Index Scan:

```sql
-- ❌ INEFICIENTE (Provoca reevaluación por fila y Seq Scan lento):
CREATE POLICY "orders_select" ON public.orders
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
```

### ✅ El Patrón Óptimo: Subconsulta Escalar (InitPlan)

Envolver la llamada a la función de autenticación dentro de una subconsulta escalar `(SELECT auth.uid())` permite al planificador de PostgreSQL resolver el valor **una sola vez** al inicio del query y reutilizar la constante:

```sql
-- ✅ ALTAMENTE EFICIENTE (Se compila como InitPlan):
CREATE POLICY "orders_select" ON public.orders
    FOR SELECT TO authenticated
    USING (user_id = (SELECT auth.uid()));

-- ✅ Para reclamos en JWT (email, roles de app):
CREATE POLICY "exam_submissions_select" ON public.course_exam_submissions
    FOR SELECT TO authenticated
    USING (email = ((SELECT auth.jwt()) ->> 'email'));
```

### 📋 Múltiples Políticas Permisivas

PostgreSQL combina múltiples políticas `PERMISSIVE` mediante un operador lógico `OR`. Si existen 3 políticas permisivas para un mismo rol y comando, Postgres evaluará cada una hasta encontrar un `true`:
- Consolidar reglas de acceso redundantes en una sola política siempre que pertenezcan al mismo dominio de negocio.
- Utilizar políticas `RESTRICTIVE` (`AS RESTRICTIVE`) para reglas de obligado cumplimiento que deben aplicarse **siempre**, como la segregación obligatoria por `tenant_id`:

```sql
CREATE POLICY "tenant_isolation_mandatory" ON public.orders
    AS RESTRICTIVE
    FOR ALL TO authenticated
    USING (tenant_id = public.get_auth_user_tenant() OR public.is_super_admin());
```

---

## 4. Gestión de Almacenamiento (Supabase Storage Security)

1. **Nunca habilitar `SELECT (true)` sobre `storage.objects`**:
   - Marcar un bucket como público (`public = true`) en `storage.buckets` permite la entrega directa por CDN mediante la URL canónica del archivo.
   - Otorgar una política de `SELECT` abierta en `storage.objects` permite la **enumeración y listado de todos los nombres de archivo**, exponiendo información sensible.
2. **Políticas de Storage Estándar**:
   - Los buckets de evidencias, comprobantes y datos de usuarios deben tener `public = false`.
   - Las políticas deben verificar la propiedad del archivo (`owner = (SELECT auth.uid())`) o la pertenencia al tenant.

---

## 5. Prevención de Duplicados e Índices Huérfanos

1. **Claves Foráneas**: Toda restricción de clave foránea (`FOREIGN KEY`) debe contar con un índice covering sobre las columnas referenciadas para evitar table locks en cascading updates/deletes.
2. **Índices Duplicados**: Si una columna ya cuenta con una restricción `UNIQUE` o `PRIMARY KEY`, PostgreSQL crea automáticamente un índice B-Tree único. **No** se debe crear un `CREATE INDEX` manual adicional sobre las mismas columnas.
3. **Claves Primarias Obligatorias**: Ninguna tabla puede crearse sin una clave primaria (`PRIMARY KEY`). Para entidades con múltiples inserciones automáticas, utilizar `id uuid DEFAULT gen_random_uuid() PRIMARY KEY`.

---

## 6. Checklist de Validación para CI/CD (Pipeline Pre-Deploy)

Antes de fusionar cualquier PR con cambios de base de datos a `main`:

- [ ] ¿La migración incluye script `_down.sql` de reversión completa?
- [ ] ¿Todas las funciones nuevas tienen `SET search_path = public, extensions, pg_temp`?
- [ ] ¿Las funciones `SECURITY DEFINER` revocan explícitamente `EXECUTE` de `public` y `anon`?
- [ ] ¿Todas las políticas RLS usan el formato `(SELECT auth.uid())`?
- [ ] ¿Las claves foráneas nuevas tienen índice covering?
- [ ] ¿Se ejecutó el linter de Supabase sin arrojar alertas P0/P1?
  ```bash
  pnpm run db:lint # o consulta SQL contra pg_proc / pg_policies
  ```
- [ ] ¿Se ejecutó `node scripts/verify-schema.mjs` confirmando HTTP 200 en endpoints clave?
- [ ] ¿Los tests unitarios de Jest (276/276) y Cypress E2E pasan sin fallos?

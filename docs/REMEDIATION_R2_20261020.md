# Remediación R2: Hardening de Políticas de Listado en Storage (Supabase Linter)

**Categoría Linter**: `public_bucket_allows_listing` (SECURITY · P1)  
**Estado Previo**: 5 warnings  
**Estado Final**: **0 warnings (100% Remediado)**  
**Archivo de Migración**: [supabase/migrations/20261022030000_harden_storage_listing_policies.sql](file:///c:/git/Arecofixpage/supabase/migrations/20261022030000_harden_storage_listing_policies.sql) (+ `_down.sql`)

---

## 1. Análisis de Causa Raíz

En Supabase Storage:
1. Cuando un bucket tiene la bandera `public = true`, cualquier cliente puede descargar archivos directamente mediante su URL pública (`/storage/v1/object/public/<bucket>/<path>`) sin consultar las políticas RLS de `storage.objects`.
2. Si se crea una política permisiva `FOR SELECT` para `authenticated` con una condición genérica como `(bucket_id = 'avatars')`, se habilita la llamada a la API `/storage/v1/object/list/<bucket>`, permitiendo a cualquier usuario autenticado enumerar los nombres de todos los archivos almacenados en dicho bucket.
3. El Supabase Database Linter marca esta condición como una vulnerabilidad de severidad P1.

---

## 2. Matriz de Remediación por Bucket

| Bucket | `public` antes | `public` después | Política Anterior | Política Remediada | Rationale de Seguridad |
| :--- | :---: | :---: | :--- | :--- | :--- |
| `course-covers` | `true` | `true` | `SELECT (bucket_id = 'course-covers')` | **Eliminada** | Descarga pública directa por URL canónica; no requiere listado de objetos. |
| `avatars` | `true` | `true` | `SELECT (bucket_id = 'avatars')` | `owner = (SELECT auth.uid()) OR is_admin()` | Cada usuario solo lista sus propios avatares. |
| `evidence` | `true` | **`false`** | `SELECT (bucket_id = 'evidence')` | `owner = (SELECT auth.uid()) OR is_admin()` | Evidencia de reparación privada; solo visible para el cliente titular o staff. |
| `cv-generados` | `true` | **`false`** | `SELECT (bucket_id = 'cv-generados')` | `owner = (SELECT auth.uid()) OR is_admin()` | CVs con datos personales; bucket marcado como privado con acceso exclusivo al dueño. |
| `academy_certificates` | `true` | `true` | `SELECT (bucket_id = 'academy_certificates')` | `owner = (SELECT auth.uid()) OR is_admin()` | Solo el titular o instructor puede listar certificados; consulta pública por UUID canónico. |

---

## 3. Evidencia de Validación Post-Migración

```sql
SELECT b.name, pol.policyname
FROM storage.buckets b
JOIN pg_policies pol ON pol.schemaname = 'storage' AND pol.tablename = 'objects'
  AND (pol.qual = 'true' OR pol.qual LIKE '%' || quote_literal(b.id) || '%')
WHERE b.public = true
  AND pol.cmd IN ('SELECT', 'ALL')
  AND (pol.qual = 'true' OR (pol.qual NOT LIKE '%owner%' AND pol.qual NOT LIKE '%uid()%'));
```
**Resultado**:
```
 name | policyname 
------+------------
(0 rows)
```
**Conclusión**: **0 advertencias residuales en `public_bucket_allows_listing`**.

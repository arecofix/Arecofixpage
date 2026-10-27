# Auditoría Forense: Módulo de Servicios y Editor de Bloques

**Objetivo:** Verificar cada una de las 15 afirmaciones declaradas con "✅ Cumplido" en el Informe de Entrega de Servicios.  
**Fecha:** 18 de Octubre de 2026  
**Veredicto General:** ⚠️ **Completado en Código y Base de Datos, pero NO Desplegado en el Bundle de Producción.**

---

## 1. Tabla de Verificación de las 15 Afirmaciones del Informe

| # | Afirmación del Informe | Evidencia Obtenida | Estado Real | Detalle Forense / Hallazgo |
|---|---|---|:---:|---|
| 1 | **Backup `services_backup_20261018` (3 filas)** | `SELECT COUNT(*) FROM services_backup_20261018;` -> `3` | ✅ **Verificado** | Tabla existente en schema `public`, con los 3 registros intactos pre-migración. |
| 2 | **Backup `blog_posts_backup_20261018` (12 filas)** | `SELECT COUNT(*) FROM blog_posts_backup_20261018;` -> `12` | ✅ **Verificado** | Tabla existente en schema `public`, con los 12 artículos intactos. |
| 3 | **Migraciones `up` + `down` reversibles** | Archivos en `supabase/migrations/` | ✅ **Verificado** | Existen `20261018060000_...sql`, `20261018060000_..._down.sql`, `20261018070000_...sql` y `20261018070000_..._down.sql`. |
| 4 | **Backfill: `Arecofix` y `Recuperar datos` no publicados** | `SELECT id, name, slug, is_published FROM services;` | ✅ **Verificado** | Ambos registros tienen `is_published = false` y slugs `arecofix` y `recuperar-datos`. |
| 5 | **Backfill: `Auditoría de Sitios web` publicado con 4 bloques** | `SELECT s.slug, COUNT(b.id) FROM services s LEFT JOIN service_blocks b...` -> `4` | ✅ **Verificado** | Registra exactamente 4 bloques polimórficos (`hero`, `features`, `rich_text`, `contact`) con `is_published = true`. |
| 6 | **RLS estricto verificado con `SET ROLE anon`** | `SET ROLE anon; SELECT * FROM services; SELECT COUNT(*) FROM service_leads;` | ✅ **Verificado** | Anon solo devuelve 1 fila (`Auditoría de Sitios web`) y `service_leads` devuelve `0` (denegado). |
| 7 | **Clean Architecture (Domain/App/Infra)** | Estructura en `src/app/features/services/` | ✅ **Verificado** | Value Objects (`Slug`, `Money`, `SeoMeta`), Repositorios abstractos, implementaciones Supabase y Casos de Uso. |
| 8 | **Backend Express + Healthcheck (`/health/services`)** | `curl -s https://arecofix.com.ar/health/services` | ❌ **Roto en Prod** | **Retorna 404 HTML** en producción porque el servidor VPS corre el bundle de hace 5h sin la ruta montada. |
| 9 | **Editor de bloques con drag & drop y preview live** | `BlocksEditorComponent` (`src/app/shared/components/blocks-editor/`) | ✅ **Verificado** | CDK DragDrop implementado, autosave 500ms y preview con `BlockRendererComponent`. |
| 10 | **Editor de servicios con 5 pestañas** | `ServiceEditorComponent` (`src/app/admin/services/service-editor/`) | ✅ **Verificado** | Pestañas: Contenido, Bloques, SEO (Google SERP), Operativo, Leads. |
| 11 | **Landings SSR con meta tags + canonical + JSON-LD** | `curl -s https://arecofix.com.ar/servicios/auditoria-de-sitios-web` | ⚠️ **Parcial en Prod** | Código implementado en Angular, pero producción sirve el componente legado `<title>Detalle de Servicio \| Arecofix</title>`. |
| 12 | **Redirects 301 reales (no soft)** | `curl -I https://arecofix.com.ar/servicios/auditora-de-sitios-web` | ❌ **Falla en Prod (HTTP 200)** | En producción devuelve `HTTP 200` (soft 404). El interceptor en `server.ts` no está desplegado en la VPS. |
| 13 | **Sitemap dinámico incluye servicios y posts** | `curl -s https://arecofix.com.ar/sitemap.xml \| grep "servicios"` | ❌ **Falla en Prod** | En producción el sitemap solo contiene productos. La extensión de `sitemap.routes.ts` no fue desplegada. |
| 14 | **Captura de Leads B2B (Honeypot + Rate Limit)** | `POST /api/public/leads` en `server/routes/services.routes.ts` | ⚠️ **No en Prod** | Implementado en backend con hash SHA-256 de IP y honeypot, pero shadoweado por Nginx/falta de deploy. |
| 15 | **Integración no destructiva con blog (dual-mode)** | `AdminPostFormPage` (`src/app/admin/posts/admin-post-form-page.ts`) | ⚠️ **Gap E2E** | Selector de modo implementado en UI, pero **no existe ningún test Cypress** que valide el guardado en modo bloques. |

---

## 2. Diagnóstico de Causa Raíz: La Falla de Despliegue

El informe de entrega anterior asumió que la feature estaba "en producción" basándose en que la base de datos PostgreSQL remota ya tenía las migraciones aplicadas. Sin embargo:
1. **El proceso Node en la VPS (`arecofix-frontend`)** tiene un uptime de 5 horas (`pid 3127639`), corriendo el build antiguo anterior a la entrega de servicios.
2. **El script de deploy (`pnpm run deploy`)** no fue ejecutado por la restricción *"Trabaja en staging primero. No toques producción sin autorización"*.
3. **Consecuencia:** Las rutas `/health/services`, los interceptores 301 de `server.ts` y el sitemap dinámico existen en la rama `feature/services-landing`, pero en el dominio público `https://arecofix.com.ar` fallan con 404 o soft 200.

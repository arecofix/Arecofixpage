# Auditoría Forense y Reconocimiento Previo — Módulo de Servicios y Editor de Bloques

**Fecha:** 18 de Octubre de 2026  
**Auditor:** Equipo Senior Multidisciplinario (Arquitectura, DBA, Backend, Frontend SSR, UX/UI, SEO, QA)  
**Proyecto:** Arecofix (`https://arecofix.com.ar`)  
**Base de Datos:** PostgreSQL en `db.arecofix.com.ar` (Supabase en Docker `supabase-db`)

---

## 1. Resumen Ejecutivo y Diagnóstico Previo

El módulo de administración de servicios (`/admin/services`) se encontraba en un estado rudimentario y desarticulado del modelo de negocio y del SEO público de Arecofix:

1. **Persistencia corrupta y serialización improvisada en BD:**
   - La columna `description` de la tabla `public.services` se utilizaba como un volcado híbrido de texto plano o JSON serializado (`{"description":"...","icon":"...","features":[]}`).
   - La tabla contenía solo 3 registros, 2 de los cuales tenían descripciones truncadas/corruptas (`'SAMSUNG'`, `'E'`) sin slugs válidos (`NULL`), y 1 con JSON crudo (`Auditoría de Sitios web`).
2. **Inexistencia de páginas públicas o indexables:**
   - No existía ruta pública `/servicios` ni `/servicios/:slug` en el enrutamiento de Angular ni renderizado SSR.
   - No había soporte para schema.org (`Service`, `LocalBusiness`), OpenGraph, canonicals, ni inclusión en `sitemap.xml`.
3. **Ausencia de captura de leads:**
   - Ningún servicio contaba con formulario de cotización, contacto directo o registro de prospectos vinculado al catálogo.
4. **Estado del Blog (`/admin/posts`):**
   - El blog almacena artículos en la tabla `blog_posts` con clave primaria UUID, estado (`draft` / `published`), y un único campo `content TEXT` editado mediante un `<textarea>` monospaciado. No poseía un editor de bloques estructurado ni un `BlockRendererComponent`.

---

## 2. Inventario de Archivos Identificados

### 2.1. Frontend Admin & Catálogo
- `src/app/admin/services/admin-services-page.ts` & `html`: Listado de servicios con tabla básica que mostraba el JSON crudo en la columna descripción.
- `src/app/admin/services/admin-service-form-page.ts` & `html`: Formulario con inputs para empaquetar `features` y `icon` dentro del string `description`.
- `src/app/admin/services/admin-services.routes.ts`: Rutas hijas de `/admin/services`.
- `src/app/features/products/application/services/app-catalog.service.ts`: Servicio Angular puente con métodos CRUD.
- `src/app/features/products/domain/entities/app-service.entity.ts`: Interfaz TypeScript con tipos incompletos.
- `src/app/features/products/domain/repositories/app-service.repository.ts`: Interfaz abstracta del repositorio.
- `src/app/features/products/infrastructure/repositories/supabase-app-service.repository.ts`: Implementación con cliente Supabase.

### 2.2. Frontend Blog & Posts
- `src/app/admin/posts/admin-posts-page.ts` & `html`: Tabla de artículos de blog.
- `src/app/admin/posts/admin-post-form-page.ts` & `html`: Formulario reactivo con `textarea` para `content`.
- `src/app/admin/posts/services/admin-post.service.ts`: Servicio con mapping a `blog_posts`.
- `src/app/public/posts/post-page.ts`: Página pública de visualización de posts (`/posts/:slug`).

### 2.3. Servidor Express SSR & SEO
- `server.ts`: Servidor Angular Universal / CommonEngine. Contiene `validPrefixes` donde `/servicios` ya estaba contemplado para no retornar 404 estático prematuro.
- `server/routes/sitemap.routes.ts`: Generador de `sitemap.xml`, actualmente solo consultaba productos, ignorando servicios y posts.

---

## 3. Estado de la Base de Datos PostgreSQL (`supabase-db`)

### 3.1. Esquema Actual de `public.services`
```sql
Table "public.services"
- id: uuid (PK, default gen_random_uuid())
- tenant_id: uuid (FK tenants.id, default get_my_tenant())
- name: text
- slug: text
- description: text (almacena JSON o strings corruptos)
- estimated_time: text
- image_url: text
- is_active: boolean (default true)
- created_at: timestamptz (default timezone('utc', now()))
- updated_at: timestamptz (default timezone('utc', now()))
- duration_minutes: integer (default 0)
- price: numeric(10,2) (default 0)
- category_id: uuid (FK categories.id)
- branch_id: uuid (FK branches.id)
```

### 3.2. Registros Existentes Detectados (Inspección Forense)
| ID | Nombre | Slug Actual | Precio | Activo | Descripción Cruda en BD |
|---|---|---|---|---|---|
| `0a06699e-...` | Arecofix | `NULL` | $ 29.800,00 | `true` | `'SAMSUNG'` (Corrupto / Incompleto) |
| `fac3401c-...` | Recuperar datos | `NULL` | $ 34.800,00 | `true` | `'E'` (Corrupto / Incompleto) |
| `35064582-...` | Auditoría de Sitios web | `auditora-de-sitios-web` | $ 69.000,00 | `true` | `'{"description":"Desarrollo de software","icon":"fa-tools","features":[]}'` |

### 3.3. Decisiones de Backfill y Normalización Segura
1. **Backup Previo:** Generar tabla de respaldo `services_backup_20261018` antes de cualquier alteración DDL o DML.
2. **Campos Nuevos en `services`:**
   - `short_description VARCHAR(280)`
   - `long_description TEXT`
   - `base_price NUMERIC(12,2)` (NULL = "Consultar")
   - `price_currency CHAR(3) DEFAULT 'ARS'`
   - `is_quotable BOOLEAN DEFAULT TRUE`
   - `is_bookable BOOLEAN DEFAULT FALSE`
   - `is_published BOOLEAN DEFAULT FALSE`
   - `template_slug VARCHAR(50) DEFAULT 'landing-v1'`
   - `hero_image_url TEXT`
   - `seo_title VARCHAR(70)`
   - `seo_description VARCHAR(160)`
   - `canonical_url TEXT`
   - `og_image_url TEXT`
   - `published_at TIMESTAMPTZ`
   - `deleted_at TIMESTAMPTZ`
3. **Tablas Nuevas:**
   - `service_categories` (categorización limpia de servicios)
   - `service_features` (normalización de viñetas y características con íconos)
   - `service_blocks` (bloques modulares compartidos para `owner_type IN ('service', 'post')`)
   - `service_leads` (captura de prospectos con honeypot, IP hash y UTMs)
   - `slug_redirects` (preservación de SEO y redirecciones 301)
4. **Tratamiento de Registros Corruptos:**
   - `Arecofix`: slug `arecofix`, `is_published = false`, `long_description = 'SAMSUNG'`, documentado para edición manual.
   - `Recuperar datos`: slug `recuperar-datos`, `is_published = false`, `long_description = NULL`, documentado para edición manual.
   - `Auditoría de Sitios web`: slug `auditoria-de-sitios-web`, `short_description = 'Desarrollo de software'`, `icon = 'fa-tools'`, `is_published = true`, generación de bloques iniciales `hero` y `features`.
5. **RLS:** Configurar políticas de lectura pública (`anon`, `authenticated`) exclusivamente para registros con `is_published = true AND deleted_at IS NULL`.

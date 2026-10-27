# 📝 AUDITORÍA FORENSE: MÓDULO DE BLOG Y DUAL-MODE (TEXTAREA VS BLOQUES)

**Fecha de ejecución:** 2026-10-18T22:35:00-03:00  
**Equipo auditor:** Tech Lead & Arquitecto de Software, DBA PostgreSQL, QA Automation Senior  
**Objetivo:** Verificar la integridad del blog, la coexistencia no destructiva del editor tradicional con el nuevo editor de bloques (Dual-Mode), y el render público SSR en `/posts/:slug`.

---

## 1. RESUMEN EJECUTIVO Y VEREDICTO

| Componente | Estado Documentado | Estado Real | Severidad | Veredicto |
|---|---|---|---|---|
| **Preservación de Posts Existentes** | 12 posts respaldados | ✅ Verificado (12 filas en `blog_posts`) | Info | **CUMPLIDO** |
| **Backup de Seguridad** | `blog_posts_backup_20261018` | ✅ Verificado (12 filas en schema `public`) | P2 | **CUMPLIDO CON OBSERVACIÓN** (En schema `public`, sin RLS) |
| **Dual-Mode en Admin (`/admin/posts`)** | Switch Textarea / Bloques | ✅ Verificado en UI y Form | Info | **CUMPLIDO EN ADMIN** |
| **Persistencia de Bloques de Blog** | Guardado en `service_blocks` con `owner_type='post'` | ✅ Soporte DTO y DB | Info | **CUMPLIDO EN MODELO** (Actualmente 0 bloques creados) |
| **Render Público de Bloques (`/posts/:slug`)** | Renderiza bloques si existen | ❌ **ROTO / NO IMPLEMENTADO** | **P1** | **GAP CRÍTICO** |
| **Cobertura de Tests E2E Dual-Mode** | 100% verificado | ❌ **INEXISTENTE** | **P1** | **GAP CRÍTICO** |

> [!CAUTION]
> **HALLAZGO CRÍTICO (P1):** Aunque en el panel de administración (`src/app/admin/posts/admin-post-form-page.html:63-93`) existe la interfaz para alternar entre "Texto / HTML" y "Bloques" (`<app-blocks-editor ownerType="post" [ownerId]="postId" />`), el componente público de lectura (`src/app/public/posts/post-page.ts` y `post-page.html`) **NO IMPORTA `BlockRendererComponent` NI CONSULTA `service_blocks`**. Solo renderiza `[innerHTML]="post.content"`. Si un administrador crea un post utilizando bloques, **el contenido de los bloques jamás se mostrará al visitante público**.

---

## 2. EVIDENCIA DE BASE DE DATOS (`public.blog_posts`)

Se ejecutó la consulta sobre la base de datos PostgreSQL de Supabase en producción:

```sql
SELECT id, title, slug, status, template, created_at 
FROM public.blog_posts 
ORDER BY created_at DESC;
```

**Output literal obtenido:**
```
                  id                  |                                          title                                           |                             slug                              |  status   | template |          created_at           
--------------------------------------+------------------------------------------------------------------------------------------+---------------------------------------------------------------+-----------+----------+-------------------------------
 89d21c32-b8bb-4a55-89ae-967a996f0195 | Reparación de Celulares en Marcos Paz: Guía Definitiva de Fallas y Soluciones            | servicio-tecnico-de-celulares-en-marcos-paz                   | published | modern   | 2026-08-16 03:00:00+00
 d4081c7e-b79e-4e69-b3a6-809ff44f24c3 | Cómo Recuperar un Celular Mojado (Guía Paso a Paso)                                     | como-recuperar-un-celular-mojado                              | published | modern   | 2026-08-14 03:00:00+00
 a065e128-4eb7-40e8-a1c2-5509971bc175 | ¿Vale la pena cambiar la batería de mi celular?                                          | vale-la-pena-cambiar-la-bateria                               | published | modern   | 2026-08-12 03:00:00+00
 ... (12 filas en total)
```

### Verificación de Bloques Asociados a Posts:
```sql
SELECT COUNT(*) FROM public.service_blocks WHERE owner_type = 'post';
```
**Resultado:** `0` filas. Ningún post en producción tiene bloques asignados actualmente.

---

## 3. AUDITORÍA DE CÓDIGO FUENTE (FRONTEND)

### 3.1. Formulario de Administración (`admin-post-form-page.ts` y `.html`)
En `src/app/admin/posts/admin-post-form-page.html:63-93`:
```html
<div class="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs">
    <button type="button" (click)="editorMode = 'text'" ...>Texto / HTML</button>
    <button type="button" (click)="editorMode = 'blocks'" ...>Bloques</button>
</div>

@if (editorMode === 'text') {
    <textarea id="content" formControlName="content" rows="15" ...></textarea>
} @else {
    @if (postId) {
        <app-blocks-editor ownerType="post" [ownerId]="postId" />
    } @else {
        <div class="p-6 bg-gray-50 ...">Guardá el borrador para activar bloques</div>
    }
}
```
**Conclusión:** La UI administrativa funciona e integra el componente de bloques.

### 3.2. Renderizador Público (`post-page.ts` y `post-page.html`)
En `src/app/public/posts/post-page.ts`:
- **Línea 16:** `imports: [RouterLink, DatePipe, CommonModule, FormsModule, ReservationCalendar],` -> **`BlockRendererComponent` NO está importado.**
- **Líneas 20-272:** No existe ninguna llamada o inyección de un servicio que consulte `service_blocks` para el `post.id`.
- En `src/app/public/posts/post-page.html:637, 658, 675`:
```html
<!-- Content Section -->
<div class="prose prose-lg md:prose-xl prose-indigo mx-auto text-gray-700 leading-relaxed" [innerHTML]="post.content"></div>
```
**Conclusión:** `post-page` asume que todo el contenido está en `post.content` como cadena HTML. No tiene rama de renderizado para bloques dinámicos.

---

## 4. ANÁLISIS DE TESTS Y GAPS DE QA

1. **Tests Unitarios de Blog:**
   - Existen tests de `admin-post.service.spec.ts` y `post.service.spec.ts` que validan CRUD tradicional.
   - **GAP:** Ningún test unitario valida la alternancia de modos ni el guardado de bloques en posts.
2. **Tests Cypress E2E:**
   - **GAP CRÍTICO:** No existe ningún test E2E en `cypress/e2e/` con el flujo:
     `Login admin` -> `Crear/Editar Post` -> `Cambiar a modo Bloques` -> `Agregar bloque Hero/FAQ` -> `Guardar` -> `Navegar a /posts/:slug` -> `Verificar que los bloques son visibles en el DOM público`.

---

## 5. PLAN DE REMEDIACIÓN RECOMENDADO

1. **Actualizar `PostPage` (`post-page.ts`):**
   - Importar `BlockRendererComponent`.
   - Inyectar `ServicesRepository` o servicio de bloques para consultar `getBlocksByOwner('post', post.id)`.
   - Guardar en un signal `blocks = signal<BlockItem[]>([])`.
2. **Actualizar `post-page.html`:**
   - Si `blocks().length > 0`, renderizar `<app-block-renderer [blocks]="blocks()" />`.
   - Si `blocks().length === 0`, mantener fallback tradicional `[innerHTML]="post.content"`.
3. **Crear Test E2E en Cypress:**
   - Archivo `cypress/e2e/ui/blog-dual-mode.cy.ts` validando el flujo completo de extremo a extremo.

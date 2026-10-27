# 🎯 PLAN DE ACCIÓN PRIORIZADO Y CRITERIOS DE ACEPTACIÓN (ACTION PLAN)

**Proyecto:** Arecofix (`https://arecofix.com.ar`)  
**Fecha de emisión:** 2026-10-18T22:38:00-03:00  
**Enfoque:** Remediación secuencial basada en impacto directo en producción, seguridad y reputación técnica.

---

## 1. FASE P0 — BLOQUEANTES CRÍTICOS DE PRODUCCIÓN

### Tarea P0.1: Desbloqueo de Nginx para APIs de Node.js Express
- **Objetivo:** Permitir que las peticiones a `/api/admin/dashboard/metrics` y `/api/public/*` alcancen el servidor Node.js en el puerto 4000 en lugar de ser interceptadas por Flask.
- **Archivos a modificar:** `/etc/nginx/sites-available/arecofix_frontend` (en la VPS).
- **Acción:**
  ```nginx
  location ~ ^/api/(admin|public|services)/ {
      proxy_pass http://127.0.0.1:4000;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
  }
  ```
- **Criterio de Aceptación Verificable:**
  - `curl -s https://arecofix.com.ar/api/admin/dashboard/metrics` responde HTTP 200/401 (JSON), jamás un 404 HTML de Flask.
  - Al abrir `/admin/dashboard` en el navegador, las tarjetas muestran ingresos reales ($144,500) y 17 reparaciones activas.

---

## 2. FASE P1 — ALTA PRIORIDAD (SEGURIDAD Y CARACTERÍSTICAS ROTAS)

### Tarea P1.1: Blindar la Política RLS de `public.orders`
- **Objetivo:** Eliminar la fuga de datos donde usuarios anónimos pueden leer, actualizar o borrar carritos de otros visitantes.
- **Archivos a modificar:** Migración SQL en `supabase/migrations/20261019000000_secure_orders_guest_rls.sql`.
- **Acción:**
  ```sql
  DROP POLICY IF EXISTS "Anon can view guest orders" ON public.orders;
  DROP POLICY IF EXISTS "Anon can update guest orders" ON public.orders;
  DROP POLICY IF EXISTS "Anon can delete guest carts" ON public.orders;

  CREATE POLICY "Anon can view guest orders" ON public.orders
  FOR SELECT TO anon
  USING (
    session_id IS NOT NULL 
    AND user_id IS NULL 
    AND session_id::text = NULLIF(current_setting('request.headers', true)::json->>'x-guest-session', '')
  );
  ```
- **Criterio de Aceptación Verificable:**
  - `SET ROLE anon; SELECT COUNT(*) FROM public.orders;` sin header devuelve exactamente `0`.
  - Con el header `x-guest-session: <uuid>`, solo devuelve el carrito propio.

### Tarea P1.2: Habilitar Renderizado Público de Bloques en el Blog
- **Objetivo:** Que los artículos editados con el nuevo editor de bloques se visualicen correctamente en `/posts/:slug`.
- **Archivos a modificar:**
  - `src/app/public/posts/post-page.ts`
  - `src/app/public/posts/post-page.html`
- **Acción:**
  - Importar `BlockRendererComponent` en `PostPage`.
  - Consultar `service_blocks` para el `post.id` cuando el post es cargado.
  - En la vista HTML:
    ```html
    @if (blocks().length > 0) {
      <app-block-renderer [blocks]="blocks()" />
    } @else {
      <div class="prose ..." [innerHTML]="post.content"></div>
    }
    ```
- **Criterio de Aceptación Verificable:**
  - Crear un post de prueba con 2 bloques (Hero + FAQ) -> Navegar a `/posts/post-test` -> Ambos bloques se renderizan en el DOM.

### Tarea P1.3: Implementar Validación de Cloudflare Turnstile en Express
- **Objetivo:** Validar activamente el token captcha antes de aceptar la inserción de un lead.
- **Archivos a modificar:** `src/app/features/services/application/usecases/create-lead.usecase.ts` o endpoint Express.
- **Acción:**
  - Realizar una llamada POST a `https://challenges.cloudflare.com/turnstile/v0/siteverify` con `secret` y `response`.
  - Rechazar con HTTP 400 si la validación falla o si el token es inválido.
- **Criterio de Aceptación Verificable:**
  - Enviar `POST /api/public/leads` con token falso -> Devuelve HTTP 400 "Token Turnstile inválido".

### Tarea P1.4: Alias / Redirección de URL de Producto (`/productos/:slug`)
- **Objetivo:** Resolver la frustración de usuarios que ingresan directamente a `/productos/:slug` y reciben un 404.
- **Archivos a modificar:** `src/app/public/public.routes.ts`.
- **Acción:**
  - Configurar un redirect o match flexible para que `/productos/:slug` cargue automáticamente `ProductsDetailsPage`.
- **Criterio de Aceptación Verificable:**
  - Navegar a `https://arecofix.com.ar/productos/modulo-pantalla-oled-para-iphone-13` muestra la ficha de producto con su descripción.

### Tarea P1.5: Despliegue de Producción y Activación de 301 Reales
- **Objetivo:** Poner en producción las mejoras de servicios, sitemap dinámico y redirects 301.
- **Acción:** Ejecutar `pnpm run build && pnpm run deploy`.
- **Criterio de Aceptación Verificable:**
  - `curl -I https://arecofix.com.ar/servicios/auditora-de-sitios-web` devuelve `HTTP/2 301 Moved Permanently` con cabecera `Location: /servicios/auditoria-de-sitios-web`.
  - `curl -s https://arecofix.com.ar/sitemap.xml | grep "servicios/"` devuelve las URLs de servicios.

---

## 3. FASE P2 — DEUDA TÉCNICA, RENDIMIENTO Y PULIDO

### Tarea P2.1: Completar Bloque `service_list` en el Renderer
- Implementar la cuadrícula de tarjetas de servicios dentro de `BlockRendererComponent.html:294-303`.

### Tarea P2.2: Hardening de Cabeceras HTTP y Robots.txt
- Configurar en Express / Nginx: HSTS (`max-age=31536000`), X-Frame-Options (`SAMEORIGIN`), X-Content-Type (`nosniff`).
- Deshabilitar `x-powered-by`.
- Actualizar `src/robots.txt` con `Disallow: /admin/` y `Disallow: /api/`.

### Tarea P2.3: Reorganización de Backups y Automatización de Dumps
- Mover `services_backup_20261018` y `blog_posts_backup_20261018` a un esquema privado `audit`.
- Configurar script cron en la VPS para volcar `pg_dump` hacia almacenamiento en la nube externo.

### Tarea P2.4: Mantenimiento y Rotación de Logs PM2
- Ejecutar en la VPS: `pm2 install pm2-logrotate` y configurar retención a 7 días / 10MB por archivo.

### Tarea P2.5: Normalización de Documentación y Script `lint`
- Añadir `"lint": "eslint src"` en `package.json`.
- Actualizar `README.md` y `Changelog.txt` con la cifra real: **45 Test Suites / 250 Tests pasando**.
- Corregir mención de Capacitor a versión 7 (Android) y Tauri Desktop.

### Tarea P2.6: Suites E2E en Cypress
- Crear tests E2E automatizados para el Blog Dual-Mode y captura de Leads con Honeypot.

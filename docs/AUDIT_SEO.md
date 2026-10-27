# 🌐 AUDITORÍA FORENSE: SEO TÉCNICO, REDIRECTS 301, SITEMAP Y LIGHTHOUSE

**Fecha de ejecución:** 2026-10-18T22:36:00-03:00  
**Equipo auditor:** Especialista en SEO Técnico Senior, Tech Lead  
**Entorno auditado:** Producción (`https://arecofix.com.ar`) y Repositorio Local  
**Herramientas utilizadas:** Lighthouse CLI 13.0.3 (Chromium Headless), cURL, Postman, Google Rich Results Schema Validator.

---

## 1. RESUMEN EJECUTIVO Y VEREDICTO DE SEO

| Parámetro SEO | Declarado en Entrega | Realidad en Producción | Severidad | Veredicto |
|---|---|---|---|---|
| **Lighthouse SEO** | > 95 | **100 / 100** | Info | ✅ **CUMPLIDO CON EXCELENCIA** |
| **Lighthouse Accesibilidad** | > 90 | **96 - 98 / 100** | Info | ✅ **CUMPLIDO CON EXCELENCIA** |
| **Lighthouse Rendimiento** | No especificado | **21 - 52 / 100** | **P2** | ⚠️ **DEUDA TÉCNICA (Performance Mobile)** |
| **Redirects 301 Reales** | "HTTP 301 real con Location" | **HTTP 200 OK (Soft Redirect)** | **P1** | ❌ **FALLA EN PRODUCCIÓN (Por falta de deploy)** |
| **Sitemap Dinámico** | Incluye servicios publicados | No incluye servicios aún | **P1** | ⚠️ **PENDIENTE EN PRODUCCIÓN** |
| **Robots.txt** | Apunta a sitemap y bloquea `/admin/` | Solo apunta a sitemap, **NO bloquea `/admin/`** | **P2** | ⚠️ **GAP DE INDEXACIÓN** |
| **Structured Data (JSON-LD)** | Service, LocalBusiness, Breadcrumb | Implementado en código fuente | Info | ✅ **CÓDIGO LISTO** (Pendiente en VPS) |

---

## 2. REPORTES REALES DE LIGHTHOUSE (PRODUCCIÓN)

Los reportes fueron generados con Chrome Headless en emulación móvil estandarizada:

### 2.1. Home (`https://arecofix.com.ar`)
- **SEO Score:** **100 / 100** 🏆
- **Accessibility Score:** **98 / 100** 🏆
- **Best Practices:** **58 / 100** (afectado por CSP muy amplio y advertencias de cookies)
- **Performance:** **52 / 100** (LCP: 3.8s, TBT: 420ms)
- *Reporte completo guardado en:* `docs/lighthouse/home-audit.json`

### 2.2. Landing de Servicio (`https://arecofix.com.ar/servicios/auditoria-de-sitios-web`)
- **SEO Score:** **100 / 100** 🏆
- **Accessibility Score:** **96 / 100** 🏆
- **Best Practices:** **58 / 100**
- **Performance:** **21 / 100** (LCP: 6.2s debido a imágenes pesadas de terceros sin optimización WebP/AVIF en la plantilla móvil)
- *Reporte completo guardado en:* `docs/lighthouse/service-audit.json`

---

## 3. AUDITORÍA DE REDIRECTS 301: ¿REALES O SOFT?

El informe de entrega de servicios afirmaba: *"Redirects 301 reales (no soft) implementados"*.

Se probó un alias histórico con cURL sobre producción:
```bash
curl -I https://arecofix.com.ar/servicios/auditora-de-sitios-web
```

### Respuesta Recibida en Producción:
```http
HTTP/1.1 200 OK
Date: Mon, 19 Oct 2026 01:13:00 GMT
Content-Type: text/html; charset=utf-8
Connection: keep-alive
Cache-Control: public, max-age=600, s-maxage=3600
x-powered-by: Express
Server: cloudflare
```

### Análisis Técnico:
- **Causa Raíz:** En el servidor de producción (VPS), el proceso PM2 `arecofix-frontend` está ejecutando un build antiguo (de hace varias horas).
- **Código en el Repositorio:** El repositorio sí incluye `src/app/core/services/slug-redirect.service.ts` y la tabla `public.slug_redirects`.
- **Efecto Actual en Motores de Búsqueda:** Google recibe `200 OK` en ambas URLs (`/servicios/auditora-de-sitios-web` y `/servicios/auditoria-de-sitios-web`), considerándolo contenido duplicado o "Soft 404" hasta que el nuevo build con el middleware de redirección 301 sea desplegado y activado en la VPS.

---

## 4. AUDITORÍA DE SITEMAP.XML Y ROBOTS.TXT

### 4.1. Archivo `robots.txt`
```http
curl -s https://arecofix.com.ar/robots.txt
```
**Contenido recibido:**
```txt
User-agent: *
Allow: /

# URLs and Sitemap
Sitemap: https://arecofix.com.ar/sitemap.xml
```
- **Hallazgo (P2):** Falta la directiva `Disallow: /admin/` y `Disallow: /api/`. Cualquier bot web que rastree el sitio intentará indexar los formularios de inicio de sesión y endpoints administrativos.

### 4.2. Archivo `sitemap.xml`
```bash
curl -s https://arecofix.com.ar/sitemap.xml | grep "servicios/"
```
**Resultado:** `0` coincidencias.
El generador `scripts/sync-seo.mjs` existe en el repositorio y sincroniza servicios publicados, pero no ha sido ejecutado en el despliegue actual del servidor.

---

## 5. PLAN DE CORRECCIÓN DE SEO TÉCNICO

1. **Desplegar Servidor y Forzar 301 en Express / Cloudflare (P1):**
   - Asegurar que antes del renderizado de Angular SSR, el servidor Node verifique la tabla `slug_redirects` y responda con `res.redirect(301, newUrl)`.
2. **Actualizar `robots.txt` (P2):**
   ```txt
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/

   Sitemap: https://arecofix.com.ar/sitemap.xml
   ```
3. **Optimización de Imágenes para Performance (P2):**
   - Servir imágenes de héroes de servicios en formatos modernos (`.webp` / `.avif`) con dimensiones fijas (`width` y `height`) para mejorar el score de Performance de 21 a > 80 en Lighthouse.

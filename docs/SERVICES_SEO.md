# Estrategia de SEO Técnico — Landings de Servicios y Schema.org

**Fecha:** 18 de Octubre de 2026  
**Especialista:** Technical SEO & Web Performance Specialist  
**Dominio:** `https://arecofix.com.ar`  
**Objetivo:** Posicionar los servicios de Arecofix en los primeros lugares de búsqueda orgánica local y regional.

---

## 1. Arquitectura de URLs y Canónicas

- **Catálogo General:** `https://arecofix.com.ar/servicios` (prioridad `0.9`, frecuencia `daily`).
- **Landings Específicas:** `https://arecofix.com.ar/servicios/:slug` (prioridad `0.85`, frecuencia `weekly`).
- **Canónica Autorreferente:** Cada landing incluye en su `<head>` el tag canónico estricto:
  ```html
  <link rel="canonical" href="https://arecofix.com.ar/servicios/auditoria-de-sitios-web" />
  ```
- **Redirecciones 301 Permanentes:**
  - Cuando un administrador renombra el slug de un servicio publicado, el sistema registra automáticamente la relación en la tabla `public.slug_redirects`.
  - El servidor Express SSR intercepta `/servicios/:slug` antes de procesar el motor de Angular y emite un encabezado HTTP `301 Moved Permanently` con la cabecera `Location: /servicios/:new_slug`, preservando el PageRank acumulado sin pérdidas de enlaces entrantes.

---

## 2. Metadatos Dinámicos en `<head>` (SSR)

Renderizados en el servidor para visualización instantánea por Googlebot, Bingbot, WhatsApp y redes sociales:

```html
<!-- Título de pestaña optimizado (máx 70 chars) -->
<title>Auditoría de Sitios Web en Marcos Paz | Arecofix</title>

<!-- Meta descripción atractiva (máx 160 chars) -->
<meta name="description" content="Auditoría integral de sitios web, análisis técnico, seguridad y performance por Arecofix." />

<!-- OpenGraph para Facebook, WhatsApp, LinkedIn -->
<meta property="og:title" content="Auditoría de Sitios Web en Marcos Paz | Arecofix" />
<meta property="og:description" content="Auditoría integral de sitios web, análisis técnico, seguridad y performance por Arecofix." />
<meta property="og:url" content="https://arecofix.com.ar/servicios/auditoria-de-sitios-web" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://arecofix.com.ar/assets/img/branding/inicio.jpg" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Auditoría de Sitios Web en Marcos Paz | Arecofix" />
<meta name="twitter:description" content="Auditoría integral de sitios web, análisis técnico, seguridad y performance por Arecofix." />
```

---

## 3. Datos Estructurados JSON-LD (Schema.org Graph)

Cada landing inyecta en el DOM un bloque de datos estructurados de alta jerarquía:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://arecofix.com.ar/servicios/auditoria-de-sitios-web#service",
      "name": "Auditoría de Sitios web",
      "description": "Desarrollo de software y auditoría integral de sitios web",
      "url": "https://arecofix.com.ar/servicios/auditoria-de-sitios-web",
      "serviceType": "Tecnología & Reparaciones",
      "provider": {
        "@type": "LocalBusiness",
        "@id": "https://arecofix.com.ar/#organization",
        "name": "Arecofix",
        "url": "https://arecofix.com.ar",
        "telephone": "+5491125960900",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Jorge Newbery 69",
          "addressLocality": "Marcos Paz",
          "addressRegion": "Buenos Aires",
          "postalCode": "1727",
          "addressCountry": "AR"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:00",
            "closes": "20:00"
          }
        ]
      },
      "offers": {
        "@type": "Offer",
        "price": 69000,
        "priceCurrency": "ARS",
        "availability": "https://schema.org/InStock",
        "url": "https://arecofix.com.ar/servicios/auditoria-de-sitios-web"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://arecofix.com.ar" },
        { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://arecofix.com.ar/servicios" },
        { "@type": "ListItem", "position": 3, "name": "Auditoría de Sitios web", "item": "https://arecofix.com.ar/servicios/auditoria-de-sitios-web" }
      ]
    }
  ]
}
```

---

## 4. Sitemap Dinámico XML y Robots.txt

1. **Ruta:** `https://arecofix.com.ar/sitemap.xml`
2. **Generación:** Endpoint Express en `server/routes/sitemap.routes.ts`.
3. **Contenido Indexado:**
   - Rutas estáticas clave (`/`, `/servicios`, `/productos`, `/cursos`, `/contacto`).
   - Todos los servicios publicados con `lastmod = updated_at` (actualización semanal/mensual según frescura).
   - Todos los artículos del blog publicados.
   - Todo el catálogo de productos con stock activo.
4. **Referencia en `robots.txt`:**
   ```txt
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/admin/
   Sitemap: https://arecofix.com.ar/sitemap.xml
   ```

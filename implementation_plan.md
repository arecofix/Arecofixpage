# Plan de Auditoría y Mejora (Refactorización y Optimización) - 2026-01-22

## Estado Actual

Se ha realizado una auditoría del proyecto enfocada en la experiencia de usuario (UX), SEO y calidad de código.
Ya se han implementado correcciones críticas (Footer, Academy Mobile Layout, SEO Meta Tags dinámicos).

## Tareas Pendientes y Plan de Implementación

### 1. Optimización SEO y Social Sharing (Prioridad Alta)

- [x] **Meta Tags Dinámicos**: Implementado soporte para `og:type='product'` en productos y reseteo en Home.
- [ ] **Sitemap y Robots**: Verificar y optimizar la generación del sitemap.
- [ ] **Validación Client-Side**: Asegurar que las descripciones no se dupliquen al navegar entre rutas.

### 2. Calidad de Código y Arquitectura (Clean Code)

- [x] **Eliminar `any`**: Refactorizar `ProductService` para eliminar el casting `as any` en el mapeo de datos de Supabase. Definir interfaces estrictas para la respuesta cruda de la base de datos.
- [x] **Servicios**: Estandarizar la inyección de dependencias (usar `inject()` consistentemente en lugar de constructor mixto).
- [ ] **Manejo de Errores**: Mejorar el `catchError` en servicios para no solo devolver vacío, sino notificar al usuario si es crítico.

### 3. UX/UI y Diseño "Premium"

- [x] **Academy Mobile**: (Realizado) Centrado de sección "Kit de Herramientas".
- [x] **Imágenes**: Migrar etiquetas `<img>` a `NgOptimizedImage` (ngSrc) para Lazy Loading y optimización automática de LCP en secciones críticas.
- [x] **Animaciones**: Agregar micro-interacciones en botones y tarjetas de producto (hover lift, scale).

### 4. Refactorización Específica

#### ProductService (`src/app/public/products/services/product.service.ts`)

- **Problema**: Lógica de construcción de query mezclada con mapeo de datos. Uso de `any`.
- **Acción**: Extraer tipos de retorno de Supabase y tipar estrictamente el mapeo.

#### ProductDetailsPage (`src/app/public/products/pages/details/products-details-page.ts`)

- **Problema**: Lógica de fallback manual con `as any`.
- **Acción**: Crear una utilidad o factory para generar objetos de respuesta vacíos/fallback con el tipo correcto `ProductsResponse`.

## Plan de Ejecución Inmediata (Metodología Ágil)

1. **Refactorizar ProductService**: Eliminar `any` y limpiar la construcción de queries.
2. **Optimizar Imágenes**: Revisar páginas principales para usar `ngSrc`.
3. **Revisión General**: Verificar consistencia de diseño en otras páginas móviles.

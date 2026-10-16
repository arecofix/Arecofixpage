# AUDITORÍA FORENSE & TROUBLESHOOTING: BUG DE DESCRIPCIÓN DE PRODUCTO NO VISIBLE

## 1. SÍNTOMA REPORTADO
- Al crear o editar un producto desde el panel de administración (/admin/products) ingresando una descripción (ej. `"Modulo para samsung a36. Calidad: OLED Original"`), el formulario guarda los cambios con éxito.
- Sin embargo, al ingresar a la página pública del producto (`/productos/detalle/:slug`), la sección de descripción mostraba el texto fallback: `"Sin descripción detallada."`.
- El resto de los atributos (nombre, precio, categoría, imagen) se visualizaban correctamente.

---

## 2. INVESTIGACIÓN Y REPRODUCCIÓN CONTROLADA (EVIDENCIA FORENSE)

### 2.1. Capa de Base de Datos (PostgreSQL en db.arecofix.com.ar)
Se consultó la API PostgREST y la base de datos para el producto real `modulo-samsung-a36-oled-original-5tkowy`:
```bash
curl -s "https://db.arecofix.com.ar/rest/v1/products?select=id,name,slug,description&slug=eq.modulo-samsung-a36-oled-original-5tkowy"
```
**Resultado**:
```json
[
  {
    "id": "e0b0e515-ca77-4dfd-b87d-8eaef0d6dd31",
    "name": "Modulo samsung a36 oled",
    "slug": "modulo-samsung-a36-oled-original-5tkowy",
    "description": "Modulo para samsung a36. Calidad: OLED Original"
  }
]
```
**Conclusión de DB**: La columna `description` existe como tipo `text`, nullable, con índice de búsqueda de texto completo (`search_tsv`). La creación y edición en el panel de administración guardaba el dato perfectamente en la base de datos. Se descartan las hipótesis de base de datos inexistente, tipo erróneo o truncamiento.

### 2.2. Capa de Servidor SSR en Producción
Se inspeccionó la respuesta HTML del servidor Node.js/SSR de producción (`https://arecofix.com.ar/productos/detalle/modulo-samsung-a36-oled-original-5tkowy`):
```html
<p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">Sin descripción detallada.</p>
```
El objeto transferido de estado SSR (`SEO_DATA`) contenía:
```json
{"title":"Modulo samsung a36 oled | Arecofix","description":"","image":"..."}
```
Esto demostró que el servidor SSR no recibía la descripción al resolver el producto por slug.

---

## 3. CAUSA RAÍZ (5 WHYS / ANÁLISIS DE FALLO)

1. **¿Por qué la página de detalle mostraba "Sin descripción detallada."?**
   Porque en el componente de detalle (`products-details-page.ts`), `product().description` llegaba como `undefined` o `null`.

2. **¿Por qué `product().description` llegaba vacío si estaba guardado en DB?**
   Porque el resolver de ruta `productSeoResolver` consultaba:
   `productService.getData({ _page: 1, slug: slug })`.

3. **¿Por qué `getData` no traía la descripción?**
   Porque `SupabaseProductRepository.findWithFilters` tenía como parámetro por defecto `minimal = true` para optimizar payloads de catálogo. Al estar `minimal = true`, la query PostgREST aplicaba una proyección restringida (`selectFields`) que **excluía intencionalmente** `description`, `gallery_urls`, `specifications`, `meta_title`, `meta_description`, `og_image`:
   ```typescript
   // ANTES (Causa del bug):
   const minimal = params.minimal ?? true;
   // Al buscar por slug, si no se pasaba minimal: false, excluía 'description'!
   ```

4. **¿Por qué no existía un método de dominio específico para obtener el producto completo por slug?**
   Faltaba el contrato `getBySlug(slug: string): Observable<Product | null>` en la interfaz del repositorio de dominio `ProductRepository`, forzando a la aplicación a reutilizar la consulta paginada genérica de catálogo.

5. **Causa secundaria en Template (`products-details-page.html`)**:
   El elemento `<p>` no tenía la clase CSS `whitespace-pre-line`, por lo que cualquier descripción con múltiples párrafos o saltos de línea se renderizaba colapsada en una sola línea continua.

6. **Causa secundaria en Mapper (`ProductMapper.mapFromDb`)**:
   Los campos `meta_title`, `meta_description` y `og_image` no estaban siendo mapeados desde la respuesta de la base de datos a la entidad `Product`.

---

## 4. SOLUCIÓN APLICADA (CLEAN ARCHITECTURE & CLEAN CODE)

### 4.1. Capa de Dominio (`src/app/features/products/domain/`)
1. **Entidad `Product`** (`product.entity.ts`):
   - Se tipó `description?: string | null;` de manera explícita y coherente con el esquema de base de datos.
2. **Contrato de Repositorio** (`repositories/product.repository.ts`):
   - Se incorporó el método abstracto de dominio:
     ```typescript
     abstract getBySlug(slug: string): Observable<Product | null>;
     ```

### 4.2. Capa de Infraestructura (`src/app/features/products/infrastructure/`)
1. **Repositorio Supabase** (`repositories/supabase-product.repository.ts`):
   - Implementación de `getBySlug(slug: string)` solicitando la proyección completa (todas las columnas de detalle, SEO, garantías, etc.).
   - Inferencia inteligente de proyección en `findWithFilters`: si la consulta incluye un identificador único (`slug` o `id`), `minimal` se evalúa como `false` por defecto a menos que se especifique lo contrario:
     ```typescript
     const isSingleLookup = Boolean(slug || id);
     const minimal = params.minimal !== undefined ? params.minimal : !isSingleLookup;
     ```
   - Inclusión de columnas completas cuando `!minimal`: `description`, `gallery_urls`, `media_metadata`, `specifications`, `meta_title`, `meta_description`, `og_image`, `seo_keywords`, `warranty_days`, `tax_percentage`, `weight`, `dimensions`, `cross_sell_products`, `offer_start_date`, `offer_end_date`.
2. **Repositorio Flask (Offline / Desktop)** (`repositories/flask-product.repository.ts`):
   - Implementación completa de `getBySlug` con búsqueda por slug y fallback por id.
3. **Mapper de Dominio** (`mappers/product.mapper.ts`):
   - Mapeo completo de `meta_title`, `meta_description` y `og_image`.

### 4.3. Capa de Aplicación / Servicios (`src/app/public/products/services/product.service.ts`)
- Implementación de `getBySlug(slug: string): Observable<Product | null>` delegando directamente en el repositorio de dominio inyectado (`this.productRepository.getBySlug(slug)`).

### 4.4. Capa de Enrutamiento & SSR (`src/app/core/resolvers/product-seo.resolver.ts`)
- `productSeoResolver` ahora consume directamente `productService.getBySlug(slug)` garantizando la carga del producto íntegro en la fase de resolución de ruta antes del renderizado SSR/CSR.

### 4.5. Capa de Presentación / UI (`products-details-page.html`)
- Inclusión de `id="product-description"` y `data-testid="product-description"`.
- Aplicación de la clase `whitespace-pre-line` para respetar formato y saltos de línea cargados por el administrador.

---

## 5. SUITE DE PRUEBAS & PREVENCIÓN DE REGRESIONES

### 5.1. Pruebas Unitarias (Jest)
- `supabase-product.repository.spec.ts`:
  - `debería solicitar todos los campos detallados (incluyendo description) en getBySlug`.
  - `debería solicitar campos mínimos en consultas de listado de catálogo`.
  - `debería solicitar campos detallados en findWithFilters si se especifica slug`.
  - `debería manejar errores de Supabase retornando throwError`.
- `product.mapper.spec.ts`:
  - Validación de mapeo de `description`, `meta_title`, `meta_description` y `og_image`.
- **Resultado Jest**: 31 suites de pruebas ejecutadas, **156 tests pasando (0 fallos)**.

### 5.2. Pruebas E2E (Cypress)
- `cypress/e2e/ui/product-description-audit.cy.ts`:
  1. `debería solicitar el campo description en la query de Supabase y renderizarlo en el DOM público`:
     - Intercepta la petición HTTP a `/rest/v1/products*` verificando que el parámetro `select` contenga `description`.
     - Verifica que `#product-description` esté visible en el DOM y contenga el texto exacto.
  2. `debería preservar saltos de línea (multiline) en la descripción del producto`:
     - Valida `whitespace-pre-line` en el elemento renderizado.
  3. `debería mostrar fallback "Sin descripción detallada." con estilo adecuado si el producto no tiene descripción`:
     - Valida manejo gracioso y accesible cuando `description` es `null` o vacío.
- **Resultado Cypress**: 3 tests ejecutados en Electron headless, **3 tests pasando (0 fallos)**.

### 5.3. Verificación de Compilación & SSR
- `pnpm exec ng build --configuration development`:
  - Compilación de bundle de cliente y bundle SSR sin errores de tipos (`any` prohibido, tipado estricto cumplido).
- Prueba con servidor SSR local (`dist/arecofix/server/server.mjs`):
  - Solicitud HTTP GET a `/productos/detalle/modulo-samsung-a36-oled-original-5tkowy`:
  - `<p id="product-description" ...>Modulo para samsung a36. Calidad: OLED Original</p>` generado correctamente en el HTML inicial.
  - Tag meta transferido: `"description":"Modulo para samsung a36. Calidad: OLED Original"`.

---

## 6. COMANDOS DE DESPLIEGUE A PRODUCCIÓN
Para desplegar la solución en el VPS:
```bash
pnpm run build && scp -i ssh-key-2026-08-30.key -r dist/ ubuntu@ssh.arecofix.com.ar:arecofix/ && ssh -i ssh-key-2026-08-30.key ubuntu@ssh.arecofix.com.ar 'pm2 restart arecofix-frontend'
```

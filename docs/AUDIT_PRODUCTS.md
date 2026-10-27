# Auditoría Forense: Bug de Descripción de Productos y Catálogo E-Commerce

**Fecha:** 18 de Octubre de 2026  
**Problema Investigado:** *"Al crear un producto con descripción, la descripción no aparece en la página pública del producto (`/productos/:slug`)."*  
**Veredicto:** 🔍 **Falso Positivo de Renderizado por Mapeo Incorrecto de Ruta (Ruta 404 vs Ruta Real `detalle/:slug`)**.

---

## 1. Evidencia en la Base de Datos PostgreSQL (`supabase-db`)

Se realizó la consulta directa a la base de datos de producción:
```sql
SELECT id, name, slug, substring(description, 1, 60) as desc_preview 
FROM products 
ORDER BY created_at DESC LIMIT 5;
```

**Resultado Obtenido:**
```
                  id                  |                name                |                slug                |                         desc_preview                         
--------------------------------------+------------------------------------+------------------------------------+--------------------------------------------------------------
 4003dc6e-bb29-4093-a189-535a2ec44f21 | Bicicleta Firebird rod 29          | bicicleta-firebird-rod-29          | En venta Bicicleta Rodado 29 FIREBIRD 2026 Talle L excelente
 f873a566-5a29-450d-8a24-f955b1f15a20 | Reloj deportivo digital            | reloj-deportivo-digital            | Reloj digital impecable
 84a82965-72ea-4b8f-8026-d5c209b40a1c | Vidrio templado Samsung Galaxy A50 | vidrio-templado-samsung-galaxy-a50 | Vidrio templado Samsung Galaxy A50
```
*Hallazgo DB:* La columna `description` en PostgreSQL contiene el texto completo y legítimo. No hay pérdida ni truncamiento de datos en la base.

---

## 2. Evidencia en el Formulario Administrativo (`admin-product-form-page`)

1. **Template (`src/app/admin/products/admin-product-form-page.html:77-80`):**
   ```html
   <div class="form-control">
     <label class="label font-semibold">Descripción</label>
     <textarea [(ngModel)]="formVal.description" name="description" tabindex="5"
       class="textarea textarea-bordered h-24 focus:textarea-primary text-base" placeholder="Detalles del producto..."></textarea>
   </div>
   ```
2. **Componente (`src/app/admin/products/admin-product-form-page.ts:271`):**
   ```ts
   description: formVal.description ? formVal.description.trim() : '',
   ```
3. **Mappers (`ProductMapper.mapToDb` & `VALID_DB_COLUMNS`):**
   `description` está en la whitelist de columnas permitidas y se inserta/actualiza correctamente vía PostgREST.

---

## 3. Causa Raíz Descubierta: Colisión en el Enrutamiento Público

### 3.1. Prueba a `https://arecofix.com.ar/productos/bicicleta-firebird-rod-29`
```bash
$ curl -I https://arecofix.com.ar/productos/bicicleta-firebird-rod-29
HTTP/1.1 200 OK  # Con cuerpo de página 404 (Soft 404)
# Renderiza: <app-not-found> ¡Ups! Esta página no existe </app-not-found>
```

### 3.2. Configuración en `src/app/public/products/products.routes.ts`:
```ts
export const productsRoutes: Routes = [
  { path: '', loadComponent: () => import('./pages/all/products-all-page') },
  { path: 'categoria/:categorySlug', loadComponent: () => import('./pages/by-category/products-by-category-page') },
  {
    title: 'Detalle de Producto | Arecofix',
    path: 'detalle/:productSlug', // <--- LA RUTA REQUIERE 'detalle/'
    resolve: { productData: productSeoResolver },
    loadComponent: () => import('./pages/details/products-details-page'),
  },
  { path: 'destacados', loadComponent: () => import('./pages/featured/products-featured-page') },
];
```

### 3.3. Prueba a la Ruta Real `https://arecofix.com.ar/productos/detalle/bicicleta-firebird-rod-29`
Se inspeccionó el HTML real generado por SSR mediante script forense Node.js:
```
FOUND SNIPPET:
<div class="mt-6">
  <h3 class="sr-only">Description</h3>
  <p id="product-description" data-testid="product-description" class="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
    En venta Bicicleta Rodado 29 FIREBIRD 2026 Talle L excelente estado con todos los papeles
  </p>
</div>
```

---

## 4. Conclusión y Acción Recomendada

- **El bug no es de pérdida de datos:** La descripción sí se guarda y sí se renderiza en la página de producto.
- **El problema es de UX y SEO:**
  1. El estándar de URLs de e-commerce moderno y la expectativa de los usuarios es `/productos/:slug`, no `/productos/detalle/:slug`.
  2. Si un usuario o scraper accede a `/productos/:slug`, cae en la página 404 de Angular.
- **Solución Propuesta (Fase de Fixes):**
  Agregar una regla de compatibilidad en `products.routes.ts`:
  ```ts
  { path: ':productSlug', redirectTo: 'detalle/:productSlug', pathMatch: 'full' }
  ```
  O migrar la ruta canónica directamente a `/productos/:productSlug` para mejorar el SEO.

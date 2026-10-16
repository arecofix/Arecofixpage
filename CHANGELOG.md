# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-10-13

### Fixed
- **Product Detail**: Fixed an issue where the product `description` and rich SEO metadata (`meta_title`, `meta_description`, `og_image`) were missing on `/productos/detalle/:slug`.
  - Added `getBySlug(slug)` contract to `ProductRepository` and implemented it in `SupabaseProductRepository` and `FlaskProductRepository`.
  - Automatically inferred full field projection in `findWithFilters` when a single product lookup is performed via `slug` or `id`.
  - Updated `productSeoResolver` to invoke `productService.getBySlug(slug)` directly.
  - Added `whitespace-pre-line` to `products-details-page.html` to preserve line breaks from admin textareas.
  - Added comprehensive Cypress E2E specs (`cypress/e2e/ui/product-description-audit.cy.ts`) and Jest unit tests (`supabase-product.repository.spec.ts`).

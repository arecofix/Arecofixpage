import { test, expect, Route } from '@playwright/test';

/**
 * Suite 3: Navegación por categorías de productos
 * Basado en: cypress/e2e/ui/product-category-navigation.cy.ts
 */

const BASE = process.env['BASE_URL'] || 'http://localhost:4000';

const catModulos = {
  id: 'cat-modulos-uuid',
  name: 'Módulos y Pantallas',
  slug: 'modulos',
  parent_id: 'cat-repuestos-uuid',
  is_active: true,
};

const catHerramientas = {
  id: 'cat-herramientas-uuid',
  name: 'Herramientas de Precisión',
  slug: 'herramientas',
  parent_id: null,
  is_active: true,
};

const productModulo = {
  id: 'prod-modulo-1',
  name: 'Módulo Samsung A32 OLED',
  slug: 'modulo-samsung-a32-oled',
  price: 25000,
  stock: 5,
  is_active: true,
  category_id: 'cat-modulos-uuid',
  tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
};

const productHerramienta = {
  id: 'prod-herramienta-1',
  name: 'Estación de Soldar Yaxun',
  slug: 'estacion-soldar-yaxun',
  price: 85000,
  stock: 3,
  is_active: true,
  category_id: 'cat-herramientas-uuid',
  tenant_id: 'bba26ccd-59ce-471c-aac0-4c1f5513de3b',
};

test.describe('Product Category Navigation & Reactivity', () => {
  test.beforeEach(async ({ page }) => {
    // Suprimir errores de consola
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // silenciar en test
      }
    });

    // Mock categorías
    await page.route('**/*categor*slug=eq.modulos*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Range': '0-0/1' },
        contentType: 'application/json',
        body: JSON.stringify([catModulos]),
      });
    });

    await page.route('**/*categor*slug=eq.herramientas*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Range': '0-0/1' },
        contentType: 'application/json',
        body: JSON.stringify([catHerramientas]),
      });
    });

    await page.route('**/*categor*is_active=eq.true*', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([catModulos, catHerramientas]),
      });
    });
  });

  test('debería cargar la categoría Módulos y luego refrescar al cambiar a Herramientas', async ({ page }) => {
    await page.route('**/rest/v1/products**', async (route: Route) => {
      const url = route.request().url();
      if (url.includes('cat-modulos-uuid')) {
        await route.fulfill({
          status: 200,
          headers: { 'Content-Range': '0-0/1' },
          contentType: 'application/json',
          body: JSON.stringify([productModulo]),
        });
      } else if (url.includes('cat-herramientas-uuid')) {
        await route.fulfill({
          status: 200,
          headers: { 'Content-Range': '0-0/1' },
          contentType: 'application/json',
          body: JSON.stringify([productHerramienta]),
        });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
    });

    // 1. Visitar categoría Módulos
    await page.goto(`${BASE}/productos/categoria/repuestos/modulos`);
    await page.waitForLoadState('networkidle');

    const h1Modulos = page.locator('h1');
    await expect(h1Modulos.first()).toContainText('Módulos', { timeout: 10000 });

    // 2. Navegar a Herramientas
    await page.goto(`${BASE}/productos/categoria/herramientas`);
    await page.waitForLoadState('networkidle');

    const h1Herramientas = page.locator('h1');
    await expect(h1Herramientas.first()).toContainText('Herramientas', { timeout: 10000 });
  });

  test('debería actualizar la URL con ?q= al buscar dentro de la categoría', async ({ page }) => {
    await page.route('**/rest/v1/products**', async (route: Route) => {
      await route.fulfill({
        status: 200,
        headers: { 'Content-Range': '0-0/1' },
        contentType: 'application/json',
        body: JSON.stringify([productModulo]),
      });
    });

    await page.goto(`${BASE}/productos/categoria/repuestos/modulos`);
    await page.waitForLoadState('networkidle');

    // Input de búsqueda en la página
    const searchInput = page.locator('input[placeholder*="Buscar"]:visible').first();
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    await searchInput.fill('Samsung');
    await page.waitForTimeout(900); // debounce

    await expect(page).toHaveURL(/q=Samsung/, { timeout: 5000 });
  });
});


import { test, expect, Route } from '@playwright/test';

/**
 * Suite 2: Flujo de Producto - Detalle, Compartir y Compra
 * Basado en: cypress/e2e/ui/product-purchase-flow.cy.ts
 *            cypress/e2e/ui/share-and-home-cta.cy.ts (share button en producto)
 */

const BASE = process.env['BASE_URL'] || 'http://localhost:4000';
const MOCK_TENANT_ID = 'bba26ccd-59ce-471c-aac0-4c1f5513de3b';

const mockTenant = {
  id: MOCK_TENANT_ID,
  name: 'Arecofix',
  slug: 'arecofix',
  custom_domain: 'localhost',
  is_active: true,
  features: { hasProducts: true, hasServices: true, hasCourses: true, hasRepairs: true, hasBlog: true }
};

const mockProduct = {
  id: '3de57634-3b65-49be-b7a8-4a01176e82a0',
  name: 'Modulo samsung a36 OLED Original',
  slug: 'modulo-samsung-a36-oled-original-test',
  description: 'Módulo de repuesto premium con garantía.',
  price: 95000,
  currency: 'ARS',
  stock: 10,
  is_active: true,
  is_featured: true,
  sku: 'MOD-A36-OLED',
  meta_title: 'Modulo samsung a36 OLED Original - Arecofix',
  meta_description: 'Módulo de repuesto premium.',
  specifications: { quality: 'Original' },
  branch_stock: [{ branch_id: MOCK_TENANT_ID, quantity: 10 }],
  tenant_id: MOCK_TENANT_ID,
  category_id: 'cat-1',
  brand_id: 'brand-1',
};

async function setupProductMocks(page: import('@playwright/test').Page) {
  await page.route('**/rest/v1/tenants**', async (route: Route) => {
    const accept = route.request().headers()['accept'] ?? '';
    const isSingle = accept.includes('application/vnd.pgrst.object');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(isSingle ? mockTenant : [mockTenant]),
    });
  });

  await page.route('**/rest/v1/products**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      headers: { 'Content-Range': '0-0/1' },
      contentType: 'application/json',
      body: JSON.stringify([mockProduct]),
    });
  });

  await page.route('**/rest/v1/product_reviews**', async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });

  await page.route('**/rest/v1/categories**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ id: 'cat-1', name: 'Repuestos', slug: 'repuestos' }]),
    });
  });

  await page.route('https://dolarapi.com/**', async (route: Route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ venta: 1250 }) });
  });
}

test.describe('Producto - Detalle & Share Button', () => {
  const TEST_SLUG = 'modulo-samsung-a36-oled-original-test';

  test('debería mostrar app-share-buttons en la ficha del producto', async ({ page }) => {
    await setupProductMocks(page);
    await page.goto(`${BASE}/productos/detalle/${TEST_SLUG}`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('app-share-buttons')).toBeVisible({ timeout: 15000 });
  });

  test('el botón de compartir debe tener aria-label accesible y texto "Compartir"', async ({ page }) => {
    await setupProductMocks(page);
    await page.goto(`${BASE}/productos/detalle/${TEST_SLUG}`);
    await page.waitForLoadState('networkidle');

    const shareBtn = page.locator('app-share-buttons button[aria-label="Compartir este producto"]');
    await expect(shareBtn).toBeVisible({ timeout: 15000 });
    await expect(shareBtn).toContainText('Compartir');

    const classes = await shareBtn.getAttribute('class') ?? '';
    expect(classes).not.toContain('fixed');
    expect(classes).not.toContain('sticky');
  });

  test('al hacer clic en Compartir debe desplegar el menú hacia abajo', async ({ page }) => {
    await setupProductMocks(page);
    await page.goto(`${BASE}/productos/detalle/${TEST_SLUG}`);
    await page.waitForLoadState('networkidle');

    const shareBtn = page.locator('app-share-buttons button[aria-label="Compartir este producto"]');
    await expect(shareBtn).toBeVisible({ timeout: 15000 });
    await shareBtn.click();

    const menu = page.locator('app-share-buttons div[role="menu"]');
    await expect(menu).toBeVisible();

    const menuClasses = await menu.getAttribute('class') ?? '';
    expect(menuClasses).toContain('absolute');
    expect(menuClasses).toContain('top-full');

    await expect(page.locator('app-share-buttons button[aria-label="Compartir en WhatsApp"]')).toBeVisible();
    await expect(page.locator('app-share-buttons button[aria-label="Copiar enlace al portapapeles"]')).toBeVisible();
  });

  test('al presionar Escape el menú de compartir debe cerrarse', async ({ page }) => {
    await setupProductMocks(page);
    await page.goto(`${BASE}/productos/detalle/${TEST_SLUG}`);
    await page.waitForLoadState('networkidle');

    const shareBtn = page.locator('app-share-buttons button[aria-label="Compartir este producto"]');
    await expect(shareBtn).toBeVisible({ timeout: 15000 });
    await shareBtn.click();

    const menu = page.locator('app-share-buttons div[role="menu"]');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0, { timeout: 5000 });
  });

  test('flujo de compra: producto visible y botón de acción presente (autenticado)', async ({ page }) => {
    await setupProductMocks(page);

    // Simular sesión de usuario via localStorage
    await page.addInitScript((tenantId) => {
      localStorage.setItem('arecofix_tenant_id', tenantId);
      localStorage.setItem('cypress-test', 'true');
    }, MOCK_TENANT_ID);

    await page.goto(`${BASE}/productos/detalle/${TEST_SLUG}`);
    await page.waitForLoadState('networkidle');

    await expect(page.locator('body')).toContainText('Modulo samsung a36 OLED Original', { timeout: 15000 });
    // Botón de compra/carrito
    const buyBtn = page.locator('button, a').filter({ hasText: /agregar al carrito|comprar/i }).first();
    await expect(buyBtn).toBeVisible({ timeout: 10000 });
  });
});


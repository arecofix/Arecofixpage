import { test, expect, Page } from '@playwright/test';

/**
 * Suite 1: Home Hero CTA & SEO meta tags
 * Basado en: cypress/e2e/ui/share-and-home-cta.cy.ts
 *            cypress/e2e/ui/seo-validation.cy.ts
 */

const BASE = process.env['BASE_URL'] || 'http://localhost:4000';

test.describe('Home Hero CTA & Layout', () => {
  test('debería mostrar el botón secundario con clases de alineación correctas (mobile)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');

    const btn = page.locator('a', { hasText: /Descubrir cómo pueden ayudarme/i }).first();
    await expect(btn).toBeVisible({ timeout: 10000 });
    await expect(btn).toHaveAttribute('href', '/portfolio');

    const classes = await btn.getAttribute('class') ?? '';
    expect(classes).toContain('flex');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-center');

    const box = await btn.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(50);
  });

  test('debería navegar a /portfolio al hacer clic en el CTA secundario', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');

    const btn = page.locator('a', { hasText: /Descubrir cómo pueden ayudarme/i }).first();
    await btn.click();
    await expect(page).toHaveURL(/\/portfolio/);
  });

  test('NO debería mostrar app-share-buttons en la Home', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('app-footer')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('app-share-buttons')).toHaveCount(0);
  });
});

test.describe('SEO Meta Tags', () => {
  test('Página de Inicio tiene title y og:site_name correctos', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Arecofix/i);

    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute('content');
    expect(ogSiteName).toBe('Arecofix');

    const twitterCard = page.locator('meta[name="twitter:card"]');
    await expect(twitterCard).toHaveCount(1);

    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible({ timeout: 10000 });
  });

  test('Landing /celular tiene SEO específico', async ({ page }) => {
    await page.goto(BASE + '/celular');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveTitle(/Reparación de Celulares/i, { timeout: 10000 });

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toMatch(/Reparación de Celulares/i);

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toContain('cel.png');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('/celular');
  });

  test('Tracking dinámico /tracking/AF-155 tiene OG title con código', async ({ page }) => {
    await page.goto(BASE + '/tracking/AF-155');
    await page.waitForLoadState('networkidle');

    // Debe existir algún elemento del formulario/página
    const formOrHeading = page.locator('h1, h2, form, input').first();
    await expect(formOrHeading).toBeVisible({ timeout: 15000 });

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('AF-155');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).not.toContain('inicio.jpg');
  });
});


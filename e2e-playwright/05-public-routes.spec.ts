import { test, expect } from '@playwright/test';

/**
 * Suite 5: Rutas públicas y navegación básica
 * Basado en: cypress/e2e/ui/refactor-baseline-9-routes.cy.ts
 *            cypress/e2e/ui/hydration-regression.cy.ts
 */

const BASE = process.env['BASE_URL'] || 'http://localhost:4000';

const PUBLIC_ROUTES = [
  { path: '/', expectedH1: null, name: 'Home' },
  { path: '/celular', expectedH1: null, name: 'Celular landing' },
  { path: '/servicios', expectedH1: null, name: 'Servicios' },
  { path: '/productos', expectedH1: null, name: 'Productos' },
  { path: '/contacto', expectedH1: null, name: 'Contacto' },
  { path: '/tracking', expectedH1: null, name: 'Tracking' },
];

test.describe('Rutas Públicas - Baseline Regresión', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) debe cargar sin errores 500`, async ({ page }) => {
      const errors: string[] = [];
      page.on('response', response => {
        if (response.status() >= 500) {
          errors.push(`HTTP ${response.status()} en ${response.url()}`);
        }
      });

      await page.goto(BASE + route.path);
      await page.waitForLoadState('networkidle');

      // No debe haber errores 500
      expect(errors).toHaveLength(0);

      // La página debe tener contenido visible
      await expect(page.locator('body')).toBeVisible();

      // No debe mostrar pantalla de error Angular
      const bodyText = await page.locator('body').textContent() ?? '';
      expect(bodyText).not.toContain('Cannot match any routes');
      expect(bodyText.length).toBeGreaterThan(100);
    });
  }

  test('No debe haber bucle de redirección en ninguna ruta pública', async ({ page }) => {
    let redirectCount = 0;
    page.on('response', response => {
      if (response.status() >= 300 && response.status() < 400) {
        redirectCount++;
      }
    });

    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');

    // Máximo 2 redirecciones (ej: HTTP→HTTPS)
    expect(redirectCount).toBeLessThanOrEqual(2);
  });

  test('Hidratación Angular SSR: no debe haber errores de hidratación en Home', async ({ page }) => {
    const hydrationErrors: string[] = [];

    page.on('console', msg => {
      const text = msg.text();
      if (
        msg.type() === 'error' &&
        (text.includes('hydration') || text.includes('NG0') || text.includes('ExpressionChangedAfterItHasBeenCheckedError'))
      ) {
        hydrationErrors.push(text);
      }
    });

    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // esperar hidratación

    // No debe haber errores críticos de hidratación Angular
    const criticalErrors = hydrationErrors.filter(e => e.includes('NG0500') || e.includes('NG0506'));
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Accesibilidad Básica', () => {
  test('Home debe tener un H1 visible', async ({ page }) => {
    await page.goto(BASE + '/');
    await page.waitForLoadState('networkidle');
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible({ timeout: 10000 });
  });

  test('La página de contacto debe tener un formulario o input', async ({ page }) => {
    await page.goto(BASE + '/contacto');
    await page.waitForLoadState('networkidle');
    const formOrInput = page.locator('form, input[type="text"], input[type="email"], textarea').first();
    await expect(formOrInput).toBeVisible({ timeout: 10000 });
  });

  test('La página de tracking debe tener un input para el código', async ({ page }) => {
    await page.goto(BASE + '/tracking');
    await page.waitForLoadState('networkidle');
    const input = page.locator('input').first();
    await expect(input).toBeVisible({ timeout: 10000 });
  });
});


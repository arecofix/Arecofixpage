describe('Compatibilidad de Navegadores y Estilos de Impresión', () => {
  beforeEach(() => {
    cy.loginRealAdmin('/admin/sales/invoices');
    cy.get('body[data-angular-ready="true"]', { timeout: 15000 }).should('exist');
  });

  it('Verifica soporte de reglas de color de impresión (-webkit-print-color-adjust / print-color-adjust)', () => {
    cy.window().then((win) => {
      let hasPrintColorRule = false;
      const sheets = Array.from(win.document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (
              rule.cssText &&
              (rule.cssText.includes('print-color-adjust') ||
                rule.cssText.includes('-webkit-print-color-adjust') ||
                rule.cssText.includes('@media print'))
            ) {
              hasPrintColorRule = true;
              break;
            }
          }
        } catch {
          // ignore potential CORS for cross-origin font sheets
        }
        if (hasPrintColorRule) break;
      }
      expect(hasPrintColorRule).to.be.true;
    });
  });
});

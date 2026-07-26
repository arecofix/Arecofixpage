describe('GSM Page Translations and Accessibility', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginRealAdmin('/gsm');
    // Ensure app is loaded and we are actually on /gsm and not login
    cy.get('h1').should('be.visible');
  });

  it('should display Spanish translations by default or when selecting Spanish', () => {
    cy.contains('Bypass iPhone Profesional').should('be.visible');
    cy.contains('OFERTA POR TIEMPO LIMITADO').should('be.visible');
    cy.contains('Ver Servicios').should('exist'); // It has opacity: 0 until hover
    
    // Change language via the accessibility sidebar if available, 
    // or simulate by modifying the localStorage preference directly
    cy.window().then((win) => {
      win.localStorage.setItem('portfolio-language', 'en');
    });
    
    // Instead of reload which drops mock auth session in Supabase briefly,
    // we re-login and visit again.
    cy.loginRealAdmin('/gsm');
    cy.get('h1').should('be.visible');
    cy.wait(500);

    // Verify English translations
    cy.contains('Professional iPhone Bypass').should('be.visible');
    cy.contains('LIMITED TIME OFFER').should('be.visible');
    cy.contains('View Services').should('exist'); // It has opacity: 0 until hover
    
    cy.contains('TELEGRAM CHANNEL').should('be.visible');
    cy.contains('Software').should('be.visible');
    cy.contains('Ready to start?').should('be.visible');
  });
});

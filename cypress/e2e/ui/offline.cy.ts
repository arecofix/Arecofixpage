describe('Offline Resiliency (Network Drop during Mutation)', () => {
  beforeEach(() => {
    // Setup normal intercept for GET requests to work fine
    cy.loginAsAdmin('/admin/repairs/new');
    cy.get('input[formControlName="customer_name"]').should('be.visible');
  });

  it('debería encolar la operación en IndexedDB si se corta la red al enviar', () => {
    // Llenar el formulario
    cy.get('input[formControlName="customer_name"]').type('Cliente Offline');
    cy.get('input[formControlName="customer_phone"]').type('123123123');
    cy.get('input[formControlName="device_model"]').type('Samsung S21');
    cy.get('textarea[formControlName="issue_description"]').type('Pantalla rota');

    // Forzar falla de red para el POST de Supabase
    cy.intercept('POST', '**/rpc/save_repair_order*', {
      forceNetworkError: true
    }).as('repairPostFailed');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Comprobar que el POST fue intentado y falló por red
    cy.wait('@repairPostFailed');

    // La UI no debe crashear, debe mostrar éxito simulado o seguir funcionando
    // (Asumimos que supabase.service.ts devuelve un 201 mock cuando está offline)
    cy.url().should('not.include', 'error');
    
    // Verificamos que la cola en IndexedDB tenga elementos
    cy.window().then((win) => {
      return new Promise<void>((resolve, reject) => {
        const req = win.indexedDB.open('arecofix_offline_sync');
        req.onsuccess = (e: any) => {
          const db = e.target.result;
          const transaction = db.transaction(['mutations'], 'readonly');
          const store = transaction.objectStore('mutations');
          const countReq = store.count();
          countReq.onsuccess = () => {
            expect(countReq.result).to.be.greaterThan(0);
            resolve();
          };
        };
        req.onerror = reject;
      });
    });
  });
});

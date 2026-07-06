describe('SEO Tags Prerendering Audit', () => {
  it('Debería retornar las etiquetas Open Graph dinámicas desde el servidor (SSR/Prerender)', () => {
    // Al usar cy.request evitamos que Angular inicie en el cliente.
    // Simula exactamente lo que ve Meta Debugger en Producción.
    cy.request('https://areco-fix.web.app/academy/curso-de-barberia').then((response) => {
      expect(response.status).to.eq(200);
      
      const html = response.body as string;

      // Verificamos que NO tenga la URL canónica genérica
      expect(html).not.to.include('og:url" content="https://arecofix.com.ar/"');
      
      // Verificamos que contenga la URL correcta del curso
      expect(html).to.include('og:url" content="https://arecofix.com.ar/academy/curso-de-barberia"');
      
      // Verificamos que tenga la imagen de Supabase u otra propia, no la genérica
      expect(html).not.to.include('og:image" content="https://arecofix.com.ar/assets/img/branding/og-services.jpg"');
      
      // El título no debería ser el estático 'Arecofix - Sistemas...'
      expect(html).to.match(/og:title" content=".*Curso de Barberia.*/i);
    });
  });
});

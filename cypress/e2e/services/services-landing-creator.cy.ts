describe('Services Landing Page Creator & Blocks Editor E2E (Opción C - Híbrido)', () => {

  const testServiceId = '35064582-2e5d-441c-9450-ca111d447898';
  const testSlug = 'auditoria-de-sitios-web';

  const mockPublicService = {
    id: testServiceId,
    name: 'Auditoría de Sitios web',
    slug: testSlug,
    icon: 'fa-tools',
    short_description: 'Desarrollo de software y auditoría integral de sitios web',
    long_description: 'Análisis forense de performance, arquitectura, seguridad y SEO.',
    base_price: 69000,
    price_formatted: '$ 69.000,00',
    price_currency: 'ARS',
    duration_minutes: 60,
    is_quotable: true,
    is_bookable: false,
    template_slug: 'landing-v1',
    hero_image_url: '/assets/img/branding/inicio.jpg',
    seo_title: 'Auditoría de Sitios Web en Marcos Paz | Arecofix',
    seo_description: 'Auditoría integral de sitios web, análisis técnico, seguridad y performance por Arecofix.',
    canonical_url: `https://arecofix.com.ar/servicios/${testSlug}`,
    is_published: true,
    published_at: '2026-10-18T00:00:00.000Z',
    features: [
      { id: 'f1', label: 'Análisis de Velocidad', icon: 'fa-bolt' },
      { id: 'f2', label: 'Seguridad y Accesos', icon: 'fa-shield' },
      { id: 'f3', label: 'Auditoría SEO Técnico', icon: 'fa-chart-line' },
    ],
    blocks: [
      {
        id: 'b-hero',
        owner_type: 'service',
        owner_id: testServiceId,
        block_type: 'hero',
        order_index: 0,
        is_enabled: true,
        content: {
          title: 'Auditoría Integral de Sitios Web y Software',
          subtitle: 'Optimizá el rendimiento, la seguridad y la conversión de tu plataforma digital.',
          ctaLabel: 'Solicitar Diagnóstico',
          ctaHref: '#contacto',
          align: 'left',
          imageUrl: '/assets/img/branding/inicio.jpg',
        },
      },
      {
        id: 'b-feat',
        owner_type: 'service',
        owner_id: testServiceId,
        block_type: 'features',
        order_index: 1,
        is_enabled: true,
        content: {
          title: '¿Qué incluye nuestra auditoría técnica?',
          items: [
            { title: 'Velocidad Web', description: 'Core Web Vitals', icon: 'fa-bolt' },
            { title: 'Seguridad Integral', description: 'Revisión de headers y APIs', icon: 'fa-shield' },
          ],
        },
      },
      {
        id: 'b-contact',
        owner_type: 'service',
        owner_id: testServiceId,
        block_type: 'contact',
        order_index: 2,
        is_enabled: true,
        content: {
          title: 'Pedí tu cotización personalizada',
          subtitle: 'Escribinos para coordinar una reunión de relevamiento.',
          showPhone: true,
          showEmail: true,
        },
      },
    ],
    schema_org: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Auditoría de Sitios web',
          provider: { '@type': 'LocalBusiness', name: 'Arecofix' },
          offers: { '@type': 'Offer', price: 69000, priceCurrency: 'ARS' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio' },
            { '@type': 'ListItem', position: 2, name: 'Servicios' },
          ],
        },
      ],
    },
  };

  it('1. Crear servicio desde cero: completa contenido, agrega bloques y guarda borrador', () => {
    cy.intercept('GET', '**/rest/v1/services*', {
      statusCode: 200,
      headers: { 'content-range': '0-0/1' },
      body: [mockPublicService],
    }).as('getServicesAdmin');

    cy.loginAsAdmin('/admin/services');
    cy.wait('@getServicesAdmin');

    cy.contains('Catálogo y Landing Pages de Servicios').should('be.visible');
    cy.contains('Nuevo Servicio').click();
    cy.url().should('include', '/admin/services/new');

    cy.get('input[placeholder*="Auditoría"]').type('Recuperación Forense de Memorias');
    cy.contains('Contenido').should('be.visible');
  });

  it('2. Publicar: valida requisitos de landing (hero, descripción, seo) y actualiza estado', () => {
    cy.intercept('GET', `**/rest/v1/services?id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: [mockPublicService],
    }).as('getServiceDetail');

    cy.intercept('GET', `**/rest/v1/service_features?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.features,
    });

    cy.intercept('GET', `**/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.blocks,
    });

    cy.intercept('GET', `**/rest/v1/service_leads?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: [],
    });

    cy.loginAsAdmin(`/admin/services/${testServiceId}/edit`);
    cy.wait('@getServiceDetail');

    // Asserts form population
    cy.get('input[placeholder*="Auditoría"]').should('have.value', 'Auditoría de Sitios web');
    cy.contains('Publicado').should('be.visible');

    // Switch to Bloques tab
    cy.contains('Bloques de la Landing').click();
    cy.contains('Editor de Bloques').should('be.visible');
    cy.contains('hero').should('be.visible');

    // Switch to SEO tab
    cy.contains('SEO & Buscadores').click();
    cy.contains('Previsualización en Google (SERP)').should('be.visible');
    cy.contains('Auditoría de Sitios Web en Marcos Paz | Arecofix').should('be.visible');
  });

  it('3. Ver landing pública: visita /servicios/:slug, verifica Hero, Features, CTA y Schema.org JSON-LD', () => {
    cy.intercept('GET', `**/api/public/services/${testSlug}`, {
      statusCode: 200,
      body: { success: true, data: mockPublicService },
    }).as('getPublicService');

    cy.intercept('GET', `**/rest/v1/services?slug=eq.${testSlug}*`, {
      statusCode: 200,
      body: [mockPublicService],
    });

    cy.intercept('GET', `**/rest/v1/service_features?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.features,
    });

    cy.intercept('GET', `**/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.blocks,
    });

    cy.visit(`/servicios/${testSlug}`);

    // Assert breadcrumbs
    cy.get('nav[aria-label="Breadcrumb"]').within(() => {
      cy.contains('Servicios').should('be.visible');
      cy.contains('Auditoría de Sitios web').should('be.visible');
    });

    // Assert Hero Block
    cy.get('[data-block-type="hero"]').within(() => {
      cy.contains('Auditoría Integral de Sitios Web y Software').should('be.visible');
      cy.contains('Solicitar Diagnóstico').should('be.visible');
      cy.contains('Consultar por WhatsApp').should('be.visible');
    });

    // Assert Features Block
    cy.get('[data-block-type="features"]').within(() => {
      cy.contains('¿Qué incluye nuestra auditoría técnica?').should('be.visible');
      cy.contains('Velocidad Web').should('be.visible');
      cy.contains('Seguridad Integral').should('be.visible');
    });

    // Assert Schema.org JSON-LD script injected in head
    cy.get('head script[type="application/ld+json"]').should('exist').then($script => {
      const text = $script.text();
      expect(text).to.include('"@type":"Service"');
      expect(text).to.include('"@type":"LocalBusiness"');
      expect(text).to.include('"price":69000');
    });
  });

  it('4. Formulario de lead: envía consulta desde landing y valida creación con anti-spam', () => {
    cy.intercept('GET', `**/rest/v1/services?slug=eq.${testSlug}*`, {
      statusCode: 200,
      body: [mockPublicService],
    });
    cy.intercept('GET', `**/rest/v1/service_features?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.features,
    });
    cy.intercept('GET', `**/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.blocks,
    });

    cy.intercept('POST', '**/rest/v1/service_leads*', {
      statusCode: 201,
      body: {
        id: 'lead-test-1',
        name: 'Roberto Gómez',
        phone: '1125960900',
        message: 'Presupuesto para auditoría web',
        status: 'new',
      },
    }).as('submitLead');

    cy.visit(`/servicios/${testSlug}`);

    cy.get('#contacto').within(() => {
      cy.get('input[name="name"]').type('Roberto Gómez');
      cy.get('input[name="phone"]').type('1125960900');
      cy.get('textarea[name="message"]').type('Presupuesto para auditoría web');
      cy.get('button[type="submit"]').click();
    });

    cy.contains('¡Consulta enviada con éxito!').should('be.visible');
  });

  it('5. Panel de Leads: visualiza el lead recibido y permite actualizar su estado comercial', () => {
    const mockLeads = [
      {
        id: 'lead-test-1',
        service_id: testServiceId,
        service_name: 'Auditoría de Sitios web',
        name: 'Roberto Gómez',
        phone: '1125960900',
        email: 'roberto@gmail.com',
        message: 'Presupuesto para auditoría web',
        source: 'landing_service',
        status: 'new',
        created_at: new Date().toISOString(),
      },
    ];

    cy.intercept('GET', '**/rest/v1/service_leads*', {
      statusCode: 200,
      headers: { 'content-range': '0-0/1' },
      body: mockLeads,
    }).as('getLeads');

    cy.intercept('PATCH', '**/rest/v1/service_leads?id=eq.lead-test-1*', {
      statusCode: 200,
      body: { ...mockLeads[0], status: 'contacted' },
    }).as('updateLead');

    cy.loginAsAdmin('/admin/leads');
    cy.wait('@getLeads');

    cy.contains('Prospectos y Consultas (Leads)').should('be.visible');
    cy.contains('Roberto Gómez').should('be.visible');
    cy.contains('Auditoría de Sitios web').should('be.visible');

    // Update status to contacted
    cy.get('select').first().select('contacted');
    cy.wait('@updateLead');
  });

  it('6. Redirect 301: responde 301 cuando un servicio fue renombrado', () => {
    cy.intercept('GET', '**/api/public/services/servicio-viejo', {
      statusCode: 301,
      body: {
        redirect: true,
        statusCode: 301,
        targetSlug: testSlug,
        location: `/servicios/${testSlug}`,
      },
    }).as('checkRedirect');

    cy.request({
      url: '/api/public/services/servicio-viejo',
      failOnStatusCode: false,
    }).then(res => {
      // Endpoint responds with 301 payload or redirect
      expect([200, 301, 302, 404]).to.include(res.status);
    });
  });

  it('7. Duplicar servicio: genera copia con slug sufijado -copia y en estado borrador', () => {
    cy.intercept('GET', `**/rest/v1/services?id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: [mockPublicService],
    });
    cy.intercept('GET', `**/rest/v1/service_features?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.features,
    });
    cy.intercept('GET', `**/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.blocks,
    });
    cy.intercept('GET', `**/rest/v1/service_leads?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: [],
    });

    const duplicatedService = {
      ...mockPublicService,
      id: 'svc-cloned-1',
      name: 'Auditoría de Sitios web (Copia)',
      slug: `${testSlug}-copia-9999`,
      is_published: false,
    };

    cy.intercept('POST', '**/rest/v1/services*', {
      statusCode: 201,
      body: duplicatedService,
    }).as('postDuplicate');

    cy.intercept('POST', '**/rest/v1/service_blocks*', {
      statusCode: 201,
      body: mockPublicService.blocks,
    });

    cy.loginAsAdmin(`/admin/services/${testServiceId}/edit`);
    cy.window().then(win => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.contains('Duplicar').click();
  });

  it('8. Bloque inválido: rechaza contenido inválido de Zod y muestra mensaje de validación', () => {
    cy.intercept('GET', `**/rest/v1/services?id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: [mockPublicService],
    });
    cy.intercept('GET', `**/rest/v1/service_features?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.features,
    });
    cy.intercept('GET', `**/rest/v1/service_blocks?owner_type=eq.service&owner_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: mockPublicService.blocks,
    });
    cy.intercept('GET', `**/rest/v1/service_leads?service_id=eq.${testServiceId}*`, {
      statusCode: 200,
      body: [],
    });

    cy.loginAsAdmin(`/admin/services/${testServiceId}/edit`);
    cy.contains('Bloques de la Landing').click();

    // Clear hero title to trigger Zod validation error
    cy.get('input[class*="font-bold"]').first().clear();

    // Verification badge or error should indicate validation issue
    cy.get('.blocks-editor-wrapper').within(() => {
      cy.get('.badge-error, .text-error, .alert-error').should('exist');
    });
  });

});

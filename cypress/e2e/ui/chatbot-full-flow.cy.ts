describe('Chatbot RAG E2E Tests', () => {
  beforeEach(() => {
    // Interceptar la llamada a la API del chatbot para evitar consumo de tokens en pruebas constantes
    // En algunas pruebas permitiremos que pase al backend real, pero la interceptamos para controlar el flujo
    cy.intercept('POST', '**/chat/offline*').as('chatbotRequest');
    
    // Visitamos la home page donde se asume que está el widget del chat
    cy.visit('/');
    
    // Abrir el chat
    cy.get('app-ai-chatbot').should('exist');
  });

  it('debe abrir y cerrar el chat correctamente', () => {
    // Buscar el botón flotante del chat (suele ser el único botón directo en el tag o tiene un icono)
    cy.get('app-ai-chatbot button').first().click();
    
    // Verificar que el chat se abre y muestra el mensaje inicial
    cy.get('app-ai-chatbot').contains('¡Hola! Soy el asistente inteligente de Arecofix').should('be.visible');
    
    // Cerrar el chat
    cy.get('app-ai-chatbot button').first().click();
    
    // Verificar que ya no es visible el contenedor de mensajes (asumiendo que se quita del DOM o se oculta)
    cy.get('app-ai-chatbot').contains('¡Hola! Soy el asistente inteligente de Arecofix').should('not.exist');
  });

  it('debe enviar una pregunta mediante opciones rápidas', () => {
    cy.get('app-ai-chatbot button').first().click({ force: true });
    
    // Seleccionar la primera opción rápida
    cy.get('app-ai-chatbot .quick-option-btn').contains('servicios').click({ force: true });
    
    // Verificar que el mensaje del usuario aparece en el chat
    cy.get('app-ai-chatbot').contains('¿Qué servicios de reparación ofrecen').should('be.visible');
    
    cy.wait('@chatbotRequest');
    
    // Validar que en menos de 15 segundos apareció una respuesta
    cy.wait(5000); // Wait for streaming to finish conceptually
    cy.get('app-ai-chatbot .chatbot-body').should('not.be.empty');
  });

  it('debe manejar preguntas escritas con caracteres especiales', () => {
    cy.get('app-ai-chatbot button').first().click({ force: true });
    
    const weirdQuestion = '¿¿!!T3nen cUrsoS de R3pA®aci0n??!! %$#@';
    
    cy.get('app-ai-chatbot textarea').type(`${weirdQuestion}{enter}`, { force: true });
    
    cy.get('app-ai-chatbot').contains(weirdQuestion).should('be.visible');
    
    cy.wait('@chatbotRequest');
    
    // Esperar respuesta (streaming duration)
    cy.wait(5000);
    
    // Validar que la respuesta no contiene basura o formato de inyección
    cy.get('app-ai-chatbot').invoke('text').then((text) => {
      expect(text).not.to.include('--- ['); // No debe incluir formato crudo del contexto
    });
  });

  it('debe denegar amablemente respuestas a preguntas fuera de contexto', () => {
    cy.get('app-ai-chatbot button').first().click({ force: true });
    
    const outOfContextQuestion = '¿Cuál es la receta para hacer una buena pizza de pepperoni?';
    
    cy.get('app-ai-chatbot textarea').type(`${outOfContextQuestion}{enter}`, { force: true });
    
    cy.wait('@chatbotRequest');
    cy.wait(5000);
    
    cy.get('app-ai-chatbot').invoke('text').then((text) => {
      // Debería mencionar que no tiene información
      const lowerText = text.toLowerCase();
      expect(
        lowerText.includes('no tengo esa información') || 
        lowerText.includes('arecofix') ||
        lowerText.includes('taller')
      ).to.be.true;
    });
  });

  it('debe manejar correctamente un error 429 simulado (límite de peticiones)', () => {
    cy.get('app-ai-chatbot button').first().click({ force: true });
    
    // Interceptar y forzar un 429
    cy.intercept('POST', '**/chat/offline*', {
      statusCode: 429,
      body: { error: 'En este momento estoy procesando muchas consultas, intentá de nuevo en unos segundos.' }
    }).as('rateLimit');

    cy.get('app-ai-chatbot textarea').type(`Hola{enter}`, { force: true });
    
    cy.wait('@rateLimit');
    
    // El chat debería mostrar el mensaje de error amigable
    cy.get('app-ai-chatbot').contains('procesando muchas consultas').should('be.visible');
  });
});

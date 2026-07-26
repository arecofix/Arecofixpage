describe('Icon Rendering Layout Integrity', () => {
  it('should ensure WhatsApp icon is strictly contained within the Chat button on Tracking Page', () => {
    cy.visit('/tracking/AF-120');

    cy.wait(1500); 

    cy.get('#btn-chat-whatsapp').then($btn => {
      const btnRect = $btn[0].getBoundingClientRect();

      cy.get('#btn-chat-whatsapp i.fa-whatsapp').then($icon => {
        const iconRect = $icon[0].getBoundingClientRect();

        const iconCenterX = iconRect.left + (iconRect.width / 2);
        const iconCenterY = iconRect.top + (iconRect.height / 2);

        expect(iconCenterX).to.be.greaterThan(btnRect.left, 'Icon is too far left');
        expect(iconCenterX).to.be.lessThan(btnRect.right, 'Icon is too far right');
        expect(iconCenterY).to.be.greaterThan(btnRect.top - 2, 'Icon is too high');
        expect(iconCenterY).to.be.lessThan(btnRect.bottom + 2, 'Icon is too low');
      });
    });
  });

  it('should ensure all FontAwesome icons inside buttons on GSM page are contained correctly', () => {
    cy.visit('/gsm');

    cy.wait(1500); 

    cy.get('.btn i.fas, .btn i.fab, .w-12.h-12.flex i').each(($icon, index) => {
      const $btn = $icon.closest('.btn, .w-12.h-12.flex');
      
      expect($btn.length).to.be.greaterThan(0);

      const btnRect = $btn[0].getBoundingClientRect();
      const iconRect = $icon[0].getBoundingClientRect();

      const iconCenterX = iconRect.left + (iconRect.width / 2);
      const iconCenterY = iconRect.top + (iconRect.height / 2);

      expect(iconCenterX).to.be.greaterThan(btnRect.left - 5, `Icon ${index} X out of bounds`);
      expect(iconCenterX).to.be.lessThan(btnRect.right + 5, `Icon ${index} X out of bounds`);
      expect(iconCenterY).to.be.greaterThan(btnRect.top - 5, `Icon ${index} Y out of bounds`);
      expect(iconCenterY).to.be.lessThan(btnRect.bottom + 5, `Icon ${index} Y out of bounds`);
    });
  });
});



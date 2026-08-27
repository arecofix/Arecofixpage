describe('Blog Flow', () => {
  it('should load the blog page successfully', () => {
    cy.visit('/blog');
    cy.get('app-blog').should('exist');
  });
});


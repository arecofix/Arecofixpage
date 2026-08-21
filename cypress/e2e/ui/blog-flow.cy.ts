describe('Blog Flow', () => {
  it('should allow user to submit a pending blog post', () => {
    // Visit blog page
    cy.visit('/blog');
    
    // Attempt to create post, if not logged in it will prompt or redirect
    cy.get('a[href=\
/blog/create\]').click();
  });
});


describe('Liste publique des inscrits', () => {
  it('affiche les inscrits avec les informations réduites uniquement', () => {
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{ id: 1, lastName: 'Dupont', firstName: 'Jean', city: 'Paris' }],
    }).as('getUsers');

    cy.visit('/');
    cy.wait('@getUsers');

    cy.get('[data-testid="user-list"]').should('contain', 'Dupont').and('contain', 'Paris');
    cy.get('[data-testid="user-list"]').should('not.contain', '@'); // pas d'email visible
  });

  it('affiche un message si aucun inscrit', () => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: [] }).as('getUsers');
    cy.visit('/');
    cy.wait('@getUsers');
    cy.contains('Aucun inscrit');
  });
});
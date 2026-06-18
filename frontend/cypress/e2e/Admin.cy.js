describe('Espace administrateur', () => {
  it('affiche le formulaire de connexion sur /admin', () => {
    cy.visit('/admin');
    cy.contains('h1', 'Administration');
    cy.contains('Connexion administrateur');
  });

  it('refuse la connexion avec des identifiants invalides', () => {
    cy.intercept('POST', '**/admin/login', {
      statusCode: 401,
      body: { detail: 'Identifiants invalides' },
    }).as('loginFail');

    cy.visit('/admin');
    cy.get('#admin-email').type('admin@test.com');
    cy.get('#admin-password').type('mauvais-mdp');
    cy.get('button').contains('Se connecter').click();

    cy.wait('@loginFail');
    cy.contains('Identifiants invalides');
  });

  it('affiche la liste complète après connexion et permet la suppression', () => {
    cy.intercept('POST', '**/admin/login', {
      statusCode: 200,
      body: { access_token: 'fake-token', token_type: 'bearer' },
    }).as('login');

    cy.intercept('GET', '**/admin/users', {
      statusCode: 200,
      body: [
        {
          id: 1,
          lastName: 'Dupont',
          firstName: 'Jean',
          email: 'jean@test.com',
          birthDate: '1990-01-01',
          city: 'Paris',
          postalCode: '75000',
        },
      ],
    }).as('getAdminUsers');

    cy.intercept('DELETE', '**/admin/users/1', { statusCode: 200 }).as('deleteUser');

    cy.visit('/admin');
    cy.get('#admin-email').type('loise.fenoll@ynov.com');
    cy.get('#admin-password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains('Se connecter').click();

    cy.wait('@login');
    cy.wait('@getAdminUsers');

    cy.get('[data-testid="admin-user-list"]').should('contain', 'jean@test.com');

    cy.get('button').contains('Supprimer').click();
    cy.wait('@deleteUser');
    cy.contains('jean@test.com').should('not.exist');
    cy.contains('Aucun inscrit pour le moment.');
  });

  it('se déconnecte et revient au formulaire de connexion', () => {
    cy.intercept('POST', '**/admin/login', {
      statusCode: 200,
      body: { access_token: 'fake-token' },
    }).as('login');
    cy.intercept('GET', '**/admin/users', { statusCode: 200, body: [] }).as('getAdminUsers');

    cy.visit('/admin');
    cy.get('#admin-email').type('loise.fenoll@ynov.com');
    cy.get('#admin-password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('button').contains('Se connecter').click();

    cy.wait('@login');
    cy.wait('@getAdminUsers');

    cy.get('button').contains('Déconnexion').click();
    cy.contains('Connexion administrateur');
  });
});
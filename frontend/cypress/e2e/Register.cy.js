describe('Formulaire d\'inscription', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/users', { statusCode: 200, body: [] }).as('getUsers');
    cy.visit('/');
    cy.wait('@getUsers');
  });

  it('affiche le formulaire et le bouton désactivé par défaut', () => {
    cy.contains('h1', 'Inscription');
    cy.get('button').contains('Sauvegarder').should('be.disabled');
  });

  it('inscrit un utilisateur avec succès', () => {
    cy.intercept('POST', '**/register', {
      statusCode: 200,
      body: { status: 'success', message: 'Utilisateur enregistré' },
    }).as('registerUser');

    cy.get('#lastName').type('Dupont');
    cy.get('#firstName').type('Jean');
    cy.get('#email').type('jean.dupont@test.com');
    cy.get('#birthDate').type('1990-01-01');
    cy.get('#city').type('Paris');
    cy.get('#postalCode').type('75000');

    cy.get('button').contains('Sauvegarder').should('not.be.disabled').click();

    cy.wait('@registerUser');
    cy.get('[data-testid="toast"]').should('contain', 'Enregistrement réussi');
    cy.get('#lastName').should('have.value', '');
  });

  it('affiche une erreur de validation sur un code postal invalide', () => {
    cy.get('#lastName').type('Dupont');
    cy.get('#firstName').type('Jean');
    cy.get('#email').type('jean.dupont@test.com');
    cy.get('#birthDate').type('1990-01-01');
    cy.get('#city').type('Paris');
    cy.get('#postalCode').type('AAAA');

    cy.get('button').contains('Sauvegarder').click();
    cy.contains('Code postal invalide');
  });

  it('affiche un message d\'erreur si le backend échoue', () => {
    cy.intercept('POST', '**/register', { statusCode: 500, body: { detail: 'Erreur serveur' } }).as(
      'registerFail'
    );

    cy.get('#lastName').type('Dupont');
    cy.get('#firstName').type('Jean');
    cy.get('#email').type('jean.dupont@test.com');
    cy.get('#birthDate').type('1990-01-01');
    cy.get('#city').type('Paris');
    cy.get('#postalCode').type('75000');

    cy.get('button').contains('Sauvegarder').click();
    cy.wait('@registerFail');
    cy.get('[data-testid="toast"]').should('contain', 'Erreur serveur');
  });
});
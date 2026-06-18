describe('Inscription en ligne et hors ligne', () => {
    beforeEach(() => {
        cy.visit('/');

        cy.get('#lastName').type('Dupont');
        cy.get('#firstName').type('Jean');
        cy.get('#email').type('jean.dupont@test.com');
        cy.get('#birthDate').type('1990-01-01');
        cy.get('#city').type('Paris');
        cy.get('#postalCode').type('75000');
    });

    it('devrait enregistrer l\'inscription correctement en ligne', function () {
        if (Cypress.env('offline')) {
            this.skip();
        }

        cy.intercept('POST', '**/register', {
            statusCode: 200,
            body: { status: 'success', message: 'Utilisateur enregistré' },
        }).as('registerRequest');

        cy.get('button').contains('Sauvegarder').click();

        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.statusCode).to.equal(200);
        });

        cy.get('[data-testid="toast"]').should('contain', 'Enregistrement réussi');
    });

    it('devrait afficher un message d\'erreur quand le réseau est coupé', function () {
        if (!Cypress.env('offline')) {
            this.skip(); // Évite un faux positif en mode online
        }

        cy.log('Mode offline activé !');

        cy.intercept('POST', '**/register', { forceNetworkError: true }).as('registerRequest');

        cy.get('button').contains('Sauvegarder').click();

        cy.wait('@registerRequest');
        cy.get('[data-testid="toast"]').should('contain', "Échec de l'enregistrement");
    });
});
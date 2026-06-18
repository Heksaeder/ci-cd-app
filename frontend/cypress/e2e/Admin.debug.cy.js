describe('Debug isolé', () => {
    it('vérifie chaque interception individuellement', () => {
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

        cy.visit('/admin');
        cy.get('#admin-email').type('loise.fenoll@ynov.com');
        cy.get('#admin-password').type('PvdrTAzTeR247sDnAZBr');
        cy.get('button').contains('Se connecter').click();

        cy.wait('@getAdminUsers');
        cy.wait('@getAdminUsers');
        cy.wait(1500);

        cy.get('@getAdminUsers.all').then((interceptions) => {
            const summary = interceptions.map((i, idx) => ({
                index: idx,
                status: i.response ? i.response.statusCode : 'NO RESPONSE',
                bodyLength: i.response && i.response.body ? i.response.body.length : 'N/A',
            }));
            throw new Error('TOUTES LES INTERCEPTIONS: ' + JSON.stringify(summary));
        });
    });
});
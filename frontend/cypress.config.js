const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000/ci-cd-app',
        supportFile: 'cypress/support/e2e.js',
    },
});
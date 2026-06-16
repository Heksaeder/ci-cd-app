const fs = require('fs');
const path = require('path');

function removeTestFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            removeTestFiles(fullPath);
        } else if (entry.name.endsWith('.test.js') || entry.name === 'setupTests.js') {
            fs.unlinkSync(fullPath);
        }
    }
}

removeTestFiles(path.join(__dirname, '..', 'dist'));
console.log('Fichiers de test supprimés de dist/');
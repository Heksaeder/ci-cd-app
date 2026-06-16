# Inscription Form - CI/CD Ynov

Application React permettant à un utilisateur de s'enregistrer via un formulaire avec validation complète des champs (nom, prénom, email, date de naissance, ville, code postal).

## Prérequis

- Node.js 20.x ou supérieur
- npm

## Installation

```bash
git clone https://github.com/heksaeder/ci-cd-ynov.git
cd ci-cd-ynov
npm install
```

## Lancer l'application

```bash
npm start
```

Ouvre [http://localhost:3000](http://localhost:3000) dans le navigateur.

## Lancer les tests

```bash
npm test
```

Génère un rapport de couverture (100% attendu sur les composants et utils, hors `index.js` et `reportWebVitals.js`).

## Règles de validation

- **Nom / Prénom / Ville** : lettres, accents, tirets et apostrophes acceptés ; chiffres et caractères spéciaux refusés.
- **Email** : format standard `xxx@xxx.xxx`.
- **Date de naissance** : l'utilisateur doit avoir 18 ans ou plus.
- **Code postal** : format français (5 chiffres).

## Documentation

La documentation technique (jsdoc) est générée dans `public/docs` et accessible depuis l'application via le lien "Documentation" en bas de page.

## Liens

- [Démo en ligne](https://heksaeder.github.io/ci-cd-ynov)
- [Package npm](https://www.npmjs.com/package/ci-cd-ynov-ckurtaran)
- [Rapport de couverture Codecov](https://app.codecov.io/gh/heksaeder/ci-cd-ynov)

## Test de versioning
Juste pour voir si rien ne change.
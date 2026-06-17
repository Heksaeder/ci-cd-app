# ci-cd-ynov

Application React d'inscription, avec un backend FastAPI et une base MySQL, conteneurisés avec Docker pour le développement local. Le frontend est déployé sur GitHub Pages et publié comme package npm.

## Stack

- **Frontend** : React (Create React App)
- **Backend** : Python / FastAPI
- **Base de données** : MySQL 9.7
- **Conteneurisation** : Docker, Docker Compose
- **CI/CD** : GitHub Actions (build, tests, build Docker, déploiement GitHub Pages, publication npm)

## Prérequis

- [Node.js](https://nodejs.org/) 20.x
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Installation

```bash
git clone https://github.com/Heksaeder/ci-cd-app.git
cd ci-cd-app
npm install
```

Crée un fichier `.env` à la racine (non versionné) à partir de l'exemple :

```bash
cp .env.example .env
```

Et un `.env.local` pour le frontend :

```
REACT_APP_API_URL=http://localhost:8000
```

## Lancer le projet en local

### Avec Docker (recommandé)

Démarre la base de données, le backend et le frontend en une commande :

```bash
docker compose up --build
```

Services disponibles :

| Service  | URL                          | Description                  |
|----------|-------------------------------|-------------------------------|
| Frontend | http://localhost:3000         | Application React (hot-reload) |
| Backend  | http://localhost:8000         | API FastAPI                   |
| Backend docs | http://localhost:8000/docs | Documentation interactive Swagger |
| Adminer  | http://localhost:8080         | Client SQL pour MySQL         |
| MySQL    | localhost:3306                | Base de données               |

Pour arrêter sans perdre les données :

```bash
docker compose down
```

Pour tout réinitialiser (supprime aussi les données de la base) :

```bash
docker compose down -v
```

### Sans Docker (frontend seul)

```bash
npm start
```

Nécessite que le backend tourne par ailleurs (via Docker ou manuellement) pour que le formulaire d'inscription fonctionne.

## Tests

```bash
npm test
```

Le projet impose une couverture de tests de 100% (statements, branches, functions, lines), vérifiée automatiquement en CI.

## Documentation technique (JSDoc)

```bash
npm run jsdoc
```

Génère la documentation à partir des commentaires JSDoc du code dans `public/docs`, accessible ensuite via le lien "Documentation" en bas de l'application.

## Structure du projet

```
ci-cd-app/
├── .github/workflows/main.yml   # Pipeline CI/CD
├── public/                      # Assets statiques CRA
├── src/
│   ├── components/               # Composants React (RegisterForm, Toast)
│   └── utils/                    # Fonctions de validation
├── server/                      # Backend FastAPI
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── sqlfiles/                    # Scripts d'initialisation MySQL
├── Dockerfile                   # Image du frontend (dev, hot-reload)
├── docker-compose.yml
└── package.json
```

## CI/CD

Le pipeline GitHub Actions (`.github/workflows/main.yml`) exécute, à chaque push/PR sur `master` :

- **build_test** : installation, génération JSDoc, build, tests avec couverture, upload Codecov, déploiement de l'artefact pour GitHub Pages.
- **docker_build** : validation de la configuration Docker Compose et build de toutes les images, pour détecter les erreurs d'infrastructure sans démarrer de containers.
- **deploy** : déploiement du frontend sur GitHub Pages (uniquement sur push vers `master`).
- **publish_npm** : publication du package npm si le numéro de version dans `package.json` diffère de la version déjà publiée.

## Versionnage

Le projet suit le [versionnage sémantique](https://semver.org/lang/fr/) (`MAJOR.MINOR.PATCH`). Tant que la version reste en `0.x.y`, le chiffre `MINOR` joue le rôle de palier principal :

- **PATCH** : correction de bug, sans changement de fonctionnalité.
- **MINOR** : ajout de fonctionnalité, rétrocompatible.
- **MAJOR** (à partir de `1.0.0`) : changement cassant pour les utilisateurs.

## Licence

À compléter selon le choix du projet.
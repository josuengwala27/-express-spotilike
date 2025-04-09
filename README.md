# Spotilike

Spotilike est un clone de Spotify développé avec Node.js, Express, MySQL et React. Cette application permet de gérer des albums, des artistes, des genres et des chansons, avec une authentification utilisateur sécurisée.

## Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
  - [Cloner le dépôt](#cloner-le-dépôt)
  - [Configuration de la base de données](#configuration-de-la-base-de-données)
  - [Configuration du backend](#configuration-du-backend)
  - [Configuration du frontend](#configuration-du-frontend)
- [Lancement de l'application](#lancement-de-lapplication)
- [Structure du projet](#structure-du-projet)
- [Documentation API](#documentation-api)
- [Auteurs](#auteurs)

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :

- [Node.js](https://nodejs.org/) (v14 ou supérieur)
- [XAMPP](https://www.apachefriends.org/) (pour MySQL)
- [Git](https://git-scm.com/)

## Installation

### Cloner le dépôt

```bash
git clone https://github.com/josuengwala27/-express-spotilike.git
cd spotilike
```

### Configuration de la base de données

1. **Installer et démarrer XAMPP** :
   - Téléchargez et installez [XAMPP](https://www.apachefriends.org/)
   - Lancez XAMPP et démarrez les services Apache et MySQL

2. **Créer la base de données** :
   - Ouvrez votre navigateur et accédez à [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
   - Connectez-vous avec les identifiants par défaut (utilisateur: `root`, mot de passe: vide)
   - Cliquez sur "Nouvelle base de données" et créez une base de données nommée `spotilike`
   - Sélectionnez la base de données `spotilike` et cliquez sur l'onglet "Importer"
   - Cliquez sur "Choisir un fichier" et sélectionnez le fichier `backend/models/schema.sql`
   - Cliquez sur "Exécuter" pour créer les tables

3. **Importer les données de test** :
   - Toujours dans phpMyAdmin, sélectionnez la base de données `spotilike`
   - Cliquez sur l'onglet "Importer"
   - Cliquez sur "Choisir un fichier" et sélectionnez le fichier `backend/models/seeders.sql`
   - Cliquez sur "Exécuter" pour importer les données de test

### Configuration du backend

1. **Installer les dépendances** :
   ```bash
   cd backend
   npm install
   ```

2. **Configurer les variables d'environnement** :
   - Copiez le fichier `.env.example` vers un nouveau fichier `.env` :
     ```bash
     cp .env.example .env
     ```
   - Modifiez le fichier `.env` avec vos paramètres :
     ```
     PORT=5000
     NODE_ENV=development
     JWT_SECRET=votre_secret_jwt
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=spotilike
     ```

3. **Vérifier la connexion à la base de données** :
   - Assurez-vous que les paramètres de connexion dans le fichier `.env` correspondent à votre configuration MySQL
   - Si vous avez modifié le mot de passe par défaut de MySQL, mettez à jour `DB_PASSWORD` dans le fichier `.env`

### Configuration du frontend

1. **Installer les dépendances** :
   ```bash
   cd ../frontend
   npm install
   ```

## Lancement de l'application

### Démarrer le backend

```bash
cd backend
npm run dev
```

Le serveur backend démarrera sur [http://localhost:5000](http://localhost:5000).

### Démarrer le frontend

Dans un nouveau terminal :

```bash
cd frontend
npm run dev
```

L'application frontend sera accessible sur [http://localhost:5173](http://localhost:5173).

## Structure du projet

```
spotilike/
├── backend/
│   ├── config/         # Configuration de la base de données
│   ├── controllers/    # Logique métier
│   ├── middleware/     # Middlewares Express
│   ├── models/         # Schéma de la base de données et seeders
│   ├── routes/         # Routes API
│   ├── utils/          # Fonctions utilitaires
│   ├── .env            # Variables d'environnement (non versionné)
│   ├── .env.example    # Exemple de variables d'environnement
│   ├── package.json    # Dépendances backend
│   └── server.js       # Point d'entrée du serveur
├── frontend/
│   ├── public/         # Fichiers statiques
│   ├── src/            # Code source React
│   │   ├── components/ # Composants réutilisables
│   │   ├── pages/      # Pages de l'application
│   │   ├── context/    # Contextes React
│   │   ├── services/   # Services API
│   │   ├── utils/      # Fonctions utilitaires
│   │   ├── App.js      # Composant principal
│   │   └── index.js    # Point d'entrée React
│   └── package.json    # Dépendances frontend
└── docs/               # Documentation
    ├── api-documentation.md  # Documentation de l'API
    └── postman-collection.json # Collection Postman pour tester l'API
```

## Documentation API

La documentation complète de l'API est disponible dans le fichier [docs/api-documentation.md](docs/api-documentation.md).

Pour tester l'API, vous pouvez utiliser la collection Postman fournie dans [docs/postman-collection.json](docs/postman-collection.json).

## Auteurs

- Jean Josue NGWALA MAYALA
- Anis HAMMICH 
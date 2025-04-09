# Documentation de l'API Spotilike

## Introduction

Spotilike est une API RESTful développée avec Express.js et MySQL, inspirée de Spotify. Elle permet de gérer des albums, artistes, chansons et genres musicaux.

## Base URL

```
http://localhost:5000/api
```

## Authentification

L'API utilise l'authentification JWT (JSON Web Token). Pour les routes protégées, incluez le token dans le header :

```
Authorization: Bearer <votre_token>
```

## Endpoints

### Authentification

#### Inscription
- **POST** `/users/signup`
- **Corps de la requête** :
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Réponse** : Token JWT et informations utilisateur

#### Connexion
- **POST** `/users/login`
- **Corps de la requête** :
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Réponse** : Token JWT et informations utilisateur

### Albums

#### Récupérer tous les albums
- **GET** `/albums`
- **Réponse** : Liste des albums avec leurs informations

#### Récupérer un album spécifique
- **GET** `/albums/:id`
- **Réponse** : Détails de l'album

#### Récupérer les chansons d'un album
- **GET** `/albums/:id/songs`
- **Réponse** : Liste des chansons de l'album

#### Créer un album
- **POST** `/albums`
- **Corps de la requête** :
  ```json
  {
    "titre": "string",
    "pochette": "string (URL)",
    "date_sortie": "YYYY-MM-DD",
    "artiste_id": "number"
  }
  ```

#### Modifier un album
- **PUT** `/albums/:id`
- **Corps de la requête** :
  ```json
  {
    "titre": "string",
    "pochette": "string (URL)",
    "date_sortie": "YYYY-MM-DD",
    "artiste_id": "number"
  }
  ```

#### Supprimer un album
- **DELETE** `/albums/:id`
- **Authentification requise**

### Artistes

#### Récupérer tous les artistes
- **GET** `/artists`
- **Réponse** : Liste des artistes

#### Récupérer un artiste spécifique
- **GET** `/artists/:id`
- **Réponse** : Détails de l'artiste

#### Récupérer les chansons d'un artiste
- **GET** `/artists/:id/songs`
- **Réponse** : Liste des chansons de l'artiste

#### Récupérer les albums d'un artiste
- **GET** `/artists/:id/albums`
- **Réponse** : Liste des albums de l'artiste

#### Modifier un artiste
- **PUT** `/artists/:id`
- **Corps de la requête** :
  ```json
  {
    "nom": "string",
    "avatar": "string (URL)",
    "biographie": "string"
  }
  ```

#### Supprimer un artiste
- **DELETE** `/artists/:id`
- **Authentification requise**

### Genres

#### Récupérer tous les genres
- **GET** `/genres`
- **Réponse** : Liste des genres

#### Modifier un genre
- **PUT** `/genres/:id`
- **Corps de la requête** :
  ```json
  {
    "titre": "string",
    "description": "string"
  }
  ```

### Chansons

#### Récupérer toutes les chansons
- **GET** `/songs`
- **Réponse** : Liste des chansons

#### Ajouter une chanson
- **POST** `/songs`
- **Corps de la requête** :
  ```json
  {
    "titre": "string",
    "duree": "number",
    "artiste_id": "number",
    "album_id": "number",
    "genres": ["number"]
  }
  ```

#### Modifier une chanson
- **PUT** `/songs/:id`
- **Corps de la requête** :
  ```json
  {
    "titre": "string",
    "duree": "number",
    "artiste_id": "number",
    "album_id": "number",
    "genres": ["number"]
  }
  ```

#### Supprimer une chanson
- **DELETE** `/songs/:id`
- **Authentification requise**

## Codes d'erreur HTTP

- `200` : Succès
- `201` : Ressource créée
- `400` : Requête invalide
- `401` : Non autorisé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## Collection Postman

Une collection Postman est disponible dans le fichier `docs/postman-collection.json` pour tester l'API. 
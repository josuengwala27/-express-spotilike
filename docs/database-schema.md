# Schéma de la base de données Spotilike

Ce document décrit la structure de la base de données MySQL utilisée pour l'application Spotilike.

## Diagramme ERD

```
+-------------+       +-------------+       +-------------+
|   ALBUM     |       |   MORCEAU   |       |   ARTISTE   |
+-------------+       +-------------+       +-------------+
| id          |<----->| id          |       | id          |
| titre       |       | titre       |<----->| nom         |
| pochette    |       | durée       |       | avatar      |
| date_sortie |       | artiste_id  |       | biographie  |
| artiste_id  |       | album_id    |       +-------------+
+-------------+       +-------------+
                            |
                            |
                            v
+-------------+       +-------------+
|   GENRE     |<----->| MORCEAU_GENRE|
+-------------+       +-------------+
| id          |       | morceau_id  |
| titre       |       | genre_id    |
| description |       +-------------+
+-------------+

+-------------+
| UTILISATEUR |
+-------------+
| id          |
| username    |
| password    |
| email       |
| role        |
+-------------+
```

## Tables

### ALBUM
| Champ       | Type         | Description                    | Contraintes           |
|-------------|--------------|--------------------------------|----------------------|
| id          | INT          | Identifiant unique de l'album  | PRIMARY KEY, AUTO_INCREMENT |
| titre       | VARCHAR(255) | Titre de l'album               | NOT NULL             |
| pochette    | VARCHAR(255) | URL de l'image de pochette     | NULL                 |
| date_sortie | DATE         | Date de sortie de l'album      | NULL                 |
| artiste_id  | INT          | ID de l'artiste                | FOREIGN KEY (ARTISTE) |

### MORCEAU
| Champ       | Type         | Description                    | Contraintes           |
|-------------|--------------|--------------------------------|----------------------|
| id          | INT          | Identifiant unique du morceau  | PRIMARY KEY, AUTO_INCREMENT |
| titre       | VARCHAR(255) | Titre du morceau               | NOT NULL             |
| durée       | INT          | Durée en secondes              | NOT NULL             |
| artiste_id  | INT          | ID de l'artiste                | FOREIGN KEY (ARTISTE) |
| album_id    | INT          | ID de l'album                  | FOREIGN KEY (ALBUM)   |

### ARTISTE
| Champ       | Type         | Description                    | Contraintes           |
|-------------|--------------|--------------------------------|----------------------|
| id          | INT          | Identifiant unique de l'artiste| PRIMARY KEY, AUTO_INCREMENT |
| nom         | VARCHAR(255) | Nom de l'artiste               | NOT NULL             |
| avatar      | VARCHAR(255) | URL de l'image de l'artiste    | NULL                 |
| biographie  | TEXT         | Biographie de l'artiste        | NULL                 |

### GENRE
| Champ       | Type         | Description                    | Contraintes           |
|-------------|--------------|--------------------------------|----------------------|
| id          | INT          | Identifiant unique du genre    | PRIMARY KEY, AUTO_INCREMENT |
| titre       | VARCHAR(255) | Nom du genre                   | NOT NULL             |
| description | TEXT         | Description du genre            | NULL                 |

### UTILISATEUR
| Champ       | Type                  | Description                    | Contraintes                 |
|-------------|-----------------------|--------------------------------|-----------------------------|
| id          | INT                   | Identifiant unique de l'utilisateur | PRIMARY KEY, AUTO_INCREMENT |
| username    | VARCHAR(255)          | Nom d'utilisateur              | NOT NULL, UNIQUE            |
| password    | VARCHAR(255)          | Mot de passe hashé             | NOT NULL                    |
| email       | VARCHAR(255)          | Adresse email                  | NOT NULL, UNIQUE            |
| role        | ENUM('user', 'admin') | Rôle de l'utilisateur          | DEFAULT 'user'              |

### MORCEAU_GENRE (Table de liaison)
| Champ       | Type         | Description                    | Contraintes           |
|-------------|--------------|--------------------------------|----------------------|
| morceau_id  | INT          | ID du morceau                  | PRIMARY KEY, FOREIGN KEY (MORCEAU) |
| genre_id    | INT          | ID du genre                    | PRIMARY KEY, FOREIGN KEY (GENRE)   |

## Relations

- Un **Album** appartient à un **Artiste** (relation 1:N)
- Un **Morceau** appartient à un **Album** (relation 1:N)
- Un **Morceau** appartient à un **Artiste** (relation 1:N)
- Un **Morceau** peut avoir plusieurs **Genres** (relation N:N via MORCEAU_GENRE)
- Un **Genre** peut être associé à plusieurs **Morceaux** (relation N:N via MORCEAU_GENRE)

## Scripts SQL

Les scripts SQL pour créer la base de données et insérer des données de test sont fournis dans les fichiers :

- `create-tables.sql` : Création des tables
- `seed-data.sql` : Insertion de données de test 
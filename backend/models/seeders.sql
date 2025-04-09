-- Utilisation de la base de données
USE spotilike;

-- Insertion des utilisateurs (mot de passe: password123)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@spotilike.com', '$2a$10$X7UrE2JqJqXqXqXqXqXqXeXqXqXqXqXqXqXqXqXqXqXqXqXqXqX', 'admin'),
('user1', 'user1@spotilike.com', '$2a$10$X7UrE2JqJqXqXqXqXqXqXeXqXqXqXqXqXqXqXqXqXqXqXqXqXqX', 'user');

-- Insertion des artistes
INSERT INTO artists (nom, avatar, biographie) VALUES
('Ed Sheeran', 'https://upload.wikimedia.org/wikipedia/commons/4/45/Ed_Sheeran_2018.jpg', 'Edward Christopher Sheeran MBE est un auteur-compositeur-interprète et guitariste britannique.'),
('Adele', 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Adele_2016.jpg', 'Adele Laurie Blue Adkins est une auteure-compositrice-interprète britannique.'),
('The Weeknd', 'https://upload.wikimedia.org/wikipedia/commons/f/f4/The_Weeknd_2021.jpg', 'Abel Makkonen Tesfaye, connu sous le nom de scène The Weeknd, est un auteur-compositeur-interprète canadien.'),
('Taylor Swift', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Taylor_Swift_2_-_2019_by_Glenn_Francis.jpg', 'Taylor Alison Swift est une auteure-compositrice-interprète américaine.'),
('Drake', 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQLNbKDxF3yijWziz421m1Hpg6rbq2Mtf6j_Hx21fL6y2UNSnBog2umugkepjf6y871K1OVof0ovmZm7PqSfISMnw', 'Aubrey Drake Graham est un rappeur, chanteur, acteur et entrepreneur canadien.');


-- Insertion des albums
INSERT INTO albums (titre, pochette, date_sortie, artiste_id) VALUES
('÷ (Divide)', 'https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png', '2017-03-03', 1),
('25', 'https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_25_%28Official_Album_Cover%29.png', '2015-11-20', 2),
('After Hours', 'https://upload.wikimedia.org/wikipedia/en/5/5e/The_Weeknd_-_After_Hours.png', '2020-03-20', 3),
('Folklore', 'https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png', '2020-07-24', 4),
('Scorpion', 'https://upload.wikimedia.org/wikipedia/en/9/90/Scorpion_by_Drake.jpg', '2018-06-29', 5);


-- Insertion des genres
INSERT INTO genres (titre, description) VALUES
('Pop', 'Musique populaire contemporaine'),
('R&B', 'Rhythm and Blues'),
('Hip-Hop', 'Musique urbaine originaire des États-Unis'),
('Rock', 'Musique rock et ses sous-genres'),
('Folk', 'Musique folklorique et acoustique');

-- Insertion des morceaux
INSERT INTO songs (titre, duree, artiste_id, album_id) VALUES
('Shape of You', 235, 1, 1),
('Castle on the Hill', 261, 1, 1),
('Hello', 295, 2, 2),
('When We Were Young', 293, 2, 2),
('Blinding Lights', 200, 3, 3),
('In Your Eyes', 237, 3, 3),
('Cardigan', 239, 4, 4),
('Exile', 285, 4, 4),
('God''s Plan', 198, 5, 5),
('In My Feelings', 218, 5, 5);

-- Insertion des relations morceaux-genres
INSERT INTO song_genre (song_id, genre_id) VALUES
(1, 1), -- Shape of You - Pop
(2, 1), -- Castle on the Hill - Pop
(3, 1), -- Hello - Pop
(4, 1), -- When We Were Young - Pop
(5, 1), -- Blinding Lights - Pop
(5, 2), -- Blinding Lights - R&B
(6, 2), -- In Your Eyes - R&B
(7, 1), -- Cardigan - Pop
(7, 5), -- Cardigan - Folk
(8, 5), -- Exile - Folk
(9, 2), -- God's Plan - R&B
(9, 3), -- God's Plan - Hip-Hop
(10, 2), -- In My Feelings - R&B
(10, 3); -- In My Feelings - Hip-Hop 
const asyncHandler = require('express-async-handler');
const { query, queryOne, insert, update, remove } = require('../config/db');

// @desc    Récupérer tous les morceaux
// @route   GET /api/songs
// @access  Public
const getSongs = asyncHandler(async (req, res) => {
  const songs = await query(
    `SELECT s.*, a.nom as artiste_nom, al.titre as album_titre 
     FROM songs s 
     JOIN artists a ON s.artiste_id = a.id 
     LEFT JOIN albums al ON s.album_id = al.id 
     ORDER BY s.titre`
  );

  // Récupérer les genres pour chaque morceau
  for (let song of songs) {
    const genres = await query(
      `SELECT g.* 
       FROM genres g 
       JOIN song_genre sg ON g.id = sg.genre_id 
       WHERE sg.song_id = ?`,
      [song.id]
    );
    song.genres = genres;
  }

  res.json(songs);
});

// @desc    Récupérer un morceau par ID
// @route   GET /api/songs/:id
// @access  Public
const getSongById = asyncHandler(async (req, res) => {
  const song = await queryOne(
    `SELECT s.*, a.nom as artiste_nom, al.titre as album_titre 
     FROM songs s 
     JOIN artists a ON s.artiste_id = a.id 
     LEFT JOIN albums al ON s.album_id = al.id 
     WHERE s.id = ?`,
    [req.params.id]
  );

  if (song) {
    // Récupérer les genres du morceau
    const genres = await query(
      `SELECT g.* 
       FROM genres g 
       JOIN song_genre sg ON g.id = sg.genre_id 
       WHERE sg.song_id = ?`,
      [song.id]
    );
    song.genres = genres;
    
    res.json(song);
  } else {
    res.status(404);
    throw new Error('Morceau non trouvé');
  }
});

// @desc    Créer un nouveau morceau
// @route   POST /api/songs
// @access  Private
const createSong = asyncHandler(async (req, res) => {
  const { titre, duree, artiste_id, album_id, genres } = req.body;

  // Vérification des champs requis
  if (!titre || !duree || !artiste_id) {
    res.status(400);
    throw new Error('Veuillez fournir un titre, une durée et un artiste');
  }

  // Vérification si l'artiste existe
  const artist = await queryOne(
    'SELECT * FROM artists WHERE id = ?',
    [artiste_id]
  );

  if (!artist) {
    res.status(404);
    throw new Error('Artiste non trouvé');
  }

  // Vérification si l'album existe (si spécifié)
  if (album_id) {
    const album = await queryOne(
      'SELECT * FROM albums WHERE id = ?',
      [album_id]
    );

    if (!album) {
      res.status(404);
      throw new Error('Album non trouvé');
    }
  }

  // Création du morceau
  const songId = await insert(
    'INSERT INTO songs (titre, duree, artiste_id, album_id) VALUES (?, ?, ?, ?)',
    [titre, duree, artiste_id, album_id || null]
  );

  // Ajout des genres au morceau
  if (genres && Array.isArray(genres) && genres.length > 0) {
    for (const genreId of genres) {
      // Vérification si le genre existe
      const genre = await queryOne(
        'SELECT * FROM genres WHERE id = ?',
        [genreId]
      );

      if (genre) {
        await insert(
          'INSERT INTO song_genre (song_id, genre_id) VALUES (?, ?)',
          [songId, genreId]
        );
      }
    }
  }

  // Récupération du morceau créé avec ses genres
  const song = await queryOne(
    `SELECT s.*, a.nom as artiste_nom, al.titre as album_titre 
     FROM songs s 
     JOIN artists a ON s.artiste_id = a.id 
     LEFT JOIN albums al ON s.album_id = al.id 
     WHERE s.id = ?`,
    [songId]
  );

  if (song) {
    // Récupérer les genres du morceau
    const songGenres = await query(
      `SELECT g.* 
       FROM genres g 
       JOIN song_genre sg ON g.id = sg.genre_id 
       WHERE sg.song_id = ?`,
      [songId]
    );
    song.genres = songGenres;
    
    res.status(201).json(song);
  } else {
    res.status(400);
    throw new Error('Données morceau invalides');
  }
});

// @desc    Mettre à jour un morceau
// @route   PUT /api/songs/:id
// @access  Private
const updateSong = asyncHandler(async (req, res) => {
  const { titre, duree, artiste_id, album_id, genres } = req.body;
  const songId = req.params.id;

  // Vérification si le morceau existe
  const song = await queryOne(
    'SELECT * FROM songs WHERE id = ?',
    [songId]
  );

  if (!song) {
    res.status(404);
    throw new Error('Morceau non trouvé');
  }

  // Si un nouvel artiste est spécifié, vérifier s'il existe
  if (artiste_id) {
    const artist = await queryOne(
      'SELECT * FROM artists WHERE id = ?',
      [artiste_id]
    );

    if (!artist) {
      res.status(404);
      throw new Error('Artiste non trouvé');
    }
  }

  // Si un nouvel album est spécifié, vérifier s'il existe
  if (album_id) {
    const album = await queryOne(
      'SELECT * FROM albums WHERE id = ?',
      [album_id]
    );

    if (!album) {
      res.status(404);
      throw new Error('Album non trouvé');
    }
  }

  // Mise à jour du morceau
  const affectedRows = await update(
    'UPDATE songs SET titre = ?, duree = ?, artiste_id = ?, album_id = ? WHERE id = ?',
    [
      titre || song.titre,
      duree || song.duree,
      artiste_id || song.artiste_id,
      album_id || song.album_id,
      songId
    ]
  );

  if (affectedRows > 0) {
    // Mise à jour des genres si spécifiés
    if (genres && Array.isArray(genres)) {
      // Supprimer les anciennes relations
      await remove(
        'DELETE FROM song_genre WHERE song_id = ?',
        [songId]
      );

      // Ajouter les nouvelles relations
      for (const genreId of genres) {
        // Vérification si le genre existe
        const genre = await queryOne(
          'SELECT * FROM genres WHERE id = ?',
          [genreId]
        );

        if (genre) {
          await insert(
            'INSERT INTO song_genre (song_id, genre_id) VALUES (?, ?)',
            [songId, genreId]
          );
        }
      }
    }

    // Récupération du morceau mis à jour avec ses genres
    const updatedSong = await queryOne(
      `SELECT s.*, a.nom as artiste_nom, al.titre as album_titre 
       FROM songs s 
       JOIN artists a ON s.artiste_id = a.id 
       LEFT JOIN albums al ON s.album_id = al.id 
       WHERE s.id = ?`,
      [songId]
    );

    // Récupérer les genres du morceau
    const songGenres = await query(
      `SELECT g.* 
       FROM genres g 
       JOIN song_genre sg ON g.id = sg.genre_id 
       WHERE sg.song_id = ?`,
      [songId]
    );
    updatedSong.genres = songGenres;

    res.json(updatedSong);
  } else {
    res.status(400);
    throw new Error('Erreur lors de la mise à jour du morceau');
  }
});

// @desc    Supprimer un morceau
// @route   DELETE /api/songs/:id
// @access  Private
const deleteSong = asyncHandler(async (req, res) => {
  const songId = req.params.id;

  // Vérification si le morceau existe
  const song = await queryOne(
    'SELECT * FROM songs WHERE id = ?',
    [songId]
  );

  if (!song) {
    res.status(404);
    throw new Error('Morceau non trouvé');
  }

  // Suppression du morceau (les relations avec les genres seront supprimées en cascade)
  const affectedRows = await remove(
    'DELETE FROM songs WHERE id = ?',
    [songId]
  );

  if (affectedRows > 0) {
    res.json({ message: 'Morceau supprimé avec succès' });
  } else {
    res.status(400);
    throw new Error('Erreur lors de la suppression du morceau');
  }
});

module.exports = {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
}; 
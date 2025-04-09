const asyncHandler = require('express-async-handler');
const { query, queryOne, insert, update, remove } = require('../config/db');

// @desc    Récupérer tous les albums
// @route   GET /api/albums
// @access  Public
const getAlbums = asyncHandler(async (req, res) => {
  const albums = await query(
    'SELECT * FROM albums ORDER BY date_sortie DESC'
  );
  res.json(albums);
});

// @desc    Récupérer un album par ID
// @route   GET /api/albums/:id
// @access  Public
const getAlbumById = asyncHandler(async (req, res) => {
  const album = await queryOne(
    'SELECT * FROM albums WHERE id = ?',
    [req.params.id]
  );

  if (album) {
    res.json(album);
  } else {
    res.status(404);
    throw new Error('Album non trouvé');
  }
});

// @desc    Récupérer les morceaux d'un album
// @route   GET /api/albums/:id/songs
// @access  Public
const getAlbumSongs = asyncHandler(async (req, res) => {
  const songs = await query(
    `SELECT s.*, a.nom as artiste_nom 
     FROM songs s 
     JOIN artists a ON s.artiste_id = a.id 
     WHERE s.album_id = ? 
     ORDER BY s.id`,
    [req.params.id]
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

// @desc    Créer un nouvel album
// @route   POST /api/albums
// @access  Private
const createAlbum = asyncHandler(async (req, res) => {
  const { titre, pochette, date_sortie, artiste_id } = req.body;

  // Vérification des champs requis
  if (!titre || !artiste_id) {
    res.status(400);
    throw new Error('Veuillez fournir un titre et un artiste');
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

  // Création de l'album
  const albumId = await insert(
    'INSERT INTO albums (titre, pochette, date_sortie, artiste_id) VALUES (?, ?, ?, ?)',
    [titre, pochette || null, date_sortie || null, artiste_id]
  );

  // Récupération de l'album créé
  const album = await queryOne(
    'SELECT * FROM albums WHERE id = ?',
    [albumId]
  );

  if (album) {
    res.status(201).json(album);
  } else {
    res.status(400);
    throw new Error('Données album invalides');
  }
});

// @desc    Mettre à jour un album
// @route   PUT /api/albums/:id
// @access  Private
const updateAlbum = asyncHandler(async (req, res) => {
  const { titre, pochette, date_sortie, artiste_id } = req.body;
  const albumId = req.params.id;

  // Vérification si l'album existe
  const album = await queryOne(
    'SELECT * FROM albums WHERE id = ?',
    [albumId]
  );

  if (!album) {
    res.status(404);
    throw new Error('Album non trouvé');
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

  // Mise à jour de l'album
  const affectedRows = await update(
    'UPDATE albums SET titre = ?, pochette = ?, date_sortie = ?, artiste_id = ? WHERE id = ?',
    [
      titre || album.titre,
      pochette || album.pochette,
      date_sortie || album.date_sortie,
      artiste_id || album.artiste_id,
      albumId
    ]
  );

  if (affectedRows > 0) {
    // Récupération de l'album mis à jour
    const updatedAlbum = await queryOne(
      'SELECT * FROM albums WHERE id = ?',
      [albumId]
    );
    res.json(updatedAlbum);
  } else {
    res.status(400);
    throw new Error('Erreur lors de la mise à jour de l\'album');
  }
});

// @desc    Supprimer un album
// @route   DELETE /api/albums/:id
// @access  Private
const deleteAlbum = asyncHandler(async (req, res) => {
  const albumId = req.params.id;

  // Vérification si l'album existe
  const album = await queryOne(
    'SELECT * FROM albums WHERE id = ?',
    [albumId]
  );

  if (!album) {
    res.status(404);
    throw new Error('Album non trouvé');
  }

  // Suppression de l'album
  const affectedRows = await remove(
    'DELETE FROM albums WHERE id = ?',
    [albumId]
  );

  if (affectedRows > 0) {
    res.json({ message: 'Album supprimé avec succès' });
  } else {
    res.status(400);
    throw new Error('Erreur lors de la suppression de l\'album');
  }
});

module.exports = {
  getAlbums,
  getAlbumById,
  getAlbumSongs,
  createAlbum,
  updateAlbum,
  deleteAlbum
}; 
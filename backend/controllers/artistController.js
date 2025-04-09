const asyncHandler = require('express-async-handler');
const { query, queryOne, update, remove } = require('../config/db');

// @desc    Récupérer tous les artistes
// @route   GET /api/artists
// @access  Public
const getArtists = asyncHandler(async (req, res) => {
  const artists = await query(
    'SELECT * FROM artists ORDER BY nom'
  );
  res.json(artists);
});

// @desc    Récupérer un artiste par ID
// @route   GET /api/artists/:id
// @access  Public
const getArtistById = asyncHandler(async (req, res) => {
  const artist = await queryOne(
    'SELECT * FROM artists WHERE id = ?',
    [req.params.id]
  );

  if (artist) {
    res.json(artist);
  } else {
    res.status(404);
    throw new Error('Artiste non trouvé');
  }
});

// @desc    Récupérer les albums d'un artiste
// @route   GET /api/artists/:id/albums
// @access  Public
const getArtistAlbums = asyncHandler(async (req, res) => {
  const albums = await query(
    `SELECT * FROM albums WHERE artiste_id = ? ORDER BY date_sortie DESC`,
    [req.params.id]
  );
  res.json(albums);
});

// @desc    Récupérer les morceaux d'un artiste
// @route   GET /api/artists/:id/songs
// @access  Public
const getArtistSongs = asyncHandler(async (req, res) => {
  const songs = await query(
    `SELECT s.*, a.titre as album_titre 
     FROM songs s 
     LEFT JOIN albums a ON s.album_id = a.id 
     WHERE s.artiste_id = ? 
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

// @desc    Mettre à jour un artiste
// @route   PUT /api/artists/:id
// @access  Private
const updateArtist = asyncHandler(async (req, res) => {
  const { nom, avatar, biographie } = req.body;
  const artistId = req.params.id;

  // Vérification si l'artiste existe
  const artist = await queryOne(
    'SELECT * FROM artists WHERE id = ?',
    [artistId]
  );

  if (!artist) {
    res.status(404);
    throw new Error('Artiste non trouvé');
  }

  // Mise à jour de l'artiste
  const affectedRows = await update(
    'UPDATE artists SET nom = ?, avatar = ?, biographie = ? WHERE id = ?',
    [
      nom || artist.nom,
      avatar || artist.avatar,
      biographie || artist.biographie,
      artistId
    ]
  );

  if (affectedRows > 0) {
    // Récupération de l'artiste mis à jour
    const updatedArtist = await queryOne(
      'SELECT * FROM artists WHERE id = ?',
      [artistId]
    );
    res.json(updatedArtist);
  } else {
    res.status(400);
    throw new Error('Erreur lors de la mise à jour de l\'artiste');
  }
});

// @desc    Supprimer un artiste
// @route   DELETE /api/artists/:id
// @access  Private
const deleteArtist = asyncHandler(async (req, res) => {
  const artistId = req.params.id;

  // Vérification si l'artiste existe
  const artist = await queryOne(
    'SELECT * FROM artists WHERE id = ?',
    [artistId]
  );

  if (!artist) {
    res.status(404);
    throw new Error('Artiste non trouvé');
  }

  // Suppression de l'artiste (les morceaux et albums seront supprimés en cascade)
  const affectedRows = await remove(
    'DELETE FROM artists WHERE id = ?',
    [artistId]
  );

  if (affectedRows > 0) {
    res.json({ message: 'Artiste supprimé avec succès' });
  } else {
    res.status(400);
    throw new Error('Erreur lors de la suppression de l\'artiste');
  }
});

module.exports = {
  getArtists,
  getArtistById,
  getArtistSongs,
  getArtistAlbums,
  updateArtist,
  deleteArtist
}; 
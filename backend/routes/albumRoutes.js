const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Importer les contrôleurs (à créer plus tard)
const {
  getAlbums,
  getAlbumById,
  getAlbumSongs,
  createAlbum,
  updateAlbum,
  deleteAlbum
} = require('../controllers/albumController');

// Importer le contrôleur pour ajouter un morceau à un album
const { createSong } = require('../controllers/songController');

// Routes pour les albums
router.route('/')
  .get(getAlbums)
  .post(protect, createAlbum);

router.route('/:id')
  .get(getAlbumById)
  .put(protect, updateAlbum)
  .delete(protect, deleteAlbum);

router.route('/:id/songs')
  .get(getAlbumSongs)
  .post(protect, createSong);

module.exports = router; 
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Importer les contrôleurs (à créer plus tard)
const {
  getArtists,
  getArtistById,
  getArtistSongs,
  getArtistAlbums,
  updateArtist,
  deleteArtist
} = require('../controllers/artistController');

// Routes pour les artistes
router.route('/')
  .get(getArtists);

router.route('/:id')
  .get(getArtistById)
  .put(protect, updateArtist)
  .delete(protect, deleteArtist);

router.route('/:id/songs')
  .get(getArtistSongs);

router.route('/:id/albums')
  .get(getArtistAlbums);

module.exports = router; 
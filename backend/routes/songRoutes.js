const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
} = require('../controllers/songController');

// Routes pour les morceaux
router.route('/')
  .get(getSongs)
  .post(protect, createSong);

router.route('/:id')
  .get(getSongById)
  .put(protect, updateSong)
  .delete(protect, deleteSong);

module.exports = router; 
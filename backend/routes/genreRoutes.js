const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getGenres,
  getGenreById,
  updateGenre
} = require('../controllers/genreController');

// Routes pour les genres
router.route('/')
  .get(getGenres);

router.route('/:id')
  .get(getGenreById)
  .put(protect, updateGenre);

module.exports = router; 
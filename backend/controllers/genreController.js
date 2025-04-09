const asyncHandler = require('express-async-handler');
const { query, queryOne, update } = require('../config/db');

// @desc    Récupérer tous les genres
// @route   GET /api/genres
// @access  Public
const getGenres = asyncHandler(async (req, res) => {
  const genres = await query(
    'SELECT * FROM genres ORDER BY titre'
  );
  res.json(genres);
});

// @desc    Récupérer un genre par ID
// @route   GET /api/genres/:id
// @access  Public
const getGenreById = asyncHandler(async (req, res) => {
  const genre = await queryOne(
    'SELECT * FROM genres WHERE id = ?',
    [req.params.id]
  );

  if (genre) {
    res.json(genre);
  } else {
    res.status(404);
    throw new Error('Genre non trouvé');
  }
});

// @desc    Mettre à jour un genre
// @route   PUT /api/genres/:id
// @access  Private
const updateGenre = asyncHandler(async (req, res) => {
  const { titre, description } = req.body;
  const genreId = req.params.id;

  // Vérification si le genre existe
  const genre = await queryOne(
    'SELECT * FROM genres WHERE id = ?',
    [genreId]
  );

  if (!genre) {
    res.status(404);
    throw new Error('Genre non trouvé');
  }

  // Mise à jour du genre
  const affectedRows = await update(
    'UPDATE genres SET titre = ?, description = ? WHERE id = ?',
    [
      titre || genre.titre,
      description || genre.description,
      genreId
    ]
  );

  if (affectedRows > 0) {
    // Récupération du genre mis à jour
    const updatedGenre = await queryOne(
      'SELECT * FROM genres WHERE id = ?',
      [genreId]
    );
    res.json(updatedGenre);
  } else {
    res.status(400);
    throw new Error('Erreur lors de la mise à jour du genre');
  }
});

module.exports = {
  getGenres,
  getGenreById,
  updateGenre
}; 
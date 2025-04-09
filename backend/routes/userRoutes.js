const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Importer les contrôleurs
const {
  registerUser,
  loginUser,
  deleteUser
} = require('../controllers/userController');

// Routes pour les utilisateurs
router.post('/signup', registerUser);
router.post('/login', loginUser);
router.delete('/:id', protect, deleteUser);

module.exports = router; 
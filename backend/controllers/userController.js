const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../utils/generateToken');
const { query, queryOne, insert, remove } = require('../config/db');

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/users/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Vérification des champs requis
  if (!username || !email || !password) {
    res.status(400);
    throw new Error('Veuillez remplir tous les champs');
  }

  // Vérification si l'utilisateur existe déjà
  const userExists = await queryOne(
    'SELECT * FROM users WHERE email = ? OR username = ?',
    [email, username]
  );

  if (userExists) {
    res.status(400);
    throw new Error('Un utilisateur avec cet email ou ce nom d\'utilisateur existe déjà');
  }

  // Hashage du mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Création de l'utilisateur (role par défaut 'user')
  const userId = await insert(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword]
  );

  // Récupération de l'utilisateur créé (y compris le rôle)
  const user = await queryOne(
    'SELECT id, username, email, role FROM users WHERE id = ?',
    [userId]
  );

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } else {
    res.status(400);
    throw new Error('Données utilisateur invalides');
  }
});

// @desc    Connexion d'un utilisateur
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    res.status(400);
    throw new Error('Veuillez fournir un email et un mot de passe');
  }

  // Recherche de l'utilisateur (y compris le rôle)
  const user = await queryOne(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  // Vérification du mot de passe
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } else {
    res.status(401);
    throw new Error('Email ou mot de passe incorrect');
  }
});

// @desc    Suppression d'un utilisateur
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Vérification si l'utilisateur existe
  const userToDelete = await queryOne(
    'SELECT * FROM users WHERE id = ?',
    [userId]
  );

  if (!userToDelete) {
    res.status(404);
    throw new Error('Utilisateur non trouvé');
  }

  // Vérification des droits : l'utilisateur connecté est-il admin OU le propriétaire du compte ?
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
    res.status(403);
    throw new Error('Non autorisé à supprimer cet utilisateur');
  }

  // Suppression de l'utilisateur
  const affectedRows = await remove(
    'DELETE FROM users WHERE id = ?',
    [userId]
  );

  if (affectedRows > 0) {
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } else {
    res.status(400);
    throw new Error('Erreur lors de la suppression de l\'utilisateur');
  }
});

module.exports = {
  registerUser,
  loginUser,
  deleteUser
}; 
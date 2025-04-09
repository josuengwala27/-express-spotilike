const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT pour un utilisateur
 * @param {number} id - L'ID de l'utilisateur
 * @param {string} role - Le rôle de l'utilisateur ('user' ou 'admin')
 * @returns {string} Le token JWT généré
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { generateToken }; 
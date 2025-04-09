const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Middleware de protection des routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ajouter l'utilisateur (id et rôle) à la requête
      req.user = { id: decoded.id, role: decoded.role };

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Non autorisé, token invalide');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Non autorisé, pas de token');
  }
});

module.exports = { protect }; 
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');
const { testConnection } = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Créer l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/genres', require('./routes/genreRoutes'));
app.use('/api/songs', require('./routes/songRoutes'));

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API Spotilike' });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
const server = app.listen(PORT, async () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  
  // Tester la connexion à la base de données
  try {
    await testConnection();
    console.log('Connexion à la base de données réussie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    process.exit(1);
  }
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  server.close(() => process.exit(1));
}); 
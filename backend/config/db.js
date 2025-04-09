const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Création d'un pool de connexions
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'spotilike',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Conversion du pool en promesses pour utiliser async/await
const promisePool = pool.promise();

// Fonction pour tester la connexion à la base de données
const testConnection = async () => {
  try {
    await promisePool.query('SELECT 1');
    return true;
  } catch (error) {
    throw error;
  }
};

// Fonction pour exécuter une requête SQL
const query = async (sql, params) => {
  try {
    const [rows, fields] = await promisePool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw error;
  }
};

// Fonction pour exécuter une requête SQL et retourner un seul résultat
const queryOne = async (sql, params) => {
  try {
    const [rows, fields] = await promisePool.execute(sql, params);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw error;
  }
};

// Fonction pour exécuter une requête SQL d'insertion et retourner l'ID inséré
const insert = async (sql, params) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.insertId;
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw error;
  }
};

// Fonction pour exécuter une requête SQL de mise à jour et retourner le nombre de lignes affectées
const update = async (sql, params) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw error;
  }
};

// Fonction pour exécuter une requête SQL de suppression et retourner le nombre de lignes affectées
const remove = async (sql, params) => {
  try {
    const [result] = await promisePool.execute(sql, params);
    return result.affectedRows;
  } catch (error) {
    console.error('Erreur SQL:', error);
    throw error;
  }
};

module.exports = {
  query,
  queryOne,
  insert,
  update,
  remove,
  pool: promisePool,
  testConnection
}; 
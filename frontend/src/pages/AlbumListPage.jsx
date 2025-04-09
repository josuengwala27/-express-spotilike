import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlbumCard from '../components/AlbumCard';
import LoadingSpinner from '../components/LoadingSpinner';

// URL de base de l'API (pourrait être dans un fichier de config)
const API_URL = 'http://localhost:5000/api';

function AlbumListPage() {
  const [albums, setAlbums] = useState([]); // Pour stocker les albums
  const [loading, setLoading] = useState(true); // Pour l'indicateur de chargement
  const [error, setError] = useState(null); // Pour les erreurs

  useEffect(() => {
    // Fonction pour fetcher les albums
    const fetchAlbums = async () => {
      setLoading(true); // Début du chargement
      setError(null); // Réinitialiser les erreurs
      try {
        const response = await axios.get(`${API_URL}/albums`);
        setAlbums(response.data); // Mettre à jour l'état avec les albums reçus
      } catch (err) {
        console.error("Erreur lors de la récupération des albums:", err);
        setError('Impossible de charger les albums. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchAlbums(); // Appeler la fonction au montage du composant
  }, []); // Le tableau vide [] signifie que cet effet ne s'exécute qu'une fois (au montage)

  // Affichage conditionnel
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>Albums</h1>
      {albums.length === 0 ? (
        <p>Aucun album trouvé.</p>
      ) : (
        <div className="grid-container">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AlbumListPage; 
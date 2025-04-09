import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtistCard from '../components/ArtistCard';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

function ArtistListPage() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/artists`);
        setArtists(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des artistes:", err);
        setError('Impossible de charger les artistes.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Erreur: {error}</div>;
  }

  return (
    <div>
      <h1>Artistes</h1>
      {artists.length === 0 ? (
        <p>Aucun artiste trouvé.</p>
      ) : (
        <div className="grid-container">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtistListPage; 
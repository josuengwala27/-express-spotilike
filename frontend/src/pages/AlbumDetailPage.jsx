import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link peut être utile pour lier à l'artiste
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner'; // Importer le spinner

const API_URL = 'http://localhost:5000/api';

function AlbumDetailPage() {
  const { albumId } = useParams(); // Récupérer l'ID de l'album depuis l'URL

  const [album, setAlbum] = useState(null); // Pour les détails de l'album
  const [songs, setSongs] = useState([]); // Pour les morceaux de l'album
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const albumResponse = await axios.get(`${API_URL}/albums/${albumId}`);
        setAlbum(albumResponse.data);
        
        // Récupérer les détails de l'artiste
        const artistResponse = await axios.get(`${API_URL}/artists/${albumResponse.data.artiste_id}`);
        setArtist(artistResponse.data);
        
        // Récupérer les chansons
        const songsResponse = await axios.get(`${API_URL}/albums/${albumId}/songs`);
        setSongs(songsResponse.data);

      } catch (err) {
        console.error("Erreur lors de la récupération des détails:", err);
        setError(err.response?.status === 404 ? 'Album non trouvé.' : 'Impossible de charger les détails.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [albumId]); // Ré-exécuter l'effet si albumId change

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">Erreur: {error}</div>;
  }

  if (!album) { // Au cas où l'album est null même sans erreur explicite
    return <div className="error-message">Album non trouvé.</div>;
  }

  return (
    <div className="detail-container">
      <div className="detail-page-header">
        {/* Affichage de la pochette */} 
        {album.pochette ? (
          <img 
            src={album.pochette}
            alt={`Pochette de ${album.titre}`} 
            style={{ width: '300px', height: '300px', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '300px', height: '300px', backgroundColor:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>Pas d'image</div>
        )}
        <div className="detail-page-info">
          <h1>{album.titre}</h1>
          {artist && (
            <h2>
              <Link to={`/artists/${artist.id}`} style={{ color: 'var(--text-secondary-color)', textDecoration: 'none', ':hover': { textDecoration: 'underline' } }}>
                {artist.nom}
              </Link>
            </h2>
          )}
          <p>Date de sortie: {album.date_sortie ? new Date(album.date_sortie).toLocaleDateString() : 'Inconnue'}</p>
        </div>
      </div>
      
      <div className="detail-page-songs">
        <h2>Morceaux</h2>
        {songs.length === 0 ? (
          <p>Aucun morceau trouvé pour cet album.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {songs.map((song, index) => (
              <li key={song.id} style={{ 
                padding: '10px', 
                margin: '5px 0',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ width: '30px' }}>{index + 1}.</span>
                <div style={{ flex: 1 }}>
                  <div>{song.titre}</div>
                  {song.genres && song.genres.length > 0 && (
                    <div style={{ fontSize: '0.8em', color: 'var(--text-secondary-color)' }}> 
                      {song.genres.map(g => g.titre).join(', ')}
                    </div>
                  )}
                </div>
                <span style={{ color: 'var(--text-secondary-color)' }}> 
                  {Math.floor(song.duree / 60)}:{(song.duree % 60).toString().padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AlbumDetailPage; 
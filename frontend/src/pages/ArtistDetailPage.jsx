import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/api';

function ArtistDetailPage() {
  const { artistId } = useParams();

  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Récupérer les détails de l'artiste
        const artistResponse = await axios.get(`${API_URL}/artists/${artistId}`);
        setArtist(artistResponse.data);

        // Récupérer les albums de l'artiste
        const albumsResponse = await axios.get(`${API_URL}/artists/${artistId}/albums`);
        setAlbums(albumsResponse.data);
        
        // Récupérer les chansons
        const songsResponse = await axios.get(`${API_URL}/artists/${artistId}/songs`);
        setSongs(songsResponse.data);

      } catch (err) {
        console.error("Erreur lors de la récupération des détails:", err);
        setError(err.response?.status === 404 ? 'Artiste non trouvé.' : 'Impossible de charger les détails.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [artistId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Erreur: {error}</div>;
  if (!artist) return <div className="error-message">Artiste non trouvé.</div>;

  // Organiser les chansons par album
  const songsByAlbum = songs.reduce((acc, song) => {
    if (!acc[song.album_id]) {
      acc[song.album_id] = [];
    }
    acc[song.album_id].push(song);
    return acc;
  }, {});

  return (
    <div className="detail-container">
      <div className="detail-page-header">
        {artist.avatar ? (
          <img 
            src={artist.avatar}
            alt={`Avatar de ${artist.nom}`} 
            style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor:'#333', display:'flex', alignItems:'center', justifyContent:'center', color:'#888', textAlign: 'center'}}>
            Pas d'avatar
          </div>
        )}
        <div className="detail-page-info">
          <h1>{artist.nom}</h1>
          {artist.biographie && <p style={{ maxWidth: '600px' }}>{artist.biographie}</p>}
        </div>
      </div>

      <div className="albums-section" style={{ marginTop: '2rem' }}>
        <h2>Albums</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {albums.map(album => (
            <Link 
              key={album.id} 
              to={`/albums/${album.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ 
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                transition: 'transform 0.2s',
                ':hover': { transform: 'scale(1.02)' }
              }}>
                {album.pochette ? (
                  <img 
                    src={album.pochette}
                    alt={`Pochette de ${album.titre}`}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: '4px' }}
                  />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#333', borderRadius: '4px' }} />
                )}
                <h3 style={{ margin: '0.5rem 0' }}>{album.titre}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary-color)', fontSize: '0.9em' }}>
                  {album.date_sortie ? new Date(album.date_sortie).getFullYear() : 'Date inconnue'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="songs-section" style={{ marginTop: '2rem' }}>
        <h2>Morceaux</h2>
        {albums.map(album => {
          const albumSongs = songsByAlbum[album.id] || [];
          if (albumSongs.length === 0) return null;

          return (
            <div key={album.id} style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--text-secondary-color)' }}>
                <Link to={`/albums/${album.id}`} style={{ color: 'inherit', textDecoration: 'none', ':hover': { textDecoration: 'underline' } }}>
                  {album.titre}
                </Link>
              </h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {albumSongs.map((song, index) => (
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ArtistDetailPage; 
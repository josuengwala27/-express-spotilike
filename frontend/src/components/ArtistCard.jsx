import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

function ArtistCard({ artist }) {
  const imageUrl = artist.avatar || 'https://via.placeholder.com/150?text=No+Avatar';

  return (
    <div className="card artist-card">
      <Link to={`/artists/${artist.id}`}>
        <img src={imageUrl} alt={`Avatar de ${artist.nom}`} className="card-image artist-avatar" />
        <div className="card-body">
          <h3 className="card-title">{artist.nom}</h3>
        </div>
      </Link>
    </div>
  );
}

export default ArtistCard; 
import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css'; // On utilisera un CSS commun pour les cartes

const API_URL = 'http://localhost:5000/api'; // Assurez-vous que c'est cohérent

function AlbumCard({ album }) {
  const imageUrl = album.pochette || 'https://via.placeholder.com/150?text=No+Cover';

  return (
    <div className="card album-card">
      <Link to={`/albums/${album.id}`}>
        <img src={imageUrl} alt={`Pochette de ${album.titre}`} className="card-image" />
        <div className="card-body">
          <h3 className="card-title">{album.titre}</h3>
          {} 
          {}
        </div>
      </Link>
    </div>
  );
}

export default AlbumCard; 
import React from 'react';
import './LoadingSpinner.css'; // Importer le CSS du spinner

function LoadingSpinner() {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
}

export default LoadingSpinner; 
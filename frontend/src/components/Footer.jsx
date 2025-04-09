import React from 'react';
import './Footer.css'; // On créera ce fichier CSS

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>&copy; {currentYear} Spotilike - Créé par Jean Josue NGWALA MAYALA et Anis HAMICH</p>
      {}
    </footer>
  );
}

export default Footer; 
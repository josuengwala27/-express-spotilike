import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/" style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Spotilike</Link>
        </li>
        <li>
          <Link to="/albums">Albums</Link>
        </li>
        <li>
          <Link to="/artists">Artistes</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header; 
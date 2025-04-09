import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';

// Importer les composants de structure
import Header from './components/Header';
import Footer from './components/Footer';

// Importer les composants de page
import HomePage from './pages/HomePage';
import AlbumListPage from './pages/AlbumListPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import ArtistListPage from './pages/ArtistListPage';
import ArtistDetailPage from './pages/ArtistDetailPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="content">
          <Routes>
            <Route path="/albums" element={<AlbumListPage />} />
            <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
            <Route path="/artists" element={<ArtistListPage />} />
            <Route path="/artists/:artistId" element={<ArtistDetailPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

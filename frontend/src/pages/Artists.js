import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchArtists } from '../store/slices/artistsSlice';
import { logout } from '../store/slices/authSlice';
import './Artists.css';

function Artists() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: artists, loading, error } = useSelector((state) => state.artists);
  const { user } = useSelector((state) => state.auth);

  // Fallback to localStorage if Redux doesn't have user
  const userName = user?.name || (() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser).name : 'Guest';
    } catch {
      return 'Guest';
    }
  })();

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'http://localhost:8000/logout';
  };

  if (loading) {
    return (
      <div className="artists-container">
        <div className="loading">Loading artists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="artists-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="artists-container">
      <header className="artists-header">
        <div className="header-content">
          <h1>Top Last.fm Artists</h1>
          <div className="user-info">
            <span>Welcome, {userName}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="artists-grid">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-card">
            <div className="artist-image">
              {artist.image && artist.image !== '' ? (
                <img
                  src={artist.image}
                  alt={artist.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="placeholder-image">{artist.name.charAt(0)}</div>
              )}
            </div>
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <p className="listeners">
                {parseInt(artist.listeners).toLocaleString()} listeners
              </p>
              <a
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="artist-link"
              >
                View on Last.fm →
              </a>
            </div>
          </div>
        ))}
      </div>

      {artists.length === 0 && !loading && (
        <div className="empty-state">
          <p>No artists found. Run the import command to fetch artists from Last.fm.</p>
        </div>
      )}
    </div>
  );
}

export default Artists;

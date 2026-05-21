import { useEffect, useState } from 'react';
import './index.css';

export default function Sidebar({ token, onPlaylistSelect }) {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!token) return;
    fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setPlaylists(data.items);
        }
      })
      .catch(err => console.error("Error fetching playlists", err));
  }, [token]);

  return (
    <div className="sidebar">
      <div className="sidebar__logo">
        <img
          src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
          alt="Spotify Logo"
        />
      </div>
      <ul className="sidebar__menu">
        <li className="sidebar__menuItem active">
          <span className="material-icons" style={{fontSize: '24px'}}>home</span>
          Home
        </li>
        <li className="sidebar__menuItem">
          <span className="material-icons" style={{fontSize: '24px'}}>search</span>
          Search
        </li>
        <li className="sidebar__menuItem">
          <span className="material-icons" style={{fontSize: '24px'}}>library_music</span>
          Your Library
        </li>
      </ul>
      
      <br />
      <div style={{ padding: '0 12px' }}>
        <strong style={{ fontSize: '12px', color: '#b3b3b3', letterSpacing: '1px', textTransform: 'uppercase' }}>Playlists</strong>
        <hr style={{ border: '1px solid #282828', margin: '10px 0' }} />
        <div style={{ overflowY: 'auto', height: 'calc(100vh - 350px)' }}>
          {playlists.map(playlist => (
            <p 
              key={playlist.id} 
              onClick={() => onPlaylistSelect(playlist.id, playlist.name)}
              style={{ fontSize: '14px', color: '#b3b3b3', padding: '8px 0', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} 
              className="playlist-item"
            >
              {playlist.name}
            </p>
          ))}
          {playlists.length === 0 && <p style={{ fontSize: '14px', color: '#b3b3b3' }}>Loading playlists...</p>}
        </div>
      </div>
    </div>
  );
}

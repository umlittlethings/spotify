import React from 'react';
import './index.css';

export default function Sidebar() {
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
        {/* Placeholder for user playlists */}
        <p style={{ fontSize: '14px', color: '#b3b3b3', padding: '8px 0', cursor: 'pointer' }} className="playlist-item">My Awesome Mix</p>
        <p style={{ fontSize: '14px', color: '#b3b3b3', padding: '8px 0', cursor: 'pointer' }} className="playlist-item">Chill Vibes</p>
        <p style={{ fontSize: '14px', color: '#b3b3b3', padding: '8px 0', cursor: 'pointer' }} className="playlist-item">Workout 2026</p>
      </div>
    </div>
  );
}

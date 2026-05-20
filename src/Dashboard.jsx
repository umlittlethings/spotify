import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';
import './index.css';

export default function Dashboard({ token }) {
  const [user, setUser] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [playerObj, setPlayerObj] = useState(null);

  useEffect(() => {
    // Fetch User Profile
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    // Fetch Top Tracks
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=10", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTopTracks(data.items || []))
      .catch(err => console.error(err));

    // Initialize Spotify Web Playback SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: 'React Spotify Web Player',
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', state => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPlaying(!state.paused);
      });

      player.connect();
      setPlayerObj(player);
    };

    return () => {
      if (playerObj) {
        playerObj.disconnect();
      }
    };
  }, [token]);

  const playTrack = (trackUri) => {
    if (!deviceId) {
      alert("Web Player is not ready yet. Please wait a moment.");
      return;
    }
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: [trackUri] })
    })
    .catch(err => console.error("Play failed", err));
  };

  return (
    <div className="app__body">
      <Sidebar />
      <div className="main-view">
        <div className="main-view__header glass">
          <div className="user-widget">
            <img 
              src={user?.images?.[0]?.url || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
              alt={user?.display_name || "User"} 
            />
            <span>{user?.display_name || "Loading..."}</span>
            <span className="material-icons" style={{ fontSize: '18px', margin: '0 4px' }}>arrow_drop_down</span>
          </div>
        </div>

        <div className="main-view__content">
          <h2 className="section-title">Your Top Tracks</h2>
          <div className="card-grid">
            {topTracks.map(track => (
              <div 
                className="item-card" 
                key={track.id} 
                onClick={() => playTrack(track.uri)}
                style={{ cursor: 'pointer' }}
              >
                <div className="item-card__image-container">
                  <img 
                    src={track.album.images[0]?.url} 
                    alt={track.name} 
                    className="item-card__image" 
                  />
                  <div className="item-card__play">
                    <span className="material-icons" style={{ fontSize: '28px', marginLeft: '4px' }}>play_arrow</span>
                  </div>
                </div>
                <div className="item-card__title">{track.name}</div>
                <div className="item-card__subtitle">{track.artists.map(a => a.name).join(", ")}</div>
              </div>
            ))}
            
            {topTracks.length === 0 && (
              <div style={{ color: '#b3b3b3' }}>No tracks found or you haven't listened to much yet.</div>
            )}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 100 }}>
        <Player token={token} deviceId={deviceId} currentTrack={currentTrack} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
      </div>
    </div>
  );
}

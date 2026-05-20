import React from 'react';
import './index.css';

export default function Player({ token, deviceId, currentTrack, isPlaying, setIsPlaying }) {
  const handlePlayPause = () => {
    if (isPlaying) {
      fetch(`https://api.spotify.com/v1/me/player/pause${deviceId ? `?device_id=${deviceId}` : ''}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Pause failed", err));
    } else {
      fetch(`https://api.spotify.com/v1/me/player/play${deviceId ? `?device_id=${deviceId}` : ''}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(err => console.error("Play failed", err));
    }
  };

  const handleNext = () => {
    fetch(`https://api.spotify.com/v1/me/player/next${deviceId ? `?device_id=${deviceId}` : ''}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => console.error("Next failed", err));
  };

  const handlePrevious = () => {
    fetch(`https://api.spotify.com/v1/me/player/previous${deviceId ? `?device_id=${deviceId}` : ''}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(err => console.error("Prev failed", err));
  };

  return (
    <div className="now-playing-bar">
      <div className="np-left">
        {currentTrack ? (
          <>
            <img 
              className="np-image" 
              src={currentTrack.album.images[0]?.url || "https://via.placeholder.com/56"} 
              alt={currentTrack.name} 
            />
            <div className="np-info">
              <div className="np-title">{currentTrack.name}</div>
              <div className="np-artist">{currentTrack.artists.map(a => a.name).join(", ")}</div>
            </div>
          </>
        ) : (
          <div style={{ color: '#b3b3b3', fontSize: '14px' }}>No track currently playing</div>
        )}
      </div>

      <div className="np-center">
        <div className="np-controls">
          <button className="np-btn"><span className="material-icons">shuffle</span></button>
          <button className="np-btn" onClick={handlePrevious}><span className="material-icons">skip_previous</span></button>
          <button className="np-play" onClick={handlePlayPause}>
            <span className="material-icons">{isPlaying ? 'pause' : 'play_arrow'}</span>
          </button>
          <button className="np-btn" onClick={handleNext}><span className="material-icons">skip_next</span></button>
          <button className="np-btn"><span className="material-icons">repeat</span></button>
        </div>
        <div className="np-progress">
          <span>0:00</span>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: '30%' }}></div>
          </div>
          <span>3:45</span>
        </div>
      </div>

      <div className="np-right" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', color: '#b3b3b3' }}>
        <span className="material-icons" style={{ fontSize: '18px' }}>playlist_play</span>
        <span className="material-icons" style={{ fontSize: '18px' }}>devices</span>
        <span className="material-icons" style={{ fontSize: '18px' }}>volume_up</span>
        <div className="progress-bar" style={{ width: '80px', height: '4px' }}>
          <div className="progress-bar__fill" style={{ width: '50%' }}></div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
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
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = "/";
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!searchQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=12`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.tracks && data.tracks.items) {
            setSearchResults(data.tracks.items);
          }
        })
        .catch(err => console.error(err));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  useEffect(() => {
    if (!selectedPlaylist) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlaylistTracks([]);
      return;
    }
    fetch(`https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks?limit=20`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          const tracks = data.items.map(item => item.track).filter(t => t);
          setPlaylistTracks(tracks);
        }
      })
      .catch(err => console.error(err));
  }, [selectedPlaylist, token]);

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
      <Sidebar token={token} onPlaylistSelect={(id, name) => setSelectedPlaylist({ id, name })} />
      <div className="main-view">
        <div className="main-view__header glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '500px', padding: '6px 12px', flex: 1, maxWidth: '300px' }}>
            <span className="material-icons" style={{ color: '#000', marginRight: '8px' }}>search</span>
            <input 
              type="text" 
              placeholder="Search for songs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', color: '#000', fontFamily: 'inherit', fontSize: '14px' }}
            />
          </div>
          <div className="user-widget" onClick={handleLogout} style={{ cursor: 'pointer' }} title="Click to Logout">
            <img 
              src={user?.images?.[0]?.url || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"} 
              alt={user?.display_name || "User"} 
            />
            <span>{user?.display_name || "Loading..."}</span>
            <span className="material-icons" style={{ fontSize: '18px', margin: '0 4px' }}>logout</span>
          </div>
        </div>

        <div className="main-view__content">
          {searchQuery ? (
            <>
              <h2 className="section-title">Search Results</h2>
              <div className="card-grid">
                {searchResults.map(track => (
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
                {searchResults.length === 0 && <div style={{ color: '#b3b3b3' }}>No results found.</div>}
              </div>
            </>
          ) : selectedPlaylist ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <button 
                  onClick={() => setSelectedPlaylist(null)} 
                  style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', marginRight: '16px', display: 'flex', alignItems: 'center' }}
                >
                  <span className="material-icons" style={{ fontSize: '28px' }}>arrow_back</span>
                </button>
                <h2 className="section-title" style={{ marginBottom: 0 }}>{selectedPlaylist.name}</h2>
              </div>
              <div className="card-grid">
                {playlistTracks.map(track => (
                  <div 
                    className="item-card" 
                    key={track.id} 
                    onClick={() => playTrack(track.uri)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="item-card__image-container">
                      <img 
                        src={track.album?.images?.[0]?.url || "https://via.placeholder.com/150"} 
                        alt={track.name} 
                        className="item-card__image" 
                      />
                      <div className="item-card__play">
                        <span className="material-icons" style={{ fontSize: '28px', marginLeft: '4px' }}>play_arrow</span>
                      </div>
                    </div>
                    <div className="item-card__title">{track.name}</div>
                    <div className="item-card__subtitle">{track.artists?.map(a => a.name).join(", ") || "Unknown Artist"}</div>
                  </div>
                ))}
                {playlistTracks.length === 0 && <div style={{ color: '#b3b3b3' }}>No tracks found in this playlist.</div>}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', zIndex: 100 }}>
        <Player token={token} deviceId={deviceId} playerObj={playerObj} currentTrack={currentTrack} isPlaying={isPlaying} />
      </div>
    </div>
  );
}

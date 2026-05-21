import { useEffect, useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { getTokenFromCode } from './spotify';
import './index.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      // Remove code from URL
      window.history.replaceState({}, document.title, "/");
      
      getTokenFromCode(code).then(accessToken => {
        if (accessToken) {
          setToken(accessToken);
        }
      });
    }
  }, []);

  return (
    <div className="app">
      {token ? <Dashboard token={token} /> : <Login />}
    </div>
  );
}

export default App;

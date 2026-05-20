export const authEndpoint = "https://accounts.spotify.com/authorize";
// Default Vite port is 5173, using loopback IP for Spotify strict redirect URI rules
const redirectUri = "http://127.0.0.1:5173/"; 

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "streaming",
  "user-read-email",
  "user-read-private"
];

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export const handleLogin = async () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  if (!clientId) {
    alert("Please set VITE_SPOTIFY_CLIENT_ID in your .env file!");
    return;
  }

  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem('code_verifier', codeVerifier);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `${authEndpoint}?${params.toString()}`;
};

export const getTokenFromCode = async (code) => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  let codeVerifier = localStorage.getItem('code_verifier');

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  try {
    const body = await fetch("https://accounts.spotify.com/api/token", payload);
    const response = await body.json();

    if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) {
            localStorage.setItem('refresh_token', response.refresh_token);
        }
        return response.access_token;
    }
  } catch (error) {
    console.error("Error fetching token:", error);
  }
  return null;
};

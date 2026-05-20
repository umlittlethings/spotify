# Spotify Clone (Personal Use)

A beautiful Spotify clone built with React, Vite, and Vanilla CSS, using the Spotify Web API and Web Playback SDK.

## Setup Instructions

1. **Get a Spotify Client ID**:
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
   - Log in and click **Create an app**.
   - Fill in the App name and description.
   - For **Redirect URI**, enter EXACTLY: `http://127.0.0.1:5173/` *(Spotify strictly forbids `localhost` now, you must use the loopback IP)*.
   - Go to Settings and copy your **Client ID**.

2. **Configure Environment Variables**:
   - Rename `.env.example` to `.env` (or create a new `.env` file).
   - Open `.env` and add your actual Spotify Client ID:
     ```env
     VITE_SPOTIFY_CLIENT_ID=your_client_id_here
     ```

3. **Run the App**:
   ```bash
   npm install
   npm run dev
   ```

4. **Login & Play**:
   - Open your browser to **`http://127.0.0.1:5173/`** *(Do not use localhost!)*
   - Click "Login with Spotify" and authorize your account.
   - You will be redirected to the Dashboard.
   - Wait 1-2 seconds for the Web Playback SDK to connect.
   - Click on any of your Top Tracks to play it directly in your browser!
   - **Note:** Playing music natively in the browser requires a **Spotify Premium** account.

## Features
- **Modern Auth**: Spotify OAuth 2.0 with PKCE Flow (highly secure, no client secret required).
- **In-Browser Playback**: Uses Spotify Web Playback SDK to turn your browser into a Spotify device.
- **Top Tracks**: Fetches and displays your top 10 most listened tracks.
- **Beautiful UI**: Dark-themed UI matching Spotify's modern aesthetic.

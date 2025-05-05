import { redirectToSpotifyLogin, getAccessToken } from './auth.js';
import { generatePoster } from './poster.js';
import { showLoggedInUI, setupPostLoginButtons } from './ui.js';

document.getElementById("loginBtn").addEventListener("click", redirectToSpotifyLogin);

// Check if there's a 'code' parameter in the URL (from Spotify's callback)
const code = new URLSearchParams(window.location.search).get("code");
if (code) {
  console.log("Spotify code received:", code);
  getAccessToken(code).then(token => {
    console.log("Access token received:", token);  // Log token for debugging
    localStorage.setItem("access_token", token);  // Store token in local storage
    window.history.replaceState({}, document.title, "/");  // Clean the URL
    showLoggedInUI();  // Update the UI after login
    fetchSpotifyData(token);  // Fetch user data and generate poster
  }).catch(err => {
    console.error("Error during token exchange:", err);
  });
}

// Function to fetch Spotify data (top artists, top tracks, user profile)
async function fetchSpotifyData(token) {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [artistsRes, tracksRes, userRes, playlistsRes] = await Promise.all([
      fetch("https://api.spotify.com/v1/me/top/artists?limit=5", { headers }),
      fetch("https://api.spotify.com/v1/me/top/tracks?limit=1", { headers }),
      fetch("https://api.spotify.com/v1/me", { headers }),
      fetch("https://api.spotify.com/v1/me/playlists?limit=10", { headers }),
    ]);

    const artistsData = await artistsRes.json();
    const tracksData = await tracksRes.json();
    const userData = await userRes.json();
    const playlistsData = await playlistsRes.json();

    // Log data for debugging purposes
    console.log("Top Artists:", artistsData);
    console.log("Top Track:", tracksData);
    console.log("User Data:", userData);
    console.log("Playlists Data:", playlistsData);

    const topArtists = artistsData.items;
    const topTrack = tracksData.items[0];
    const user = userData;
    const playlistName = getRandomPlaylistName(playlistsData.items);
    const topGenre = getTopGenre(topArtists);

    await generatePoster({
      topArtists: topArtists.map(a => a.name),
      topSong: topTrack?.name || "Your Top Song",  // Fallback if no song
      username: user.display_name || "You",  // Fallback if no username
      topGenre,
      playlist: playlistName,
      runtime: "13,000 MINUTES"  // Example runtime, can be dynamically calculated
    });

    setupPostLoginButtons();  // Show post-login UI
  } catch (err) {
    console.error("Error fetching Spotify data:", err);
  }
}

// Helper function: Pick a random playlist from user's playlists
function getRandomPlaylistName(playlists) {
  if (!playlists || playlists.length === 0) return "Your Playlist";
  const randomIndex = Math.floor(Math.random() * playlists.length);
  return playlists[randomIndex].name;
}

// Helper function: Get the most frequent genre from top artists
function getTopGenre(artists) {
  const genreCount = {};

  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  // Sort by count and return the top genre
  const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
  return sortedGenres.length > 0 ? sortedGenres[0][0] : "Unknown Genre";
}

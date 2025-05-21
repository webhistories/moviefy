import { redirectToSpotifyLogin, getAccessToken } from './auth.js';
import { generatePoster } from './poster.js';
import { showLoggedInUI, setupPostLoginButtons } from './ui.js';

document.getElementById("loginBtn").addEventListener("click", redirectToSpotifyLogin);

// Check if there's a 'code' parameter in the URL (from Spotify's callback)
const code = new URLSearchParams(window.location.search).get("code");

if (code) {
  console.log("Spotify code received:", code);
  getAccessToken(code)
    .then(token => {
      console.log("Access token received:", token);
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, "/");
      showLoggedInUI();
      fetchSpotifyData(token);
    })
    .catch(err => {
      console.error("Error during token exchange:", err);
    });
}

function getRandomSubset(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to fetch Spotify data (top artists, user profile, playlists)
async function fetchSpotifyData(token) {
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [artistsRes, userRes, playlistsRes] = await Promise.all([
      fetch("https://api.spotify.com/v1/me/top/artists?limit=20", { headers }),
      fetch("https://api.spotify.com/v1/me", { headers }),
      fetch("https://api.spotify.com/v1/me/playlists?limit=10", { headers }),
    ]);

    const artistsData = await artistsRes.json();
    const userData = await userRes.json();
    const playlistsData = await playlistsRes.json();

    //console.log("Top Artists:", artistsData);
    //console.log("User Data:", userData);
    //console.log("Playlists Data:", playlistsData);

    const topArtists = artistsData.items;
    const user = userData;

    const { name: playlistName, id: playlistId } = getRandomPlaylistName(playlistsData.items);
    const topGenres = getTopGenres(topArtists);

    // Get songs and artists from playlist
    const tracksRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers
    });

    const tracksData = await tracksRes.json();
    const topTracks = tracksData.items;
    const artistNames = [];

    const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];

    topTracks.forEach(item => {
      if (item.track && item.track.artists) {
        item.track.artists.forEach(artist => {
          artistNames.push(artist.name);
        });
      }
    });

    const uniqueArtists = [...new Set(artistNames)];
	const genreA = topGenres[0] || "NATURE";
	const genreB = topGenres[1] || "SONIC";

    await generatePoster({
      topArtists: getRandomSubset(uniqueArtists, 5),
      topSong: randomTrack?.track.name || "Your Top Song",
      username: user.display_name || "You",
      genreA,
	  genreB,
      playlist: playlistName,
      runtime: "13,000 MINUTES"
    });

    setupPostLoginButtons();
  } catch (err) {
    console.error("Error fetching Spotify data:", err);
  }
}

// Helper: Pick a random playlist
function getRandomPlaylistName(playlists) {
  if (!playlists || playlists.length === 0) {
    return { name: "Your Playlist", id: null };
  }
  const randomIndex = Math.floor(Math.random() * playlists.length);
  const playlist = playlists[randomIndex];
  return { name: playlist.name, id: playlist.id };
}

// Helper: Get top 3 most frequent genres
function getTopGenres(artists) {
  const genreCount = {};

  artists.forEach(artist => {
    artist.genres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

  const sortedGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return sortedGenres.slice(0, 3).length > 0 ? sortedGenres.slice(0, 3) : ["Unknown Genre"];
}


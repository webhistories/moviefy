// === Spotify Auth ===
const clientId = "da8efc3f20814776b216228d8a9033fe"; // Replace with your real client ID
const redirectUri = "http://127.0.0.1:8000/";
const scopes = "user-top-read";

const loginBtn = document.getElementById("loginBtn");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const shareBtn = document.getElementById("shareBtn");

function getAccessTokenFromURL() {
  const hash = window.location.hash;
  if (!hash) return null;
  const params = new URLSearchParams(hash.substring(1));
  return params.get("access_token");
}

loginBtn.addEventListener("click", () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scopes}`;
  window.location.href = authUrl;
});

const token = getAccessTokenFromURL();

const loginScreen = document.getElementById("loginScreen");
const posterApp = document.getElementById("posterApp");

if (token) {
  loginScreen.style.display = "none";
  posterApp.style.display = "block";
}


// === Fetch Data from Spotify ===
async function getSpotifyData() {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [artistsRes, tracksRes] = await Promise.all([
    fetch("https://api.spotify.com/v1/me/top/artists?limit=3", { headers }),
    fetch("https://api.spotify.com/v1/me/top/tracks?limit=1", { headers }),
  ]);

  const artistsData = await artistsRes.json();
  const tracksData = await tracksRes.json();

  const topArtists = artistsData.items.map((a) => a.name);
  const topSong = tracksData.items[0]?.name || "Unknown Song";

  return { topArtists, topSong };
}

// === Canvas Drawing ===
const canvas = document.getElementById("posterCanvas");
const ctx = canvas?.getContext("2d");

generateBtn.addEventListener("click", async () => {
  if (!token || !ctx) return;

  const { topArtists, topSong } = await getSpotifyData();

  const bg = new Image();
  bg.src = "public/background.png"; // Adjust to your image path

  bg.onload = () => {
    canvas.width = 1080;
    canvas.height = 1920;

    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    ctx.font = "bold 64px Inter";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("A Musical Journey", canvas.width / 2, 200);

    ctx.font = "48px Inter";
    ctx.fillText("Starring:", canvas.width / 2, 400);
    topArtists.forEach((artist, index) => {
      ctx.fillText(artist, canvas.width / 2, 480 + index * 60);
    });

    ctx.fillText("Original Soundtrack:", canvas.width / 2, 750);
    ctx.fillText(`"${topSong}"`, canvas.width / 2, 820);

    generateBtn.style.display = "none";
    downloadBtn.style.display = "inline-block";
    shareBtn.style.display = "inline-block";
  };
});

// === Download Poster ===
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "poster.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// === Share to Story (Manual for now) ===
shareBtn.addEventListener("click", () => {
  alert("Download the image and upload it to your Instagram story manually.");
});

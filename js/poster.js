
export async function generatePoster({ topArtists, topSong, username, genreA, genreB, playlist, runtime }) {
  const canvas = document.getElementById("posterCanvas");
  const ctx = canvas.getContext("2d");

  const genres = {
    horror: {
      background: [
        "img/horror_bg_1.jpg",
        "img/horror_bg_2.jpg",
        "img/horror_bg_3.jpg"
      ],
      font: "32px 'Barlow'",
      tagline: [
        "A STORY OF SHADOWS, STORMS, AND THE MUSIC THAT HAUNTS YOU",
        "WHEN THE MUSIC STOPS, THE ECHOES BEGIN",
        "SOME SONGS NEVER DIE, THEY JUST WAIT TO BE HEARD"
      ],
      moviefyFontStyle: "'Anton'",
      moviefyFontSize: 300,
      moviefyPosition: 900,
      moviefyColor: '#f5f5f5',
      filmbyY: 400,
    },
    romance: {
      background: [
        "img/romance_bg_1.jpg",
        "img/romance_bg_2.jpg",
        "img/romance_bg_3.jpg"
      ],
      font: "32px 'Playfair Display'",
      tagline: [
        "LOVE CAN BE A BEAUTIFUL MYSTERY",
        "THE SOUNDTRACK OF YOUR HEART",
        "WHEN MUSIC AND LOVE MEET"
      ],
      moviefyFontStyle: "'Cormorant Garamond'",
      moviefyFontSize: 250,
      moviefyPosition: 500,
      moviefyColor: '#f2f2f2',
      filmbyY: 280,
    },
    sciFi: {
      background: [
        "img/scifi_bg_1.jpg",
        "img/scifi_bg_2.jpg",
        "img/scifi_bg_3.jpg",
        "img/scifi_bg_4.jpg"
      ],
      font: "32px 'Orbitron'",
      tagline: [
        "IN THE FUTURE, MUSIC WILL SAVE US ALL",
        "A JOURNEY BEYOND THE STARS",
        "THE SOUNDTRACK OF A GALAXY FAR AWAY"
      ],
      moviefyFontStyle: "'Russo One'",
      moviefyFontSize: 210,
      moviefyPosition: 1340,
	  moviefyColor: '#f2f2f2',
      filmbyY: 300,
    }
  };

  const selectedGenreKey = Object.keys(genres)[Math.floor(Math.random() * Object.keys(genres).length)];
  const selectedGenre = genres[selectedGenreKey];
  // force select one genre for test
  //const selectedGenre = genres.romance;  // for testing 

  const img = new Image();
  const randomBackground = selectedGenre.background[Math.floor(Math.random() * selectedGenre.background.length)];
  img.src = randomBackground;

  await new Promise(resolve => { img.onload = resolve; });
  await document.fonts.ready;

  canvas.width = 1080;
  canvas.height = 1920;
  const centerX = canvas.width / 2;

  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const top3 = (topArtists || []).slice(0, 3);
  const artistFontSize = 34;
  ctx.font = `${artistFontSize}px 'Barlow'`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  const spacing = canvas.width / (top3.length + 1);
  const artistY = 130;

  top3.forEach((artist, i) => {
    const words = artist.split(" ");
    const x = spacing * (i + 1);
    if (words.length > 1) {
      ctx.fillText(words[0], x, artistY);
      ctx.fillText(words.slice(1).join(" "), x, artistY + artistFontSize + 4);
    } else {
      ctx.fillText(artist, x, artistY + artistFontSize / 2);
    }
  });

  const filmFontSize = 32.1;
  const filmByY = selectedGenre.filmbyY;
  ctx.font = `${filmFontSize}px 'Barlow'`;
  ctx.fillStyle = "white";
  ctx.fillText(`A FILM BY ${username || "UNKNOWN USER"}`, centerX, filmByY);

  const playlistTitle = playlist || "MY PLAYLIST";
  //for testing
  //const playlistTitle = "A VERY LONG NAMENAMENAME A VERY LONG NAMENAMENAMENAME";
  const maxTextWidth = canvas.width * 0.9;
  const moviefyY = selectedGenre.moviefyPosition;
  const moviefyFontStyle = selectedGenre.moviefyFontStyle;
  ctx.fillStyle = selectedGenre.moviefyColor;
  ctx.textAlign = "center";

  let fontSize = selectedGenre.moviefyFontSize;
  let lines = [];

  function wrapTitle(text, fontSize) {
    ctx.font = `${fontSize}px ${moviefyFontStyle}`;
    const words = (text || "").toString().toUpperCase().split(" ");
    const lines = [];
    let currentLine = "";

    for (let word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines;
  }

  while (fontSize > 30) {
    lines = wrapTitle(playlistTitle, fontSize);
    const tooWide = lines.some(line => ctx.measureText(line).width > maxTextWidth);
    if (!tooWide && lines.length <= 3) break;
    fontSize -= 2;
  }

  if (lines.length > 3) {
    lines = lines.slice(0, 3);
    let lastLine = lines[2];
    while (ctx.measureText(lastLine + "...").width > maxTextWidth && lastLine.length > 0) {
      lastLine = lastLine.slice(0, -1);
    }
    lines[2] = lastLine.trim() + "...";
  }

  ctx.font = `${fontSize}px ${moviefyFontStyle}`;
  const lineHeight = fontSize + 10;
  const totalHeight = lines.length * lineHeight;
  let startY = moviefyY - totalHeight / 2 + lineHeight / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, centerX, startY + i * lineHeight);
  });

  const songLabelY = canvas.height - 400;
  ctx.font = "39.5px 'Barlow'";
  ctx.fillStyle = "white";
  ctx.fillText("FEATURING THE HIT SONG", centerX, songLabelY);

  const topSongName = topSong || "NO SONG FOUND";
  ctx.font = "bold 52.6px 'Barlow'";
  ctx.fillText(`"${topSongName}"`, centerX, songLabelY + 55);

  const creditY = canvas.height - 200;
  const userDisplay = username || "UNKNOWN";
  const credits =
    `SPOTIFY & ${userDisplay} PRODUCTIONS PRESENT “${playlist}” ` +
    `STARRING ${topArtists.slice(0, 5).join(", ")} • ` +
    `RUNTIME ${runtime} • FEATURING MOVIEFY • ` +
    `INSPIRED BY YOUR LOVE OF ${genreA} • OFFICIAL SELECTION: YOUR HEADPHONES 2025 • ` +
    `THE ${genreB} EXPERIENCE`;

  const creditBoxWidth = canvas.width * 0.9;
  const maxCreditFont = 25;
  const minCreditFont = 12;
  const lineHeightFactor = 1.3;

  let creditFontSize = maxCreditFont;
  let creditLines = [];

  while (creditFontSize >= minCreditFont) {
    creditLines = wrapText(ctx, credits, creditBoxWidth, creditFontSize);
    if (creditLines.length * creditFontSize * lineHeightFactor <= 100) break;
    creditFontSize -= 1;
  }

  ctx.font = `${creditFontSize}px 'Bebas Neue'`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  const creditLineHeight = creditFontSize * lineHeightFactor;
  const creditStartY = creditY;

  creditLines.forEach((line, i) => {
    ctx.fillText(line, centerX, creditStartY + i * creditLineHeight);
  });

  const randomTagline = selectedGenre.tagline[Math.floor(Math.random() * selectedGenre.tagline.length)];
  ctx.font = "30px 'Barlow'";
  ctx.fillText(randomTagline, centerX, canvas.height - 80);

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("posterCanvas").style.display = "block";
}

function wrapText(ctx, text, maxWidth, fontSize) {
  ctx.font = `${fontSize}px 'Bebas Neue'`;
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + " ";
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && i > 0) {
      lines.push(currentLine.trim());
      currentLine = words[i] + " ";
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim());
  }

  return lines;
}


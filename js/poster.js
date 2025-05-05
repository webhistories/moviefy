export async function generatePoster({ topArtists, topSong, username, topGenre, playlist, runtime }) {
  const canvas = document.getElementById("posterCanvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = "img/bg.png";

  await new Promise(resolve => { img.onload = resolve; });
  await document.fonts.ready;

  canvas.width = 1080;
  canvas.height = 1920;

  const centerX = canvas.width / 2;

  // Draw background
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // === Top 3 Artists ===
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

  // === A FILM BY ===
  const filmFontSize = 32.1;
  const filmByY = 580;
  ctx.font = `${filmFontSize}px 'Barlow'`;
  ctx.fillStyle = "white";
  ctx.fillText(`A FILM BY ${username || "UNKNOWN USER"}`, centerX, filmByY);

  // === MOVIEFY ===
  const moviefyY = filmByY + 300;
  ctx.font = "300px 'Anton'";
  ctx.fillStyle = "#d40c0c";
  ctx.fillText("MOVIEFY", centerX, moviefyY);

  // === FEATURING THE HIT SONG ===
  const songLabelY = canvas.height - 400;
  ctx.font = "39.5px 'Barlow'";
  ctx.fillStyle = "white";
  ctx.fillText("FEATURING THE HIT SONG", centerX, songLabelY);

  // === Top Song Title ===
  const topSongName = topSong || "NO SONG FOUND";
  ctx.font = "bold 52.6px 'Barlow'";
  ctx.fillText(`"${topSongName}"`, centerX, songLabelY + 55);

  // === Credits Block ===
  const creditY = canvas.height - 230;
  const userDisplay = username || "UNKNOWN";

  const credits =
    `SPOTIFY & ${userDisplay} PRODUCTIONS PRESENTS “MOVIEFY” ` +
    `STARRING ${topArtists.slice(0, 5).join(", ")} ` +
    `RUNTIME ${runtime} • FEATURING "${playlist}" • ` +
    `GENRE: ${topGenre} • OFFICIAL SELECTION: YOUR HEADPHONES 2025`;

  ctx.font = "23px 'Bebas Neue'";
  wrapText(ctx, credits, centerX, creditY, 1000, 30);

  // === Tagline ===
  ctx.font = "23px 'Barlow'";
  ctx.fillText(
    "A HORROR STORY OF ECHOES, SHADOWS, AND THE SONGS YOU WISH YOU NEVER HEARD",
    centerX,
    canvas.height - 140
  );
}

// Word wrapping
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && i > 0) {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
}

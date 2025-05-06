export async function generatePoster({ topArtists, topSong, username, genreA, genreB, playlist, runtime }) {
  const canvas = document.getElementById("posterCanvas");
  const ctx = canvas.getContext("2d");

  // List of movie genres with associated backgrounds, fonts, and taglines
  const genres = {
    horror: {
      background: [ "img/horror_bg_1.jpg",
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
	  filmbyY: 580,
    },
    romance: {
      background: [ "img/romance_bg_1.jpg",
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
	  filmbyY: 580,
    },
    sciFi: {
      background: [ "img/scifi_bg_1.jpg",
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
      moviefyPosition: 1400,
	  moviefyColor: '#f2a788',
	  filmbyY: 1200,
    }
  };

  // Randomly select a genre
  const selectedGenreKey = Object.keys(genres)[Math.floor(Math.random() * Object.keys(genres).length)];
  const selectedGenre = genres[selectedGenreKey];
  // force select one genre for test
  //const selectedGenre = genres.horror;  // for testing 

  const img = new Image();
  const randomBackground = selectedGenre.background[Math.floor(Math.random() * selectedGenre.background.length)];
  img.src = randomBackground;

  console.log("Selected Genre:", selectedGenre);

  // Wait for the image to load
  await new Promise(resolve => { img.onload = resolve; });
  await document.fonts.ready;

  // Debugging to ensure the image is loaded
  console.log("Image Loaded!");

  // Set canvas size and center X position
  canvas.width = 1080;
  canvas.height = 1920;
  const centerX = canvas.width / 2;

  // Add a background color for the canvas to ensure we can see something while debugging
  ctx.fillStyle = "#f5f5f5";  // Light grey background
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the whole canvas with this background color

  // Draw background for the selected genre
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

  // === A FILM BY USERNAME ===
  const filmFontSize = 32.1;
  const filmByY = selectedGenre.filmbyY;
  ctx.font = `${filmFontSize}px 'Barlow'`;
  ctx.fillStyle = "white";
  ctx.fillText(`A FILM BY ${username || "UNKNOWN USER"}`, centerX, filmByY);

// === MOVIE TITLE / PLAYLIST ===
const playlistTitle = playlist || "MY PLAYLIST";
const maxTextWidth = canvas.width * 0.9; // 90% of canvas width
const moviefyY = selectedGenre.moviefyPosition;
const moviefyFontStyle = selectedGenre.moviefyFontStyle;
ctx.fillStyle = selectedGenre.moviefyColor;


let fontSize = selectedGenre.moviefyFontSize; // Max size
ctx.textAlign = "center";

while (fontSize > 30) {
  ctx.font = `${fontSize}px ${moviefyFontStyle}`; 
  const textWidth = ctx.measureText(playlistTitle).width;
  if (textWidth <= maxTextWidth) break;
  fontSize -= 2;
}

ctx.fillText(playlistTitle.toUpperCase(), centerX, moviefyY);


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
    `SPOTIFY & ${userDisplay} PRODUCTIONS PRESENTS “${playlist}” ` +
    `STARRING ${topArtists.slice(0, 5).join(", ")} •` +
    ` RUNTIME ${runtime} • FEATURING MOVIEFY • ` +
    `INSPIRED BY YOUR LOVE OF ${genreA} • OFFICIAL SELECTION: YOUR HEADPHONES 2025` +
	`• THE ${genreB} EXPERIENCE`;

  ctx.font = "23px 'Bebas Neue'";
  wrapText(ctx, credits, centerX, creditY, 1000, 30);

  // === Tagline === (from the selected genre)
  const randomTagline = selectedGenre.tagline[Math.floor(Math.random() * selectedGenre.tagline.length)];
  ctx.font = "30px 'Barlow'";
  ctx.fillText(randomTagline, centerX, canvas.height - 140);

  // Hide the login screen after generating the poster
  document.getElementById("loginScreen").style.display = "none";  // Hide login screen
  document.getElementById("posterCanvas").style.display = "block";  // Show poster canvas
}

// Word wrapping function
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

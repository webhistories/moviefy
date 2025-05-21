export function showLoggedInUI() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("posterApp").style.display = "block";
}

export function setupPostLoginButtons() {
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");

  downloadBtn.style.display = "inline-block";
  shareBtn.style.display = "inline-block";

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = document.getElementById("posterCanvas").toDataURL();
    link.click();
  });

  shareBtn.addEventListener("click", () => {
	  document.getElementById("posterApp").style.display = "none";
	  document.getElementById("sharePreview").style.display = "flex";

	  
	  const original = document.getElementById("posterCanvas");
	  const shareCanvas = document.getElementById("posterCanvasShare");
	  const ctx = shareCanvas.getContext("2d");
	  ctx.clearRect(0, 0, shareCanvas.width, shareCanvas.height);
	  ctx.drawImage(original, 0, 0);

	  alert("Long press to save or screenshot and share to Instagram Story.");
	});
}

/*export function showLoggedInUI() {
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

  newTabBtn.addEventListener("click", () => {
	const dataUrl = document.getElementById("posterCanvas").toDataURL();
	   const newTab = window.open();
	   newTab.document.write(`<img src="${dataUrl}" style="max-width: 100%;">`);
}*/

export function showLoggedInUI() { 
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("posterApp").style.display = "block";
}

export function setupPostLoginButtons() {
  const downloadBtn = document.getElementById("downloadBtn");
  const newTabBtn = document.getElementById("newTabBtn");

  downloadBtn.style.display = "inline-block";
  newTabBtn.style.display = "inline-block";

  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = document.getElementById("posterCanvas").toDataURL();
    link.click();
  });

  newTabBtn.addEventListener("click", () => {
    const dataUrl = document.getElementById("posterCanvas").toDataURL();
    const newTab = window.open();
    newTab.document.write(`<img src="${dataUrl}" style="max-width: 100%;">`);
  });
}

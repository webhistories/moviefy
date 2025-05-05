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
    // You can implement Web Share API or show modal with instructions
    alert("To share, save the image first and upload to Instagram Stories.");
  });
}

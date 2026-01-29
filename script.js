// TechFest starts on Feb 20, 2026 at 9:00 AM IST
const eventDate = new Date("2026-02-20T09:00:00").getTime();

function updateTimer() {
  const now = new Date().getTime();
  const diff = eventDate - now;

  if (diff <= 0) {
    document.getElementById("timer").innerHTML = "🎉 TechFest Started!";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("timer").innerHTML =
    `${days} Days ${hours} Hrs ${minutes} Min ${seconds} Sec`;
}

updateTimer();
setInterval(updateTimer, 1000);

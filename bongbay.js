function bongbay() {
  // ===== STYLE =====
  const style = document.createElement("style");
  style.textContent = `
  body {
    margin: 0;
    height: 100vh;
    overflow: hidden;
  }

  .balloon {
    position: absolute;
    bottom: -100px;
    width: 60px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    animation: floatUp 7s linear forwards;
    z-index: 10;
  }

  .balloon::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 40px;
    background: black;
  }

  @keyframes floatUp {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-100vh); }
  }

  /* ===== BÓNG ĐẶC BIỆT ===== */
  .special-balloon {
    width: 120px;
    height: 150px;
    background: gold !important;
    animation: floatUpFast 4s linear forwards;
    box-shadow: 0 0 20px gold;
  }

  @keyframes floatUpFast {
    0%   { transform: translateY(0); }
    100% { transform: translateY(-100vh); }
  }

  .explode {
    animation: explodeAnim 0.5s forwards;
  }

  @keyframes explodeAnim {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  .confetti {
    position: absolute;
    width: 4px;
    height: 4px;
    opacity: 0.8;
    animation: confettiAnim 1s forwards;
  }

  @keyframes confettiAnim {
    to {
      transform: translate(var(--x), var(--y)) rotate(360deg);
      opacity: 0;
    }
  }

  .message {
    position: absolute;
    font-size: 20px;
    font-weight: bold;
    color: #4eb9e7;
    animation: messageAnim 2s forwards;
  }

  @keyframes messageAnim {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(1.5) translateY(-50px); }
  }

  #timer {
    position: fixed;
    top: 10px;
    right: 10px;
    font-size: 24px;
    font-weight: bold;
    color: black;
  }
  `;
  document.head.appendChild(style);

  // ===== HÀM TƯƠNG TÁC CHUNG =====
  function addInteraction(el, handler) {
    el.addEventListener("click", handler);
    el.addEventListener("touchstart", handler);
  }

  // ===== TẠO BÓNG THƯỜNG =====
  function createBalloon() {
    const balloon = document.createElement("div");
    balloon.className = "balloon";

    const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
    balloon.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    balloon.style.left = Math.random() * window.innerWidth + "px";

    addInteraction(balloon, (e) => {
      explodeBalloon(balloon, e);
    });

    document.body.appendChild(balloon);

    balloon.addEventListener("animationend", () => {
      if (!balloon.classList.contains("explode")) {
        balloon.remove();
      }
    });
  }

  // ===== TẠO BÓNG ĐẶC BIỆT =====
  function createSpecialBalloon() {
    const balloon = document.createElement("div");
    balloon.className = "balloon special-balloon";
    balloon.style.left = Math.random() * window.innerWidth + "px";

    addInteraction(balloon, (e) => {
      explodeBalloon(balloon, e);
    });

    document.body.appendChild(balloon);

    balloon.addEventListener("animationend", () => {
      if (!balloon.classList.contains("explode")) {
        balloon.remove();
      }
    });
  }

  // ===== NỔ BÓNG =====
  function explodeBalloon(balloon, e) {
    balloon.classList.add("explode");
    const x = e.clientX || (e.touches && e.touches[0].clientX);
    const y = e.clientY || (e.touches && e.touches[0].clientY);
    spawnConfetti(x, y);
    showMessage(x, y);
    setTimeout(() => balloon.remove(), 500);
  }

  // ===== PHÁO GIẤY =====
  function spawnConfetti(x, y) {
    const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = x + "px";
      confetti.style.top = y + "px";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      confetti.style.setProperty("--x", (Math.random() * 400 - 200) + "px");
      confetti.style.setProperty("--y", (Math.random() * 400 - 200) + "px");

      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1000);
    }
  }

  // ===== MESSAGE =====
  function showMessage(x, y) {
    const messages = ["Happy Birthday!", "Best Wishes!", "Congrats!", "🎉"];
    const msg = document.createElement("div");
    msg.className = "message";
    msg.textContent =
      messages[Math.floor(Math.random() * messages.length)];

    msg.style.left = x + "px";
    msg.style.top = y + "px";

    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
  }

  // ===== SPAWN NHIỀU BÓNG =====
  function spawnBalloons() {
    const count = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < count; i++) {
      createBalloon();
    }
  }

  const balloonInterval = setInterval(spawnBalloons, 1500);

  // ===== TIMER =====
  const initialTime = 10;
  let timeLeft = initialTime;
  let specialBalloonSpawned = false;

  const timer = document.createElement("div");
  timer.id = "timer";
  timer.textContent = timeLeft;
  document.body.appendChild(timer);

  const countdown = setInterval(() => {
    timeLeft--;
    timer.textContent = timeLeft;

    if (timeLeft === Math.floor(initialTime / 2) && !specialBalloonSpawned) {
      specialBalloonSpawned = true;
      createSpecialBalloon();
    }

    if (timeLeft <= 0) {
      clearInterval(countdown);
      clearInterval(balloonInterval);
      endGame();
    }
  }, 1000);

  // ===== KẾT THÚC GAME =====
  function endGame() {
    timer.remove();
    document.dispatchEvent(new Event("gameEnded"));
  }
}

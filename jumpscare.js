import { tenlua } from "./launch.js";

export function hudoa() {
  // ===== STYLE =====
  const style = document.createElement("style");
  style.textContent = `
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: black;
      perspective: 1000px;
      margin: 0;
      overflow: hidden;
      transition: transform 5s ease-in-out;
    }
    .scene {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 200px;
      height: 200px;
      transform-style: preserve-3d;
      cursor: pointer;
      z-index: 1;
    }
    .box {
      width: 100%;
      height: 100%;
      position: absolute;
      transform-style: preserve-3d;
    }
    .face {
      position: absolute;
      width: 200px;
      height: 200px;
      background: #ff4d4d;
      border: 2px solid #fff;
    }
    .front  { transform: rotateY(0deg) translateZ(100px); }
    .back   { transform: rotateY(180deg) translateZ(100px); }
    .right  { transform: rotateY(90deg) translateZ(100px); }
    .left   { transform: rotateY(-90deg) translateZ(100px); }
    .top    { transform: rotateX(90deg) translateZ(100px); background: #ff9999; }
    .bottom { transform: rotateX(-90deg) translateZ(100px); background: #ff9999; }
    .overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      z-index: 999;
    }
    .overlay.show {
      opacity: 1;
      visibility: visible;
    }
    .overlay img {
      max-width: 100%;
      max-height: 100%;
      opacity: 0;
    }
    body.zoom {
      transform: scale(3);
    }
    @keyframes fadeInOut {
      0%   { opacity: 0; }
      20%  { opacity: 1; }
      80%  { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ===== UI =====
  const scene = document.createElement("div");
  scene.className = "scene";
  scene.id = "gift";
  scene.innerHTML = `
    <div class="box">
      <div class="face front"></div>
      <div class="face back"></div>
      <div class="face right"></div>
      <div class="face left"></div>
      <div class="face top"></div>
      <div class="face bottom"></div>
    </div>
  `;
  document.body.appendChild(scene);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.id = "overlay";
  overlay.innerHTML = `<img id="gif" src="jumpscare.gif" alt="Surprise!">`;
  document.body.appendChild(overlay);

  const gift = document.getElementById("gift");
  const gif = document.getElementById("gif");

  // ===== LOGIC =====
  function endMiniGame() {
    // chỉ xoá minigame, không xoá toàn bộ body
    scene.remove();
    overlay.remove();
    document.body.classList.remove("zoom");
    tenlua(); // gọi game tiếp theo
  }

  gift.addEventListener("click", () => {
    document.body.classList.add("zoom");

    setTimeout(() => {
      overlay.classList.add("show");

      setTimeout(() => {
        gif.style.animation = "fadeInOut 0.5s forwards";
        gif.addEventListener("animationend", endMiniGame, { once: true });
      }, 2000);

    }, 5000);
  });
}

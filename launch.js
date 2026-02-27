import { galaxy } from './galaxy.js';


// ====== TẠO STYLE ======
const style = document.createElement("style");
style.textContent = `
body {
  margin: 0;
  height: 100vh;
  transition: background 1s ease;
  overflow: hidden;
}

/* Ban ngày */
body.day {
  background: linear-gradient(to top, #ff9966, #ff5e62);
}

/* Ban đêm */
body.night {
  background: linear-gradient(to top, #0d1b2a, #1b263b);
}

.toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 40px;
  border-radius: 20px;
  background: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s ease;
  z-index: 9999; /* đảm bảo touchstart được */
}

.sun {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: orange;
  box-shadow: 0 0 50px rgba(255,140,0,0.8);
  opacity: 1;
  transition: opacity 1s ease;
}

body.night .sun {
  opacity: 0;
}

.rocket {
  position: absolute;
  top: 50%;
  left: -120px;
  transform: translateY(-50%);
  width: 60px;
  height: 30px;
  background: silver;
  border-radius: 10px;
  transition: left 5s linear;
  cursor: pointer;
}

.rocket::after {
  content: '';
  position: absolute;
  right: -15px;
  top: 8px;
  width: 15px;
  height: 14px;
  background: red;
  border-radius: 50%;
  animation: flame 0.3s infinite alternate;
}

@keyframes flame {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(1.3); opacity: 0.6; }
}

.moon {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #f0f0f0;
  box-shadow: 0 0 20px white;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: top 1.5s ease, opacity 1.5s ease;
}

body.night .moon {
  top: 120px;
  opacity: 1;
}

.black-balloon {
  width: 100px;
  height: 120px;
  border-radius: 50%;
  position: absolute;
  z-index: 20;
  cursor: pointer;
  transition: transform 0.3s ease, opacity 1.5s ease;
  background: black;
  opacity: 0; /* mặc định ẩn */
}

/* Ban ngày - fade out */
body.day .black-balloon {
  opacity: 0;
}

/* Ban đêm - fade in */
body.night .black-balloon {
  opacity: 1;
}




.stars {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite alternate;
}

@keyframes twinkle {
  from { opacity: 0.3; }
  to { opacity: 1; }
}

body.night .stars {
  opacity: 1;



}
`;
document.head.appendChild(style);

// ====== TẠO ELEMENT ======
document.body.classList.add("day");

const sun = document.createElement("div");
sun.className = "sun";

const rocket = document.createElement("div");
rocket.className = "rocket";

const moon = document.createElement("div");
moon.className = "moon";

const starsContainer = document.createElement("div");
starsContainer.className = "stars";

const toggle = document.createElement("div");
toggle.className = "toggle-btn";
toggle.innerText = "☀️/🌙";

// Append vào body
document.body.appendChild(sun);
document.body.appendChild(rocket);
document.body.appendChild(moon);
document.body.appendChild(starsContainer);
document.body.appendChild(toggle);

// ====== TẠO SAO NGẪU NHIÊN ======
for (let i = 0; i < 40; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.top = Math.random() * window.innerHeight + "px";
  star.style.left = Math.random() * window.innerWidth + "px";
  starsContainer.appendChild(star);
}

// ====== TÊN LỬA BAY ======
function startRocket() {
  rocket.style.left = window.innerWidth + "px";
}



function createBlackBalloon() {
    const blackBalloon = document.createElement("div");
    blackBalloon.className = "black-balloon";
    blackBalloon.style.background = "black";
    blackBalloon.style.left = (window.innerWidth / 2 - 50) + "px";
    blackBalloon.style.top = (window.innerHeight / 2 - 70) + "px";

    document.body.appendChild(blackBalloon);

    // Khi touchstart thì phồng to dần
    let currentScale = 1;
    const maxScale = 10; // phồng tối đa gấp 4 lần

    blackBalloon.addEventListener("touchstart", () => {
      if (currentScale < maxScale) {
        currentScale += 0.5; // mỗi lần touchstart phồng thêm 0.5
        blackBalloon.style.transform = `scale(${currentScale})`;
      } else {
        blackBalloon.remove(); // đạt max thì biến mất
        document.body.innerHTML = "";
        galaxy();
        
      }
    });
  }


// Hàm hiển thị chữ "Phá huỷ bóng bay"
function showDestroyMessage() {
  const msg = document.createElement("div");
  msg.textContent = "Phá huỷ bóng bay";
  msg.style.position = "fixed";
  msg.style.top = "50%";
  msg.style.left = "50%";
  msg.style.transform = "translate(-50%, -50%)";
  msg.style.fontSize = "48px";
  msg.style.fontWeight = "bold";
  msg.style.color = "white";
  msg.style.textShadow = "2px 2px 8px black";
  msg.style.zIndex = "10000";
  msg.style.opacity = "1";
  msg.style.transition = "opacity 2s ease";

  document.body.appendChild(msg);

  // Sau 2 giây thì fade và remove
  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 2000);
  }, 2000);
}





let rocketDestroyed = false; // trạng thái máy bay

// touchstart tên lửa
rocket.addEventListener("touchstart", () => {
  rocket.style.display = "none";
  rocketDestroyed = true; // đánh dấu đã bị phá hủy
  showDestroyMessage(); // gọi hàm hiển thị chữ
  bongbay();

});

// Toggle ngày / đêm
toggle.addEventListener("touchstart", () => {
  document.body.classList.toggle("night");
  document.body.classList.toggle("day");

  if (document.body.classList.contains("day")) {
    // BAN NGÀY
    if (!rocketDestroyed) {
      rocket.style.display = "block";
      rocket.style.left = "-120px";
      setTimeout(startRocket, 100);
    }
    // Không cần removeAllBalloons nữa, vì CSS sẽ fade out
  } else {
    // BAN ĐÊM
    rocket.style.display = "none";
    if (rocketDestroyed && !document.querySelector(".black-balloon")) {
      createBlackBalloon();
    }
  }
});


// Load
window.onload = startRocket;

document.addEventListener("gameEnded", () => {
  showDestroyMessage();
  createBlackBalloon();
  
  
  // hoặc logic khác
});

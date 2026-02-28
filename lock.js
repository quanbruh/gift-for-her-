// ===== STYLE LOCK =====
const style = document.createElement("style");
style.textContent = `
body {

    margin:0;
    padding:0;
    height:100%;
    
    

    height: 100vh;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: url("galaxy.jpg") no-repeat center center fixed;
    background-size: cover;
    font-family: Arial;
    position: relative;
}

.container{
    display:flex;
    width:100%;
    height:100%;
}

.left {
    width:50%;
    display:flex;
    justify-content:center;   /* căn giữa ngang */
    align-items:center;       /* căn giữa dọc */
}


.right {
    width:50%;
    position:relative;
    display:flex;
    justify-content:center;   /* căn giữa ngang */
    align-items:center;       /* căn giữa dọc */
}


#canvas{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:1;
}

/* Lock */
.lock-screen {

    position:relative;
    z-index:2;
    

    width: 66%;                  
    height: 100%;                
    display: flex;
    flex-direction: column;
    justify-content: center;     
    align-items: center;         
    text-align: center;
    color: white;
    transition: all 0.8s ease;
    gap: 15px;
}

.fade-out{
    opacity:0;
    transform:scale(1.1);
}

/* Title */
.title {
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 10px;
}

/* Dots */
.dots{
    display:flex;
    justify-content:center;
    margin-bottom:10px;
}

.dot{
    width:15px;
    height:15px;
    border-radius:50%;
    border:2px solid white;
    margin:5px;
}

.dot.active{
    background:white;
}

/* Keypad */
.keypad{
    display:grid;
    grid-template-columns:repeat(3,70px);
    gap:15px;
    justify-content:center;
}

.key{
    width:70px;
    height:70px;
    border-radius:50%;
    background:rgba(255,255,255,0.2);
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:24px;
    cursor:pointer;
    transition:0.2s;
}

.key:active{
    background:rgba(255,255,255,0.4);
}

/* Shake */
.shake{
    animation:shake 0.3s;
}

@keyframes shake{
    0%{transform:translateX(0);}
    25%{transform:translateX(-10px);}
    50%{transform:translateX(10px);}
    75%{transform:translateX(-10px);}
    100%{transform:translateX(0);}
}

/* Error message */
.error-message {
    font-size: 22px;
    color: red;
    margin-top: 10px;
    opacity: 0;
    transition: opacity 0.5s;
}
.error-message.show {
    opacity: 1;
}

/* Hint bên trái, 1/3 từ trên xuống */
.hint-left {
    position: absolute;
    top: 20%; /* 1/3 từ trên xuống */
    left: 300px;
    font-size: 20px;
    color: yellow;
    max-width: 200px;
    opacity: 0;
    transition: opacity 0.5s;
}
.hint-left.show {
    opacity: 1;
}

/* Hiệu ứng chữ mở khóa thành công */
.success-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    font-size: 32px;
    font-weight: bold;
    color: lime;
    opacity: 0;
    animation: explode 1s forwards;
}

@keyframes explode {
    0% {opacity:0; transform:translate(-50%,-50%) scale(0.5);}
    50% {opacity:1; transform:translate(-50%,-50%) scale(1.5);}
    100% {opacity:0; transform:translate(-50%,-50%) scale(2);}
}
`;
document.head.appendChild(style);


// ===== UI =====
const lockScreen = document.createElement("div");
lockScreen.className = "lock-screen";

lockScreen.innerHTML = `
<div class="title">LOCK</div>

<div class="dots">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
</div>

<div class="keypad">
    <div class="key">1</div>
    <div class="key">2</div>
    <div class="key">3</div>
    <div class="key">4</div>
    <div class="key">5</div>
    <div class="key">6</div>
    <div class="key">7</div>
    <div class="key">8</div>
    <div class="key">9</div>
    <div></div>
    <div class="key">0</div>
    <div></div>
</div>

<div class="error-message" id="errorMessage"></div>
`;

document.body.appendChild(lockScreen);



// ===== META VIEWPORT =====
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.head.appendChild(meta);


// Hint bên trái
const hintLeft = document.createElement("div");
hintLeft.className = "hint-left";
hintLeft.id = "hintLeft";
document.body.appendChild(hintLeft);


// ===== LOGIC =====
const correctPass = "11111111";
let input = "";
let failCount = 0; // đếm số lần sai

const dots = document.querySelectorAll(".dot");
const keys = document.querySelectorAll(".key");
const canvas = document.getElementById("canvas");
const errorMessage = document.getElementById("errorMessage");

const hintMessages = [
    "Message gà quá",
    "Gà ơi là gà",
    "Sai nữa rồi, gà thiệt",
    "Lần này cũng sai, gà ghê",
    "Thêm lần nữa, gà bất tận"
];

function updateDots(){
    dots.forEach((dot,i)=>{
        dot.classList.toggle("active", i < input.length);
    });
}

function checkPass(){
    if(input === correctPass){
        // Hiệu ứng chữ mở khóa thành công
        const successMsg = document.createElement("div");
        successMsg.className = "success-message";
        successMsg.textContent = "Mở khóa thành công!";
        document.body.appendChild(successMsg);

        // Sau hiệu ứng thì fade-out
        setTimeout(()=>{
            lockScreen.classList.add("fade-out");
            setTimeout(()=>{
                lockScreen.style.display = "none";
                if(canvas){
                    canvas.classList.add("showCanvas");
                }
                window.location.href = "part2.html";
            },800);
        },1000);
    }
    else{
        failCount++;
        lockScreen.classList.add("shake");
        errorMessage.textContent = "Sai mật khẩu!";
        errorMessage.classList.add("show");

        // Hiện hint theo số lần sai (tối đa 5)
        if(failCount <= 5){
            hintLeft.textContent = hintMessages[failCount-1];
            hintLeft.classList.add("show");
        }

        if(failCount == 1){
            quandeptrai();
        }
        

        setTimeout(()=>{
            lockScreen.classList.remove("shake");
            errorMessage.classList.remove("show");
        },2000);
    }

    input="";
    updateDots();
}

keys.forEach(key=>{
    key.addEventListener("click",()=>{
        if(input.length < 8){
            input += key.textContent;
            updateDots();
            if(input.length === 8){
                setTimeout(checkPass,200);
            }
        }
    });
});

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

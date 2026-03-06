/* ===== CREATE STYLE ===== */

const style = document.createElement("style");
style.innerHTML = `

body{
  margin:0;
  background:#111;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  user-select:none;
  font-family:Arial;
}

.wrapper{
  position:relative;
  width:400px;
  height:380px;
}

.date-box{
  position:absolute;
  top:-80px;
  left:50%;
  transform:translateX(-50%);
  background:white;
  padding:10px 25px;
  border-radius:8px;
  font-weight:bold;
  font-size:22px;
  box-shadow:0 5px 15px rgba(0,0,0,0.4);
}

.time-box{
  position:absolute;
  top:-35px;
  left:50%;
  transform:translateX(-50%);
  background:#222;
  color:white;
  padding:8px 20px;
  border-radius:8px;
  font-size:20px;
  letter-spacing:2px;
}

.clock{
  width:300px;
  height:300px;
  background:white;
  border-radius:50%;
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  display:flex;
  justify-content:center;
  align-items:center;
}

.number{
  position:absolute;
  font-weight:bold;
  font-size:20px;
}

.hand{
  position:absolute;
  bottom:50%;
  left:50%;
  transform-origin:bottom;
  transform:translateX(-50%) rotate(0deg);
}

.hour{
  width:6px;
  height:70px;
  background:black;
  border-radius:4px;
}

.minute{
  width:4px;
  height:100px;
  background:red;
  border-radius:4px;
}

.center-dot{
  width:12px;
  height:12px;
  background:black;
  border-radius:50%;
  position:absolute;
}

.crown{
  position:absolute;
  right:-80px;
  top:50%;
  transform:translateY(-50%);
  width:50px;
  height:50px;
}

.knob{
  width:50px;
  height:50px;
  background:#888;
  border-radius:50%;
  position:relative;
  cursor:grab;
}

.handle{
  position:absolute;
  width:6px;
  height:30px;
  background:#ccc;
  top:-30px;
  left:50%;
  transform:translateX(-50%);
  border-radius:3px;
}

@keyframes crazySpin {
  0% { transform: translateX(-50%) rotate(0deg); }
  100% { transform: translateX(-50%) rotate(1440deg); }
}

@keyframes fallDown {
  0% { transform: translateX(-50%) translateY(0); opacity:1; }
  100% { transform: translateX(-50%) translateY(600px); opacity:0; }
}

.hole{
  position:absolute;
  width:80px;
  height:80px;
  background:black;
  border-radius:50%;
  left:50%;
  top:150px;
  transform:translateX(-50%);
  box-shadow:0 0 40px rgba(0,0,0,0.8) inset;
  display:flex;
  justify-content:center;
  align-items:center;
  color:white;
  cursor:pointer;
  opacity:0;
  transition:opacity 0.5s;
}

`;
document.head.appendChild(style);


/* ===== CREATE HTML ===== */

document.body.innerHTML = `

<div class="wrapper">

  <div class="date-box" id="dateDisplay">5/3</div>
  <div class="time-box" id="timeDisplay">00:00</div>

  <div class="clock" id="clock">
    <div class="hand hour" id="hour"></div>
    <div class="hand minute" id="minute"></div>
    <div class="center-dot"></div>
  </div>

  <div class="hole" id="hole">?</div>

  <div class="crown">
    <div class="knob" id="knob">
      <div class="handle"></div>
    </div>
  </div>

</div>

`;


/* ===== JS LOGIC ===== */

const hourHand = document.getElementById("hour");
const minuteHand = document.getElementById("minute");
const knob = document.getElementById("knob");
const clock = document.getElementById("clock");
const dateDisplay = document.getElementById("dateDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const hole = document.getElementById("hole");

let totalMinutes = 0;
let lastAngle = null;
let accumulatedMinutesForDay = 0;

let currentDate = 5;
let currentMonth = 3;

function updateDate(){
  dateDisplay.innerText = currentDate + "/" + currentMonth;

  if(currentDate === 6 && currentMonth === 3){
    triggerEightMarch();
  }
}

updateDate();


/* CREATE CLOCK NUMBERS */

for(let i=1;i<=12;i++){

  const num = document.createElement("div");
  num.className = "number";
  num.innerText = i;

  const angle = (i*30-90)*(Math.PI/180);
  const radius = 120;

  const x = 150 + radius*Math.cos(angle);
  const y = 150 + radius*Math.sin(angle);

  num.style.left = x + "px";
  num.style.top = y + "px";

  clock.appendChild(num);

}


/* CLOCK UPDATE */

function updateDigitalTime(){

  let total = Math.floor(totalMinutes);

  while(total < 0){
    total += 1440;
  }

  total = total % 1440;

  let hours = Math.floor(total / 60);
  let minutes = total % 60;

  timeDisplay.innerText =
    hours.toString().padStart(2,"0") + ":" +
    minutes.toString().padStart(2,"0");

}


function updateClock(){

  minuteHand.style.transform =
    `translateX(-50%) rotate(${totalMinutes*6}deg)`;

  hourHand.style.transform =
    `translateX(-50%) rotate(${totalMinutes*0.5}deg)`;

  updateDigitalTime();

}


/* DRAG SYSTEM */

let dragging = false;

knob.addEventListener("mousedown",()=>{

  dragging = true;
  knob.style.cursor="grabbing";

});

document.addEventListener("mouseup",()=>{

  dragging = false;
  lastAngle = null;
  knob.style.cursor="grab";

});

document.addEventListener("mousemove",(e)=>{

  if(!dragging) return;

  const rect = knob.getBoundingClientRect();

  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  const angle = Math.atan2(dy,dx)*180/Math.PI;

  if(lastAngle !== null){

    let delta = angle - lastAngle;

    if(delta > 180) delta -= 360;
    if(delta < -180) delta += 360;

    const minuteChange = delta * 0.2;

    totalMinutes += minuteChange;
    accumulatedMinutesForDay += minuteChange;

    if(accumulatedMinutesForDay >= 1440){
      currentDate++;
      accumulatedMinutesForDay = 0;
      updateDate();
    }

    if(accumulatedMinutesForDay <= -1440){
      currentDate--;
      accumulatedMinutesForDay = 0;
      updateDate();
    }

  }

  lastAngle = angle;

  knob.style.transform = `rotate(${angle}deg)`;

  updateClock();

});


/* ===== EVENT ===== */

function triggerEightMarch(){

  clock.style.animation = "crazySpin 1.5s linear";

  setTimeout(()=>{

    clock.style.animation = "fallDown 1s ease-in forwards";

    setTimeout(()=>{

      hole.style.opacity = 1;

    },1000);

  },1500);

}


hole.addEventListener("click",()=>{

  alert("Bạn đã mở cánh cổng tiếp theo...");

});
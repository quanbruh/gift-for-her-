function error(){
    // Tạo overlay phủ toàn màn hình
    const overlay = document.createElement("div");
    overlay.id = "errorOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "9999"; // nằm trên cùng
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    document.body.appendChild(overlay);

    // Thêm CSS cho overlay
    const style = document.createElement("style");
    style.textContent = `
    .small-error{
      position:absolute;
      color:red;
      font-size:30px;
      opacity:0;
      animation:fadeIn 0.5s forwards;
    }
    #bigError{
      position:absolute;
      font-size:100px;
      font-weight:bold;
      color:red;
      opacity:0;
      text-shadow:0 0 20px red,0 0 60px darkred;
      z-index:5;
    }
    #confession{
      position:absolute;
      font-size:60px;
      font-weight:bold;
      color:black;
      opacity:0;
      z-index:10;
    }
    .flash{
      position:absolute;
      width:100%;
      height:100%;
      background:white;
      opacity:0;
      pointer-events:none;
      z-index:1;
      transition:opacity 0.6s ease;
    }
    @keyframes fadeIn{to{opacity:1;}}
    @keyframes shakeLight{
      0%{transform:translate(0,0)}
      50%{transform:translate(1px,-1px)}
      100%{transform:translate(-1px,1px)}
    }
    @keyframes shakeExplode{
      0%{transform:translate(0,0)}
      25%{transform:translate(-4px,3px)}
      50%{transform:translate(4px,-3px)}
      75%{transform:translate(-3px,-4px)}
      100%{transform:translate(0,0)}
    }
    `;
    document.head.appendChild(style);

    // Các phần tử trong overlay
    const bigError = document.createElement("div");
    bigError.id = "bigError";
    bigError.textContent = "ERROR";
    overlay.appendChild(bigError);

    const flash = document.createElement("div");
    flash.className = "flash";
    flash.id = "flash";
    overlay.appendChild(flash);

    const confession = document.createElement("div");
    confession.id = "confession";
    confession.textContent = "tôi thích cô";
    overlay.appendChild(confession);

    // Logic hiệu ứng
    let count = 0;
    const maxErrors = 200;

    const interval = setInterval(() => {
        const small = document.createElement("div");
        small.className="small-error";
        small.innerText="error";
        small.style.left = Math.random()*window.innerWidth + "px";
        small.style.top = Math.random()*window.innerHeight + "px";
        overlay.appendChild(small);

        count++;
        overlay.style.animation = "shakeLight 0.6s infinite";

        if(count >= maxErrors){
            clearInterval(interval);
            setTimeout(showBigError,800);
        }
    },40);

    function showBigError(){
        bigError.style.opacity="1";
        setTimeout(explode,1800);
    }

    function explode(){
        overlay.style.animation="shakeExplode 0.15s infinite";
        const rect = bigError.getBoundingClientRect();
        const centerX = rect.left + rect.width/2;
        const centerY = rect.top + rect.height/2;

        bigError.style.display="none";
        flash.style.opacity="1";
        overlay.style.background="white";

        for(let i=0;i<300;i++){
            const particle = document.createElement("div");
            particle.innerText="✖";
            particle.style.position="absolute";
            particle.style.color="orange";
            particle.style.left=centerX+"px";
            particle.style.top=centerY+"px";
            overlay.appendChild(particle);

            const angle = Math.random()*2*Math.PI;
            const distance = Math.random()*900+200;
            const x = Math.cos(angle)*distance;
            const y = Math.sin(angle)*distance;

            particle.animate([
                {transform:"translate(0,0)",opacity:1},
                {transform:`translate(${x}px,${y}px)`,opacity:0}
            ],{duration:1400});

            setTimeout(()=>particle.remove(),1400);
        }
        setTimeout(showConfession,1200);
    }

    function showConfession(){
        document.dispatchEvent(new Event("error_end"));
        overlay.style.animation="none";
        confession.style.opacity="1";
        setTimeout(endGame,3000);
    }

    function endGame(){
        overlay.remove(); // chỉ xoá overlay, giữ nguyên game cũ
    }
}

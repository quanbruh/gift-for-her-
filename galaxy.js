import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function galaxy() {
//   import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
  
  // ===== SCENE =====
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 300;
  
  const renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // ===== SAO (Explosion) =====
  const particlesCount = 500;
  const positions = new Float32Array(particlesCount * 3);
  const velocities = [];
  for (let i=0; i<particlesCount; i++) {
    positions[i*3] = 0;
    positions[i*3+1] = 0;
    positions[i*3+2] = 0;
    velocities.push({
      x:(Math.random()-0.5)*8,
      y:(Math.random()-0.5)*8+6,
      z:(Math.random()-0.5)*8
    });
  }
  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
  
  // 👉 chỉnh cỡ hạt sao ở đây
  const particlesMaterial = new THREE.PointsMaterial({ 
    size: 2,   // tăng số này để hạt sao to hơn
    color: 0xffffff 
  });
  const stars = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(stars);
  
  // ===== CHỮ =====
  const words = ["GALAXY","STAR","SPACE","LOVE","HOPE","DREAM","✨"];
  const texts = [];
  const textVelocities = [];
  
  function createTextSprite(message) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 256; canvas.height = 128;
  
    // 👉 chỉnh phông và cỡ chữ ở đây
    ctx.font = "Bold 48px Arial"; // thay số 48 để chữ to hơn, thay Arial để đổi font
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(message, canvas.width/2, canvas.height/2);
  
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map:texture, transparent:true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(80,40,1); // chỉnh scale để phóng to/thu nhỏ chữ
    scene.add(sprite);
    return sprite;
  }
  
  // tạo chữ ban đầu cho vụ nổ
  for (let i=0;i<30;i++){
    const word = words[Math.floor(Math.random()*words.length)];
    const sprite = createTextSprite(word);
    sprite.position.set(0,0,0);
    texts.push(sprite);
    textVelocities.push({
      x:(Math.random()-0.5)*8,
      y:(Math.random()-0.5)*8+6,
      z:(Math.random()-0.5)*8
    });
  }
  
  // ===== XOAY SCENE =====
  let isDragging=false, prevX=0, prevY=0;
  function onPointerDown(e){isDragging=true; prevX=e.clientX||e.touches[0].clientX; prevY=e.clientY||e.touches[0].clientY;}
  function onPointerMove(e){
    if(!isDragging) return;
    const clientX=e.clientX||e.touches[0].clientX;
    const clientY=e.clientY||e.touches[0].clientY;
    scene.rotation.y += (clientX-prevX)*0.005;
    scene.rotation.x += (clientY-prevY)*0.005;
    prevX=clientX; prevY=clientY;
  }
  function onPointerUp(){isDragging=false;}
  renderer.domElement.addEventListener("mousedown",onPointerDown);
  renderer.domElement.addEventListener("mousemove",onPointerMove);
  renderer.domElement.addEventListener("mouseup",onPointerUp);
  renderer.domElement.addEventListener("touchstart",onPointerDown);
  renderer.domElement.addEventListener("touchmove",onPointerMove);
  renderer.domElement.addEventListener("touchend",onPointerUp);
  
  // ===== ANIMATE =====
  let explosionPhase = true;
  let explosionFrames = 0;
  
  function animate(){
    requestAnimationFrame(animate);
  
    if(explosionPhase){
      // update sao
      const pos = particlesGeometry.attributes.position.array;
      for (let i=0;i<particlesCount;i++){
        pos[i*3]+=velocities[i].x;
        pos[i*3+1]+=velocities[i].y;
        pos[i*3+2]+=velocities[i].z;
        velocities[i].y -= 0.05;
      }
      particlesGeometry.attributes.position.needsUpdate=true;
  
      // update chữ
      texts.forEach((sprite,idx)=>{
        sprite.position.x+=textVelocities[idx].x;
        sprite.position.y+=textVelocities[idx].y;
        sprite.position.z+=textVelocities[idx].z;
        textVelocities[idx].y -=0.05;
      });
  
      explosionFrames++;
      if(explosionFrames>150){ // sau vài giây
        explosionPhase=false;
      }
    } else {
      // chữ rơi xuống
      texts.forEach((sprite)=>{
        sprite.position.y -=0.5;
      });
      // sao rơi xuống
      const pos = particlesGeometry.attributes.position.array;
      for (let i=0;i<particlesCount;i++){
        pos[i*3+1]-=0.3;
      }
      particlesGeometry.attributes.position.needsUpdate=true;
  
      // spawn thêm chữ mới
      if(Math.random()<0.05){
        const word = words[Math.floor(Math.random()*words.length)];
        const sprite = createTextSprite(word);
        sprite.position.set((Math.random()-0.5)*400,200,(Math.random()-0.5)*400);
        texts.push(sprite);
      }
  
      // spawn thêm sao mới
      if(Math.random()<0.1){
        const pos = particlesGeometry.attributes.position.array;
        const idx = Math.floor(Math.random()*particlesCount);
        pos[idx*3]=(Math.random()-0.5)*800;
        pos[idx*3+1]=200;
        pos[idx*3+2]=(Math.random()-0.5)*800;
        particlesGeometry.attributes.position.needsUpdate=true;
      }
    }
  
    renderer.render(scene,camera);
  }
  animate();
  
  // ===== SAU 60 GIÂY TẠO NÚT =====
  setTimeout(()=>{
    const btn = document.createElement("button");
    btn.textContent = "🚀";
    btn.style.position="absolute";
    btn.style.bottom="20px";
    btn.style.right="20px";
    btn.style.padding="10px 20px";
    btn.style.zIndex="9999";
    document.body.appendChild(btn);
  
    btn.addEventListener("click",()=>{
      otherFunction(); // 👉 thay bằng function bạn muốn gọi
    });
  },5000);
  
  // ===== Resize =====
  window.addEventListener("resize",()=>{
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
  
  // ===== Function khác (ví dụ) =====
  function otherFunction(){
    alert("Function khác đã được gọi!");
  }
  
}


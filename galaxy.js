
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

export function galaxy(){


    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Tải texture ảnh (ngôi sao PNG của bạn)
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load("galaxy.jpg"); // đổi đường dẫn ảnh của bạn

    // Geometry cho particles
    const particlesCount = 3000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 600; // phân bố rộng
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Material với ảnh
    const particlesMaterial = new THREE.PointsMaterial({
    size: 2.5,
    map: starTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
    });

    // Mesh hạt
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Animation
    function animate() {
    requestAnimationFrame(animate);
    particlesMesh.rotation.y += 0.0008; // xoay nhẹ
    particlesMesh.rotation.x += 0.0003;
    renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    });


}

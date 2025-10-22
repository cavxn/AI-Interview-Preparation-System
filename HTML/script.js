import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// === SCENE SETUP ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 60;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg'), antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// === LIGHTING ===
scene.add(new THREE.AmbientLight(0x00ffff, 0.4));
const pointLight = new THREE.PointLight(0xffffff, 1.2, 200);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// === CENTER GLOW SPHERE ===
const glowGeometry = new THREE.SphereGeometry(3, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
scene.add(glowSphere);

// === WAVY RINGS ===
const rings = [];
const ringCount = 80;

for (let i = 0; i < ringCount; i++) {
  const radius = 4 + i * 0.4;
  const geometry = new THREE.RingGeometry(radius, radius + 0.15, 256);
  const colorHue = (i * 5) % 360;

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(`hsl(${colorHue}, 100%, 60%)`),
    transparent: true,
    opacity: 0.25 + Math.random() * 0.2,
    wireframe: true
  });

  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.random() * Math.PI;
  ring.rotation.y = Math.random() * Math.PI;
  scene.add(ring);

  // Save for animation
  rings.push({
    mesh: ring,
    speed: 0.001 + i * 0.0001,
    offset: Math.random() * Math.PI * 2,
    baseRotationX: ring.rotation.x,
    baseRotationY: ring.rotation.y,
    material: material
  });
}

// === ANIMATION LOOP ===
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.015;

  // Glow pulsing
  glowMaterial.opacity = 0.4 + 0.2 * Math.sin(time * 2);

  rings.forEach((ring, i) => {
    const wave = Math.sin(time * 2 + ring.offset + i * 0.1);
    const scale = 1 + 0.02 * wave;

    // Slight wavy distortion
    ring.mesh.scale.set(scale, scale, scale);

    // Rotate slightly in a wavy pattern
    ring.mesh.rotation.x = ring.baseRotationX + 0.1 * Math.sin(time * 0.5 + i);
    ring.mesh.rotation.y = ring.baseRotationY + 0.1 * Math.cos(time * 0.5 + i);

    // Slight color shimmer
    const hueShift = (i * 5 + time * 20) % 360;
    ring.material.color.setHSL(hueShift / 360, 1, 0.6);

    // Opacity wave pulse
    ring.material.opacity = 0.3 + 0.2 * Math.sin(time + i);
  });

  renderer.render(scene, camera);
}

animate();

// === HANDLE RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

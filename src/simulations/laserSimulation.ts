// src/simulations/laserSimulation.ts
import * as THREE from 'three';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let laserBeam: THREE.Mesh | null = null;
let coreBeam: THREE.Mesh | null = null;

let voltageValue = 17;
let laserActive = false;

const dopantParticles: THREE.Mesh[] = [];
const particleVelocities: THREE.Vector3[] = [];
const fibonacciSequence: number[] = [];

export function initLaserScene(canvas: HTMLCanvasElement) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const crystalGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const crystalMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.4,
  });
  const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
  scene.add(crystal);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  generateFibonacciSequence(60);
  generateDopantParticles();

  animate();
}

function generateFibonacciSequence(count: number) {
  fibonacciSequence.length = 0;
  fibonacciSequence.push(0, 1);
  for (let i = 2; i < count; i++) {
    fibonacciSequence.push(fibonacciSequence[i - 1] + fibonacciSequence[i - 2]);
  }
}

function generateDopantParticles() {
  const dopantColors: { [key: string]: number } = {
    'B': 0xff00ff, // Boro
    'N': 0x00ffff, // Nitrogênio
    'F': 0xffff00, // Flúor
  };

  const dopantTypes = ['B', 'N', 'F'];

  for (let i = 0; i < 60; i++) {
    const type = dopantTypes[i % 3];
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: dopantColors[type] });
    const particle = new THREE.Mesh(geometry, material);

    // Inicializa em uma espiral de Fibonacci
    const angle = fibonacciSequence[i] * 0.1;
    const radius = 0.5 + (i * 0.01);
    particle.position.set(
      radius * Math.cos(angle),
      radius * Math.sin(angle),
      (Math.random() - 0.5) * 1.0
    );

    const velocity = new THREE.Vector3(
      Math.sin(angle) * 0.005,
      Math.cos(angle) * 0.005,
      (Math.random() - 0.5) * 0.005
    );

    scene.add(particle);
    dopantParticles.push(particle);
    particleVelocities.push(velocity);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const time = performance.now() * 0.002;

  dopantParticles.forEach((particle, index) => {
    const velocity = particleVelocities[index];

    const factor = laserActive ? 1.5 + voltageValue / 30 : 1.0;
    const angle = fibonacciSequence[index] * 0.05 + time * 0.5;
    const radius = 0.4 + (index * 0.002);

    particle.position.x = radius * Math.cos(angle);
    particle.position.y = radius * Math.sin(angle);
    particle.position.z += velocity.z * factor;

    if (Math.abs(particle.position.z) > 0.75) {
      velocity.z = -velocity.z;
    }
  });

  if (laserActive && laserBeam && coreBeam) {
    const pulse = 1 + Math.sin(time) * 0.1;
    laserBeam.scale.set(pulse, 1, pulse);
    coreBeam.scale.set(1 + Math.cos(time * 1.5) * 0.2, 1, 1 + Math.cos(time * 1.5) * 0.2);
  }

  renderer.render(scene, camera);
}

export function toggleLaserBeam() {
  laserActive = !laserActive;

  if (laserBeam) {
    scene.remove(laserBeam);
    laserBeam = null;
    if (coreBeam) {
      scene.remove(coreBeam);
      coreBeam = null;
    }
    return;
  }

  const beamGeometry = new THREE.CylinderGeometry(0.05, 0.05, 5, 32);
  const beamMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  laserBeam = new THREE.Mesh(beamGeometry, beamMaterial);
  laserBeam.rotation.x = Math.PI / 2;
  laserBeam.position.z = -2.5;
  scene.add(laserBeam);

  const coreGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9
  });
  coreBeam = new THREE.Mesh(coreGeometry, coreMaterial);
  coreBeam.rotation.x = Math.PI / 2;
  coreBeam.position.z = -0.5;
  scene.add(coreBeam);
}

// Atualiza a voltagem
export function updateVoltage(value: number) {
  voltageValue = value;
}

// Função para calcular comprimento de onda e energia
function calculateWavelengthAndEnergy(voltage: number): { wavelength: number, energy: number } {
  const energy = voltage; // em eV
  const wavelength = 1240 / energy; // em nm
  return { wavelength, energy };
}

// Exporta os valores atualizados de λ e E
export function getWavelengthAndEnergy() {
  return calculateWavelengthAndEnergy(voltageValue);
}

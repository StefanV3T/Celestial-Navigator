import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

textureLoader.load('/Assets/sky_pano_-_milkyway/textures/lambert1_emissive.jpeg', (texture) => {
  scene.background = texture;
})

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

let distanceFromEarth = 1; // Default distance from Earth

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disable panning, only allow rotating and zooming

const gltfLoader = new GLTFLoader();

// Load the Sun model
gltfLoader.load('Assets/sun/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(1, 1, 1); // Bigger Sun
  scene.add(GLTFScene.scene);
});

let mercuryModel;
let orbitLineMercury;
const orbitRadiusMercury = 83;
//load the Mercury model
gltfLoader.load('Assets/mercury/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.00351, 0.00351, 0.00351);
  GLTFScene.scene.position.set(orbitRadiusMercury, 0, 0);

  scene.add(GLTFScene.scene);
  mercuryModel = GLTFScene.scene;

  createMercuryOrbitLine();
});

let venusModel;
let orbitLineVenus;
const orbitRadiusVenus = 108;
gltfLoader.load('Assets/venus/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.00871, 0.00871, 0.00871);
  GLTFScene.scene.position.set(orbitRadiusVenus, 0, 0);

  scene.add(GLTFScene.scene);
  venusModel = GLTFScene.scene;

  createVenusOrbitLine();
});

let earthModel;
const orbitRadius = 150; // Sun to Earth

// Load the Earth model
gltfLoader.load('Assets/earth/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.0092, 0.0092, 0.0092); // Smaller Earth
  GLTFScene.scene.position.set(orbitRadius, 0, 0); // Earth at this position

  GLTFScene.scene.rotation.z = THREE.MathUtils.degToRad(23.5);
  scene.add(GLTFScene.scene);

  earthModel = GLTFScene.scene;

  // Update OrbitControls to make Earth the target
  controls.target.copy(GLTFScene.scene.position);
  controls.update();
});

let moonModel;
let orbitLineMoon; // Variable to store the Moon's orbit line
const orbitRadiusMoon = 0.5; // Scaled orbit radius from Earth to Moon
let moonAngle = 0; // Angle for the Moon's orbit
// Load the Moon model
gltfLoader.load('Assets/photorealistic_moon/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.00025, 0.00025, 0.00025); // Scale the Moon
  scene.add(GLTFScene.scene);
  moonModel = GLTFScene.scene;

  createMoonOrbitLine(); // Create the Moon's orbit line
});

let marsModel;
let orbitLineMars;
const orbitRadiusMars = 227;
gltfLoader.load('Assets/mars_the_red_planet_free/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.00488, 0.00488, 0.00488);
  GLTFScene.scene.position.set(orbitRadiusMars, 0, 0);

  scene.add(GLTFScene.scene);
  marsModel = GLTFScene.scene;

  createMarsOrbitLine();
});

let jupiterModel;
let orbitLineJupiter;
const orbitRadiusJupiter = 778;
gltfLoader.load('Assets/realistic_jupiter/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.1006, 0.1006, 0.1006);
  GLTFScene.scene.position.set(orbitRadiusJupiter, 0, 0);

  scene.add(GLTFScene.scene);
  jupiterModel = GLTFScene.scene;

  createJupiterOrbitLine();
});

let saturnModel;
let orbitLineSaturn;
const orbitRadiusSaturn = 1427;
gltfLoader.load('Assets/realistic_saturn_8k/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.0838, 0.0838, 0.0838);
  GLTFScene.scene.position.set(orbitRadiusSaturn, 0, 0);

  scene.add(GLTFScene.scene);
  saturnModel = GLTFScene.scene;

  createSaturnOrbitLine();
});

let uranusModel;
let orbitLineUranus;
const orbitRadiusUranus = 1600;
gltfLoader.load('Assets/urano/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.0365, 0.0365, 0.0365);
  GLTFScene.scene.position.set(orbitRadiusUranus, 0, 0);

  scene.add(GLTFScene.scene);
  uranusModel = GLTFScene.scene;

  createUranusOrbitLine();
})

let neptuneModel;
let orbitLineNeptune;
const orbitRadiusNeptune = 2000;
gltfLoader.load('Assets/neptuno/scene.gltf', (GLTFScene) => {
  GLTFScene.scene.scale.set(0.0354, 0.0354, 0.0354);
  GLTFScene.scene.position.set(orbitRadiusNeptune, 0, 0);

  scene.add(GLTFScene.scene);
  neptuneModel = GLTFScene.scene;

  createNeptuneOrbitLine();
})


// Create a grid helper
// const gridHelper = new THREE.GridHelper(500, 500);
// scene.add(gridHelper);

const ambientlight = new THREE.AmbientLight(0xffffff);

// Create a point light for the Sun
const pointLight = new THREE.PointLight(0xffffff, 10, 2500, 0);
pointLight.position.set(0, 0, 0);
scene.add(pointLight, ambientlight);

// Camera angles
let angleX = 0;
let angleY = Math.PI / 6; // Initial angle for the camera around the Earth (30 degrees)

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to create the orbit line
function createOrbitLine() {
  const points = [];
  const orbitRadius = 150; // Same radius as the Earth orbit

  // Create points for the orbit
  const numPoints = 2000; // Number of points to define the orbit
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2; // Angle for the circle
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z)); // Push point in the XZ plane
  }

  // Create a geometry and a line
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xADD8E6, opacity: 1, transparent: true, linewidth: 2 });

  // Create the line
  const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  // Add the line to the scene
  scene.add(orbitLine);
}

// Call the function to create and add the orbit line
createOrbitLine();

function createMercuryOrbitLine() {
  const points = [];
  const orbitRadiusMercury = 83;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusMercury * Math.cos(angle);
    const z = orbitRadiusMercury * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xC0C0C0, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineMercury = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineMercury);
}

function createVenusOrbitLine() {
  const points = [];
  const orbitRadiusVenus = 108;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusVenus * Math.cos(angle);
    const z = orbitRadiusVenus * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xFFA500, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineVenus = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineVenus);
}

// Function to create the Moon orbit line
function createMoonOrbitLine() {
  const points = [];
  const orbitRadiusMoon = 0.5; // Radius for Moon's orbit

  // Create points for the orbit
  const numPoints = 2000; // Number of points to define the orbit
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2; // Angle for the circle
    const x = orbitRadiusMoon * Math.cos(angle);
    const z = orbitRadiusMoon * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z)); // Push point in the XZ plane
  }

  // Create a geometry and a line
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xFFD700, opacity: 1, transparent: true, linewidth: 2 });

  // Create the line
  orbitLineMoon = new THREE.LineLoop(orbitGeometry, orbitMaterial); // Store in variable

  // Add the line to the scene
  scene.add(orbitLineMoon);

  // Position the Moon orbit line to follow the Earth
  orbitLineMoon.position.copy(earthModel.position);
}

function createMarsOrbitLine() {
  const points = [];
  const orbitRadiusMars = 227;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusMars * Math.cos(angle);
    const z = orbitRadiusMars * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xFF4500, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineMars = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineMars);
}

function createJupiterOrbitLine() {
  const points = [];
  const orbitRadiusJupiter = 778;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusJupiter * Math.cos(angle);
    const z = orbitRadiusJupiter * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x8B4513, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineJupiter = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineJupiter);
}

function createSaturnOrbitLine() {
  const points = [];
  const orbitRadiusSaturn = 1427;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusSaturn * Math.cos(angle);
    const z = orbitRadiusSaturn * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xFFFDD0, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineSaturn = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineSaturn);
}

function createUranusOrbitLine() {
  const points = [];
  const orbitRadiusUranus = 1600;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusUranus * Math.cos(angle);
    const z = orbitRadiusUranus * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x008080, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineUranus = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineUranus);
}

function createNeptuneOrbitLine() {
  const points = [];
  const orbitRadiusNeptune = 2000;

  const numPoints = 2000;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const x = orbitRadiusNeptune * Math.cos(angle);
    const z = orbitRadiusNeptune * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x0000FF, opacity: 1, transparent: true, linewidth: 2 });

  orbitLineNeptune = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitLineNeptune);
}

// Define the axial tilt for each planet (in degrees)
// const axialTilts = {
//   mercury: 7,   // Mercury: 7°
//   venus: 177.4, // Venus: 177.4° (very tilted)
//   earth: 23.5,  // Earth: 23.5°
//   mars: 25.2,   // Mars: 25.2°
//   jupiter: 3.1, // Jupiter: 3.1°
//   saturn: 26.7, // Saturn: 26.7°
//   uranus: 97.8, // Uranus: 97.8° (tilted on its side)
//   neptune: 28.3 // Neptune: 28.3°
// };

// Function to calculate planet position with inclination
function calculatePosition(radius, angle, tilt) {
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  return new THREE.Vector3(x, 0, z);
}

const planetMenu = document.getElementById('planetMenu');

// Add event listener to the dropdown menu
planetMenu.addEventListener('change', (event) => {
  console.log('changed');
  const selectedPlanet = event.target.value;
  moveCameraToPlanet(selectedPlanet);
});

let orbitSpeed = 0.0001;
let angle = 0;
let mercuryAngle = 0;
let venusAngle = 0;
let marsAngle = 0;
let jupiterAngle = 0;
let saturnAngle = 0;
let uranusAngle = 0;
let neptuneAngle = 0;
const mercuryOrbitSpeed = orbitSpeed * 2;
const venusOrbitSpeed = orbitSpeed * 1.6;
const marsOrbitSpeed = orbitSpeed * 0.532;
const jupiterOrbitSpeed = orbitSpeed * 0.084;
const saturnOrbitSpeed = orbitSpeed * (365.25 / 10759);
const uranusOrbitSpeed = orbitSpeed * 0.025;
const neptuneOrbitSpeed = orbitSpeed * 0.012;

let selectedPlanet = 'earth'; // Default to Earth at first

function moveCameraToPlanet(planet) {
  let planetModel;

  // Select the planet model based on the selected planet
  switch (planet) {
    case 'mercury':
      planetModel = mercuryModel;
      break;
    case 'venus':
      planetModel = venusModel;
      break;
    case 'earth':
      planetModel = earthModel;
      break;
    case 'mars':
      planetModel = marsModel;
      break;
    case 'jupiter':
      planetModel = jupiterModel;
      break;
    case 'saturn':
      planetModel = saturnModel;
      break;
    case 'uranus':
      planetModel = uranusModel;
      break;
    case 'neptune':
      planetModel = neptuneModel;
      break;
    default:
      console.error("Planet not found: " + planet);
      return;
  }

  // Update the selected planet
  selectedPlanet = planet;

  if (planetModel) {
    const cameraOffset = planetModel.scale.x * 300;

    camera.position.set(
      planetModel.position.x + cameraOffset,
      planetModel.position.y + cameraOffset / 2,
      planetModel.position.z + cameraOffset
    );

    controls.target.copy(planetModel.position);
    controls.update();
  }
}

let minZoomDistance;
// Scroll control: Zoom in or out depending on the scroll direction
window.addEventListener('wheel', (event) => {
  const zoomSpeed = 0.05;
  switch (selectedPlanet) {
    case 'earth':
      minZoomDistance = 0.15;
      break;
    case 'mercury':
      minZoomDistance = 0.01;
      break;
    case 'venus':
      minZoomDistance = 0.01;
      break;
    case 'mars':
      minZoomDistance = 0.005;
      break;
    case 'jupiter':
      minZoomDistance = 0.3;
      break;
    case 'saturn':
      minZoomDistance = 0.1;
      break;
    case 'uranus':
      minZoomDistance = 0.05;
      break;
    case 'neptune':
      minZoomDistance = 1;
      break;
    default:
      break;
  }
  distanceFromEarth += event.deltaY * zoomSpeed;
  distanceFromEarth = Math.max(minZoomDistance, distanceFromEarth);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (earthModel) {
    // Update Earth and other planet rotations and positions
    earthModel.rotation.y += 0.0365;

    angle += orbitSpeed;
    earthModel.position.x = orbitRadius * Math.cos(angle);
    earthModel.position.z = orbitRadius * Math.sin(angle);

    // Update the Moon's orbit line position
    if (orbitLineMoon) {
      orbitLineMoon.position.copy(earthModel.position); // Move the Moon's orbit line with the Earth
    }

    // Update the Moon's orbit
    moonAngle += orbitSpeed * 12.37;
    moonModel.position.x = earthModel.position.x + orbitRadiusMoon * Math.cos(moonAngle);
    moonModel.position.z = earthModel.position.z + orbitRadiusMoon * Math.sin(moonAngle);

    // Update other planets' positions
    mercuryAngle += mercuryOrbitSpeed;
    mercuryModel.position.copy(calculatePosition(orbitRadiusMercury, mercuryAngle));

    venusAngle += venusOrbitSpeed;
    venusModel.position.copy(calculatePosition(orbitRadiusVenus, venusAngle));

    marsAngle += marsOrbitSpeed;
    marsModel.position.copy(calculatePosition(orbitRadiusMars, marsAngle));

    jupiterAngle += jupiterOrbitSpeed;
    jupiterModel.position.copy(calculatePosition(orbitRadiusJupiter, jupiterAngle));

    saturnAngle += saturnOrbitSpeed;
    saturnModel.position.copy(calculatePosition(orbitRadiusSaturn, saturnAngle));

    uranusAngle += uranusOrbitSpeed;
    uranusModel.position.copy(calculatePosition(orbitRadiusUranus, uranusAngle));

    neptuneAngle += neptuneOrbitSpeed;
    neptuneModel.position.copy(calculatePosition(orbitRadiusNeptune, neptuneAngle));

    let x;
    let y;
    let z;
    // Only update the camera if the selected planet is Earth
    switch (selectedPlanet) {
      case 'earth':
        x = earthModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = earthModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = earthModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);

        camera.position.set(x, y, z);
        controls.target.copy(earthModel.position);
        break;
      case 'mercury':
        x = mercuryModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = mercuryModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = mercuryModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(mercuryModel.position);
        break;
      case 'venus':
        x = venusModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = venusModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = venusModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(venusModel.position);
        break;
      case 'mars':
        x = marsModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = marsModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = marsModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(marsModel.position);
        break;
      case 'jupiter':
        x = jupiterModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = jupiterModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = jupiterModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(jupiterModel.position);
        break;
      case 'saturn':
        x = saturnModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = saturnModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = saturnModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(saturnModel.position);
        break;
      case 'uranus':
        x = uranusModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = uranusModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = uranusModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(uranusModel.position);
        break;
      case 'neptune':
        x = neptuneModel.position.x + distanceFromEarth * Math.cos(angleY) * Math.cos(angleX);
        y = neptuneModel.position.y + distanceFromEarth * Math.sin(angleY);
        z = neptuneModel.position.z + distanceFromEarth * Math.cos(angleY) * Math.sin(angleX);
        camera.position.set(x, y, z);
        controls.target.copy(neptuneModel.position);
        break;
      default:
        break;

    }
  }

  controls.update();
  renderer.render(scene, camera);
}


// Handle arrow key presses for rotating around the Earth
window.addEventListener('keydown', (event) => {
  const rotationSpeed = 0.05;

  switch (event.key) {
    case 'w':
      angleY = Math.min(Math.PI / 2, angleY + rotationSpeed); // Tilt up
      break;
    case 's':
      angleY = Math.max(-Math.PI / 2, angleY - rotationSpeed); // Tilt down
      break;
    case 'a':
      angleX -= rotationSpeed; // Rotate left
      break;
    case 'd':
      angleX += rotationSpeed; // Rotate right
      break;
  }
});

animate();

/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-multi-assign */
/* eslint-disable no-param-reassign */
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
// eslint-disable-next-line import/no-unresolved
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

const start = document.getElementById('start');
start.addEventListener('click', main);

function main() {
  const div = document.getElementById('temp');
  div.remove();

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const scene = new THREE.Scene();

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xe4f5e8);

  const fov = 100;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 0.1;
  const far = 1000;
  const soundListener = new THREE.AudioListener();
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.x = -5;
  camera.position.y = 10;
  camera.position.z = 20;
  camera.add(soundListener);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.update();

  const upperColor = 0x9dfcb6;
  const lowerColor = 0x389554;
  const hemLightIntensity = 1;
  const hemLight = new THREE.HemisphereLight(upperColor, lowerColor, hemLightIntensity);
  scene.add(hemLight);

  const ambColor = 0x360301;
  const ambLight = new THREE.AmbientLight(ambColor);
  scene.add(ambLight);

  const loader = new THREE.TextureLoader();
  const gltfLoader = new GLTFLoader();

  class FleshSpiralCurve extends THREE.Curve {
    constructor(scale = 0.5) {
      super();
      this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const tx = Math.cos(5 * Math.PI * t);
      const ty = 2 * t;
      const tz = Math.sin(5 * Math.PI * t);

      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const fleshSpirals = [];
  const blobs = [];
  const dice = [];
  const pyramids = [];
  const rings = [];

  const blackBoxWidth = 0.5;
  const blackBoxHeight = 10;
  const blackBoxDepth = 0.5;
  const blackBoxBufferGeometry = new THREE.BoxBufferGeometry(blackBoxWidth, blackBoxHeight, blackBoxDepth);
  const blackBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const blackBox = new THREE.Mesh(blackBoxBufferGeometry, blackBoxMaterial);
  blackBox.position.set(-10, -10, 10);
  scene.add(blackBox);

  const blackBoxSound = new THREE.PositionalAudio(soundListener);
  const fullSongElement = document.getElementById('full');
  blackBoxSound.setMediaElementSource(fullSongElement);
  fullSongElement.play();
  blackBox.add(blackBoxSound);

  const fleshBoxWidth = 7;
  const fleshBoxHeight = 20;
  const fleshBoxDepth = 3;
  const fleshBoxTexture = loader.load('images/fleshBoxTexture.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
  });
  const fleshBoxBufferGeometry = new THREE.BoxBufferGeometry(fleshBoxWidth, fleshBoxHeight, fleshBoxDepth);
  const fleshBoxMaterial = new THREE.MeshBasicMaterial({ map: fleshBoxTexture });
  const fleshBox = new THREE.Mesh(fleshBoxBufferGeometry, fleshBoxMaterial);
  fleshBox.position.set(10, -8, -9);
  scene.add(fleshBox);

  const fleshBoxViolaSound = new THREE.PositionalAudio(soundListener);
  const fleshViolaStemElement = document.getElementById('viola');
  fleshBoxViolaSound.setMediaElementSource(fleshViolaStemElement);
  fleshViolaStemElement.play();
  fleshBox.add(fleshBoxViolaSound);

  const chaosBoxWidth = 3;
  const chaosBoxHeight = 12;
  const chaosBoxDepth = 3;
  const chaosBoxTexture = loader.load('images/chaosBoxTexture.jpg', (texture) => {
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
  });
  const chaosBoxBufferGeometry = new THREE.BoxBufferGeometry(chaosBoxWidth, chaosBoxHeight, chaosBoxDepth);
  const chaosBoxMaterial = new THREE.MeshBasicMaterial({ map: chaosBoxTexture });
  const chaosBox = new THREE.Mesh(chaosBoxBufferGeometry, chaosBoxMaterial);
  chaosBox.position.set(-10, -2, -10);
  scene.add(chaosBox);

  let jerky;
  gltfLoader.load('models/usnm_1174917-100k-2048.gltf', (gltf) => {
    const jerkyTexture = loader.load('images/jerkyTexture.jpg', (texture) => {
      texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
      texture.minFilter = THREE.LinearFilter;
    });
    jerky = gltf.scene;
    jerky.traverse((m) => {
      if (m.isMesh) {
        m.material.map = jerkyTexture;
      }
    });

    const size = 12;
    jerky.scale.x = size;
    jerky.scale.y = size;
    jerky.scale.z = size;

    jerky.position.x = 10;
    jerky.position.y = -7;
    jerky.position.z = 11;

    jerky.material = 'meshBasicMaterial';

    scene.add(jerky);
    const jerkySynthSound = new THREE.PositionalAudio(soundListener);
    const jerkySynthStemElement = document.getElementById('synth');
    jerkySynthSound.setMediaElementSource(jerkySynthStemElement);
    jerkySynthStemElement.play();
    jerky.add(jerkySynthSound);
  });

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const path = new FleshSpiralCurve(1);
      const fleshSpiralSegments = 100;
      const fleshSpiralRadius = 0.4;
      const fleshSpiralRadialSegments = 20;
      const fleshSpiralBufferGeometry = new THREE.TubeBufferGeometry(path, fleshSpiralSegments, fleshSpiralRadius, fleshSpiralRadialSegments, false);
      const fleshSpiralTexture = loader.load('images/fleshSpiralTexture.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
      });
      const fleshSpiralMaterial = new THREE.MeshPhongMaterial({ map: fleshSpiralTexture });
      const fleshSpiral = new THREE.Mesh(fleshSpiralBufferGeometry, fleshSpiralMaterial);
      fleshSpiral.position.x = 5 * (i - 1);
      fleshSpiral.position.z = 5 * (j - 1);
      scene.add(fleshSpiral);
      fleshSpirals.push(fleshSpiral);

      const blobTorusRadius = 0.9;
      const blobTubularRadius = 0.45;
      const blobRadialSegments = 30;
      const blobTubularSegments = 100;
      const p = 3;
      const q = 5;
      const blobMaterial = new THREE.MeshPhongMaterial({ color: 0x570603 });
      const blobBufferGeometry = new THREE.TorusKnotBufferGeometry(blobTorusRadius, blobTubularRadius, blobRadialSegments, blobTubularSegments, p, q);
      const blob = new THREE.Mesh(blobBufferGeometry, blobMaterial);
      blob.rotation.x = (45 * Math.PI) / 180;
      blob.position.x = 5 * (i - 1);
      blob.position.y = -2;
      blob.position.z = 5 * (j - 1);
      scene.add(blob);
      blobs.push(blob);

      const dieRadius = 0.4 * j + 1;
      const dieWidthSegments = 10;
      const dieHeightSegments = 5;
      const dieTexture = loader.load('images/dieTexture.jpg', (texture) => {
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
      });
      const dieMaterial = new THREE.MeshPhongMaterial({ map: dieTexture });
      const dieBufferGeometry = new THREE.SphereBufferGeometry(dieRadius, dieWidthSegments, dieHeightSegments);
      const die = new THREE.Mesh(dieBufferGeometry, dieMaterial);
      die.position.x = 5 * (i - 1);
      die.position.y = -6;
      die.position.z = 5 * (j - 1);
      scene.add(die);
      dice.push(die);

      if ((i + j) % 2 === 1) {
        const pyramidRadius = 0.8;
        const pyramidHeight = 4;
        const pyramidRadialSegments = 3 + (2 * (i + j));
        const pyramidMaterial = new THREE.MeshPhongMaterial({ color: 0xf0d943, shininess: 100 });
        const pyramidBufferGeometry = new THREE.ConeBufferGeometry(pyramidRadius, pyramidHeight, pyramidRadialSegments);
        const pyramid = new THREE.Mesh(pyramidBufferGeometry, pyramidMaterial);
        pyramid.position.x = 2.5 * (i - 1);
        pyramid.position.y = 6;
        pyramid.position.z = 2.5 * (j - 1);
        scene.add(pyramid);
        pyramids.push(pyramid);
      } else {
        const ringRadius = 2 * (i + 0.7);
        const ringTubeRadius = 1;
        const ringRadialSegments = 30;
        const ringTubularSegments = 200;
        const ringMaterial = new THREE.MeshPhongMaterial({ color: 0x4a376d });
        const ringBufferGeometry = new THREE.TorusBufferGeometry(ringRadius, ringTubeRadius, ringRadialSegments, ringTubularSegments);
        const ring = new THREE.Mesh(ringBufferGeometry, ringMaterial);
        ring.rotation.x = (90 * Math.PI) / 180;
        ring.position.x = 10 * (i - 1);
        ring.position.y = -9;
        ring.position.z = 10 * (j - 1);
        scene.add(ring);
        rings.push(ring);
      }
    }
  }

  const blobPercussionSound1 = new THREE.PositionalAudio(soundListener);
  const blobPercussionStemElement1 = document.getElementById('percussion1');
  blobPercussionSound1.setMediaElementSource(blobPercussionStemElement1);
  blobPercussionStemElement1.play();
  blobs[0].add(blobPercussionSound1);

  renderer.render(scene, camera);
  function render(time) {
    time *= 0.00005;

    if (Math.sin(time) > 0) {
      time = 0.0001;
    }
    const bounce = Math.sin(2.5 * time * Math.PI);
    const boomerang = Math.sin(2 * time * Math.PI);

    fleshSpirals[4].position.y += bounce;
    blobs[4].position.y += bounce;
    dice[4].position.y += bounce;

    fleshSpirals[1].position.x += boomerang;
    fleshSpirals[3].position.z += boomerang;
    fleshSpirals[5].position.z -= boomerang;
    fleshSpirals[7].position.x -= boomerang;

    for (let i = 0, j = pyramids.length; i < j; i++) {
      pyramids[i].rotation.y += 0.05;
    }

    for (let i = 0, j = fleshSpirals.length; i < j; i++) {
      if (i % 2 === 0) {
        fleshSpirals[i].rotation.y += 0.1;
      } else {
        fleshSpirals[i].position.y += bounce / 10;
      }
    }

    for (let i = 0, j = blobs.length; i < j; i++) {
      if (i !== 4) {
        blobs[i].position.x += 4 * boomerang;
      }
    }

    for (let i = 0, j = dice.length; i < j; i++) {
      if (i !== 4) {
        dice[i].position.z += 4 * boomerang;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

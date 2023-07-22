<template>
  <div class="earth-model" ref="earthModel"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gltf载入库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import gsap from "gsap";

const earthModel = ref("");
let progress = ref(0);

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  45,
  earthModel.value.innerWidth / earthModel.value.innerHeight,
  0.1,
  10000
);
// 设置相机位置
camera.position.set(0, 50, 300);
// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

// 初始化渲染器
let renderer = new THREE.WebGLRenderer({ antialias: true });
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 监听屏幕的大小改变，修改渲染器的宽高，相机的比例
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const render = () => {
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
};

// 挂载完毕之后获取dom
onMounted(() => {
  // 创建轨道控制器
  const controls = new OrbitControls(camera, earthModel.value);
  controls.autoRotate = true;

  earthModel.value.appendChild(renderer.domElement);
  render();
});

// 实例化draco载入库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("./draco/");
dracoLoader.setDecoderConfig({ type: "js" });
// 实例化gltf载入库
const gltfLoader = new GLTFLoader();
// 添加draco载入库
gltfLoader.setDRACOLoader(dracoLoader);

// 创建星空背景
scene.background = new THREE.Color(0x030311);

// 使用点材质创建星空效果
const vertices = [];
for (let i = 0; i < 500; i++) {
  const vertex = new THREE.Vector3();
  vertex.x = 800 * Math.random() - 400;
  vertex.y = 800 * Math.random() - 400;
  vertex.z = 800 * Math.random() - 400;
  vertices.push(vertex.x, vertex.y, vertex.z);
}

// 星空效果
let starsGeometry = new THREE.BufferGeometry();
starsGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(new Float32Array(vertices), 3)
);

// 加载点材质纹理
const starsTexture = new THREE.TextureLoader().load("./assets/ball/stars.png");
const starsMaterial = new THREE.PointsMaterial({
  size: 2,
  sizeAttenuation: true, // 尺寸衰减
  color: 0x4d76cf,
  transparent: true,
  opacity: 1,
  map: starsTexture,
});

let stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// 创建地球
let earthGeometry = new THREE.SphereGeometry(50, 32, 32);
let earthTexture = new THREE.TextureLoader().load("./assets/ball/map.jpg");

let earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture,
});
let earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 发光地球
let lightTexture = new THREE.TextureLoader().load("./assets/ball/earth.jpg");
let lightEarthGeometry = new THREE.SphereGeometry(53, 32, 32);
let lightEarthMaterial = new THREE.MeshBasicMaterial({
  map: lightTexture,
  alphaMap: lightTexture,
  blending: THREE.AdditiveBlending,
  transparent: true,
});
let lightEarth = new THREE.Mesh(lightEarthGeometry, lightEarthMaterial);
scene.add(lightEarth);

// 添加地球内外发光精灵
let spriteTexture = new THREE.TextureLoader().load("./assets/ball/glow.png");
let spriteMaterial = new THREE.SpriteMaterial({
  map: spriteTexture,
  color: 0x4d76cf,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});
let sprite = new THREE.Sprite(spriteMaterial);
sprite.scale.set(155, 155, 0);
scene.add(sprite);

// 内发光
let spriteTexture1 = new THREE.TextureLoader().load(
  "./assets/ball/innerGlow.png"
);
let spriteMaterial1 = new THREE.SpriteMaterial({
  map: spriteTexture1,
  color: 0x4d76cf,
  transparent: true,
  depthWrite: false,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});
let sprite1 = new THREE.Sprite(spriteMaterial1);
sprite1.scale.set(128, 128, 0);
scene.add(sprite1);
new THREE.Vector3(1, 1, 1);

const lon2xyz = (R, longitude, latitude) => {
  let lon = (longitude * Math.PI) / 180; // 转弧度值
  const lat = (latitude * Math.PI) / 180; // 转弧度值
  lon = -lon; // js坐标系z坐标轴对应经度-90度，而不是90度

  // 经纬度坐标转球面坐标计算公式
  const x = R * Math.cos(lat) * Math.cos(lon);
  const y = R * Math.sin(lat);
  const z = R * Math.cos(lat) * Math.sin(lon);
  // 返回球面坐标
  return new THREE.Vector3(x, y, z);
};

for (let i = 0; i < 30; i++) {
  // 实现光柱
  let lightPillarTexture = new THREE.TextureLoader().load(
    "/assets/ball/light.png"
  );
  let lightPillarGeometry = new THREE.PlaneGeometry(3, 20);
  let lightPillarMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: lightPillarTexture,
    alphaMap: lightPillarTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  let lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial);
  lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2));

  // 创建波纹扩散效果
  let circlePlane = new THREE.PlaneGeometry(6, 6);
  let circleTexture = new THREE.TextureLoader().load(
    "./assets/ball/label-old.png"
  );
  let circleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: circleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  let circleMesh = new THREE.Mesh(circlePlane, circleMaterial);
  circleMesh.rotation.x = -Math.PI / 2;
  circleMesh.position.set(0, -7, 0);

  lightPillar.add(circleMesh);

  gsap.to(circleMesh.scale, {
    duration: 1 + Math.random() * 0.5,
    x: 2,
    y: 2,
    z: 2,
    repeat: -1,
    delay: Math.random() * 0.5,
    yoyo: true,
    ease: "power2.inOut",
  });

  // 设置光柱的位置
  let lat = Math.random() * 180 - 90;
  let lon = Math.random() * 360 - 180;
  let position = lon2xyz(60, lon, lat);
  lightPillar.position.set(position.x, position.y, position.z);

  lightPillar.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    position.clone().normalize()
  );
  scene.add(lightPillar);
}

// 绕地球运行的月球
let moonTexture = new THREE.TextureLoader().load("./assets/ball/moon.jpg");
let moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture,
  emissive: 0xffffff,
  emissiveMap: moonTexture,
});
let moonGeometry = new THREE.SphereGeometry(5, 32, 32);
let moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(150, 0, 0);
scene.add(moon);

// 创建月球环
let moonRingTexture = new THREE.TextureLoader().load(
  "./assets/ball/moon_ring.png"
);
let moonRingMaterial = new THREE.MeshBasicMaterial({
  map: moonRingTexture,
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  depthWrite: false,
  opacity: 0.4,
});
let moonRingGeometry = new THREE.RingGeometry(145, 155, 64);
let moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial);
moonRing.rotation.x = -Math.PI / 2;
scene.add(moonRing);

let time = {
  value: 0,
};
gsap.to(time, {
  value: 1,
  duration: 10,
  repeat: -1,
  ease: "linear",
  onUpdate: () => {
    moon.position.x = 150 * Math.cos(time.value * Math.PI * 2);
    moon.position.z = 150 * Math.sin(time.value * Math.PI * 2);
    moon.rotation.y = time.value * Math.PI * 8;
  },
});

THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
  // console.log(item, loaded, total);
  progress.value = new Number((loaded / total) * 100).toFixed(2);
};
</script>

<style>
</style>
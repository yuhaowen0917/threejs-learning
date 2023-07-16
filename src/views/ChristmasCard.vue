<template>
  <div class="christmas-card" ref="ChristmasCard"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入水面
import { Water } from "three/examples/jsm/objects/Water2";
// 导入gltf载入库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const ChristmasCard = ref("");

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
// 设置相机位置
camera.position.set(-8, 6, 10);
// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// // 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
});
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 设置色调映射
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.enabled = true;
renderer.useLegacyLights = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

onMounted(() => {
  // 创建轨道控制器
  const controls = new OrbitControls(camera, ChristmasCard.value);
  //   console.log(container.value,renderer.domElement);
  // 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
  controls.enableDamping = true;
  ChristmasCard.value.appendChild(renderer.domElement);
  render();
});

// 实例化draco载入库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("./draco/");
// 实例化gltf载入库
const loader = new GLTFLoader();
// 添加draco载入库
loader.setDRACOLoader(dracoLoader);

// 加载模型
loader.load("./model/scene.glb", (gltf) => {
  const model = gltf.scene;
  model.traverse((child) => {
    if (child.name === "Plane") {
      child.visible = false;
    }
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(model);
});

// 创建水面
const waterGeometry = new THREE.CircleGeometry(300, 32);
const water = new Water(waterGeometry, {
  textureWidth: 1024,
  textureHeight: 1024,
  color: 0xeeeeff,
  flowDirection: new THREE.Vector2(1, 1),
  scale: 100,
});
water.rotation.x = -Math.PI / 2;
water.position.y = -0.4;
scene.add(water);

// 加载环境纹理
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/sky.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 50, 0);
scene.add(light);

// 添加点光源
const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(0.1, 2.4, 0);
pointLight.castShadow = true;
scene.add(pointLight);

// // 创建点光源组
// const pointLightGroup = new THREE.Group();
// pointLightGroup.position.set(-8, 2.5, -1.5);
// let radius = 3;
// let pointLightArr = [];
// for (let i = 0; i < 3; i++) {
//   // 创建球体当灯泡
//   const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
//   const sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0xffffff,
//     emissive: 0xffffff,
//     emissiveIntensity: 10,
//   });
//   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//   pointLightArr.push(sphere);
//   sphere.position.set(
//     radius * Math.cos((i * 2 * Math.PI) / 3),
//     Math.cos((i * 2 * Math.PI) / 3),
//     radius * Math.sin((i * 2 * Math.PI) / 3)
//   );

//   let pointLight = new THREE.PointLight(0xffffff, 50);
//   sphere.add(pointLight);

//   pointLightGroup.add(sphere);
// }
// scene.add(pointLightGroup);
</script>

<style>
</style>
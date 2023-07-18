<template>
  <div class="spherical-robot" ref="sphericalRobot"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gltf载入库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// 反射
import { Reflector } from "three/examples/jsm/objects/Reflector";

const sphericalRobot = ref("");

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  sphericalRobot.value.innerWidth / sphericalRobot.value.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 2, 6);
// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true,
});
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
  const controls = new OrbitControls(camera, sphericalRobot.value);
  controls.enableDamping = true;
  sphericalRobot.value.appendChild(renderer.domElement);
  render();
});

// 创建rgbe加载器
const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("./assets/sky12.hdr").then((texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 添加机器人
// 实例化draco载入库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("./draco/");
dracoLoader.setDecoderConfig({ type: "js" });
// 实例化gltf载入库
const gltfLoader = new GLTFLoader();
// 添加draco载入库
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./assets/robot.glb", (gltf) => {
  scene.add(gltf.scene);
});

// 添加直线光
let light1 = new THREE.DirectionalLight(0xffffff, 0.3);
light1.position.set(0, 10, 10);
let light2 = new THREE.DirectionalLight(0xffffff, 0.3);
light1.position.set(0, 10, -10);
let light3 = new THREE.DirectionalLight(0xffffff, 0.8);
light1.position.set(10, 10, 10);
scene.add(light1, light2, light3);

// 添加光圈
let video = document.createElement("video");
video.src = "./assets/zp2.mp4";
video.loop = true;
video.muted = true;
video.play();
// 创建视频纹理
let videoTexture = new THREE.VideoTexture(video);
const videoGeoPlane = new THREE.PlaneGeometry(11, 5.5);
const videoMaterial = new THREE.MeshBasicMaterial({
  map: videoTexture,
  transparent: true,
  side: THREE.DoubleSide,
  alphaMap: videoTexture,
});
const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
videoMesh.position.set(0, 0.2, 0);
videoMesh.rotation.set(-Math.PI / 2, 0, 0);
scene.add(videoMesh);

// 添加镜面反射
let reflectorGeometry = new THREE.PlaneGeometry(100, 100);
let reflectorPlane = new Reflector(reflectorGeometry, {
  textureWidth: window.innerWidth,
  textureHeight: window.innerHeight,
  color: 0x332222,
});
reflectorPlane.rotation.x = -Math.PI / 2;
scene.add(reflectorPlane);
</script>

<style>
.spherical-robot {
  width: 100vw;
  height: 100vh;
}
</style>
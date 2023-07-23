<template>
  <div class="cool-font" ref="coolFont"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gltf载入库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 文字字体
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const coolFont = ref("");
// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  coolFont.value.innerWidth / coolFont.value.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 800);
// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5);
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
  const controls = new OrbitControls(camera, coolFont.value);
  controls.enableDamping = true;
  coolFont.value.appendChild(renderer.domElement);
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

// 添加环境纹理
const texture = new THREE.TextureLoader().load("./hdr/room.jpg");
texture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = texture;
scene.backgroundBlurriness = 0.5;
scene.environment = texture;

// 加载字体
const fontLoader = new FontLoader();
fontLoader.load("fonts/FangSong_Regular.json", (font) => {
  const geometry = new TextGeometry("无良小老板", {
    font: font, // 字体
    size: 150, // 字体大小
    height: 5, // 字体厚度
    curveSegments: 15, // 曲线分段数
    bevelEnabled: true, // 是否启用斜角
    bevelThickness: 10, // 斜角厚度
    bevelSize: 6, // 斜角大小
    bevelSegments: 5, // 斜角分段数
  });
  geometry.center();
  // 设置字体材质
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x00aef0,
    roughness: 0,
    reflectivity: 1,
    thickness: 80,
    ior: 2,
    transmission: 1,
    side: THREE.DoubleSide,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
  });
  // 创建字体
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
</script>

<style lang="less">
</style>
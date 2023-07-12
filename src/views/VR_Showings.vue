<template>
  <div class="vr-showings" ref="container"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 5);
scene.add(camera);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);

const container = ref("");

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

// 创建立方体
// const geometry = new THREE.BoxGeometry(10, 10, 10);
// // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// // const cube = new THREE.Mesh(geometry, material);
// // scene.add(cube);

// // 添加坐标轴服务器
// // const axesHelper = new THREE.AxesHelper(5);
// // scene.add(axesHelper);

// // 4张背景图
// let arr = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"];
// let boxMaterials = [];
// arr.forEach((item) => {
//   // 纹理加载
//   let texture = new THREE.TextureLoader().load(
//     require(`../../public/imgs/living/${item}.jpg`)
//   );
//   // 创建材质
//   if (item === "4_u" || item === "4_d") {
//     texture.rotation = Math.PI;
//     texture.center = new THREE.Vector2(0.5, 0.5);
//     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
//   } else {
//     boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
//   }
// });
// const cube = new THREE.Mesh(geometry, boxMaterials);
// cube.geometry.scale(1, 1, -1);
// scene.add(cube);

// 添加球
const geometry = new THREE.SphereGeometry(5, 32, 32);
const loader = new RGBELoader();
loader.load("./imgs/hdr/Living.hdr", (texture) => {
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.geometry.scale(1, 1, -1);
  scene.add(sphere);
});

// 挂载完毕之后获取dom
onMounted(() => {
  // 创建轨道控制器
  const controls = new OrbitControls(camera, container.value);
  // 设置控制器阻尼，是控制器效果更真实，必须在动画循环里调用.update()
  controls.enableDamping = true;
  container.value.appendChild(renderer.domElement);
  render();
});
</script>

<style lang="less">
</style>
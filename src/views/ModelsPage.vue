<template>
  <div class="models-page" ref="modelsPage"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
// eslint-disable-next-line no-unused-vars
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gltf载入库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

import gsap from "gsap";

const modelsPage = ref("");

// 初始化场景
const scene = new THREE.Scene();
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  45,
  modelsPage.value.innerWidth / modelsPage.value.innerHeight,
  0.1,
  100000
);
// 设置相机位置
camera.position.set(0, 0, 10);
// 更新摄像头宽高比例
camera.aspect = window.innerWidth / window.innerHeight;
// 更新摄像头矩阵
camera.updateProjectionMatrix();
scene.add(camera);

// 加入辅助轴，帮助我们查看3维坐标轴
// const axesHelper = new THREE.AxesHelper(1);
// scene.add(axesHelper);

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
  // const controls = new OrbitControls(camera, modelsPage.value);
  // controls.enableDamping = true;

  modelsPage.value.appendChild(renderer.domElement);
  render();
});

// 创建星空的背景
let url = "./assets/25s.jpg";
let envTexture = new THREE.TextureLoader().load(url);
envTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.background = envTexture;
scene.environment = envTexture;

// 添加灯光
let light = new THREE.DirectionalLight(0xffffff, 0.2);
light.position.set(0, 0, 1);
scene.add(light);
let light2 = new THREE.DirectionalLight(0x585858, 1);
light2.position.set(5, 5, -5);
scene.add(light2);
let light3 = new THREE.AmbientLight(0xffffff, 0.1);
light3.position.set(-1, 1, 1);
scene.add(light3);

// 实例化draco载入库
const dracoLoader = new DRACOLoader();
// 添加draco载入库
dracoLoader.setDecoderPath("./draco/");
dracoLoader.setDecoderConfig({ type: "js" });
// 实例化gltf载入库
const gltfLoader = new GLTFLoader();
// 添加draco载入库
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load("./model/xz.glb", (gltf) => {
  // 缩小比例
  gltf.scene.scale.set(0.1, 0.1, 0.1);
  gltf.scene.position.set(3, 0, 0);
  scene.add(gltf.scene);

  window.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth) * 2 - 1;
    let y = (e.clientY / window.innerHeight) * 2 - 1;

    let timeline = gsap.timeline();
    timeline.to(gltf.scene.rotation, {
      // duration: 0.5,
      x: y,
      y: x,
      duration: 1,
    });
  });
});

gltfLoader.load("./model/xq6.glb", (gltf) => {
  gltf.scene.scale.set(0.06, 0.06, 0.06);
  gltf.scene.position.set(3, -8, 0);
  scene.add(gltf.scene);
  window.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth) * 2 - 1;
    let y = (e.clientY / window.innerHeight) * 2 - 1;

    let timeline = gsap.timeline();
    timeline.to(gltf.scene.rotation, {
      duration: 0.5,
      x: y,
      y: x,
      // eslint-disable-next-line no-dupe-keys
      duration: 1,
    });
  });
});

gltfLoader.load("./model/gr75.glb", (gltf) => {
  gltf.scene.scale.set(0.7, 0.7, 0.7);
  gltf.scene.position.set(3, -16, 0);
  scene.add(gltf.scene);
  window.addEventListener("mousemove", (e) => {
    let x = (e.clientX / window.innerWidth) * 2 - 1;
    let y = (e.clientY / window.innerHeight) * 2 - 1;

    let timeline = gsap.timeline();
    timeline.to(gltf.scene.rotation, {
      duration: 0.5,
      x: y,
      y: x,
      // eslint-disable-next-line no-dupe-keys
      duration: 1,
    });
  });
});

// 鼠标滚轮切换模型
let page = 0;
let timeline2 = gsap.timeline();
window.addEventListener("mousewheel", (e) => {
  if (e.wheelDelta < 0) {
    page++;
    // console.log(e.wheelDelta, page);
    if (page > 2) {
      page = 2;
    }
  }
  if (e.wheelDelta > 0) {
    page--;
    if (page < 0) {
      page = 0;
    }
  }
  if (!timeline2.isActive()) {
    timeline2.to(camera.position, {
      // duration: 0.5,
      y: page * -8,
      duration: 1,
    });
  }
});

gltfLoader.load("./model/moon.glb", (gltf) => {
  let moon = gltf.scene.children[0];
  for (let j = 0; j < 10; j++) {
    let moonInstance = new THREE.InstancedMesh(
      moon.geometry,
      moon.material,
      100
    );

    // scene.add(moon);
    for (let i = 0; i < 100; i++) {
      let x = Math.random() * 1000 - 500;
      let y = Math.random() * 1000 - 500;
      let z = Math.random() * 1000 - 500;

      let matrix = new THREE.Matrix4();
      let size = Math.random() * 20 - 8;
      matrix.makeScale(size, size, size);
      matrix.makeTranslation(x, y, z);
      moonInstance.setMatrixAt(i, matrix);
    }

    gsap.to(moonInstance.position, {
      duration: Math.random() * 10 + 2,
      z: -1000,
      ease: "linear",
      repeat: -1,
    });
    scene.add(moonInstance);
  }
});
</script>

<style>
.models-page {
  width: 100vw;
  height: 100vh;
  color: #585858;
}
</style>
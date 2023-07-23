<template>
  <div class="text-effects" ref="textEffects"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入gltf载入库
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const textEffects = ref("");

// 初始化场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  textEffects.value.innerWidth / textEffects.value.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 0, 3);
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

let showText = false;
window.addEventListener("click", () => {
  showText = !showText;
});
let clock = new THREE.Clock();
let value = 0;
const render = () => {
  let delta = clock.getDelta();
  if (material.value) {
    if (showText) {
      value -= delta;
      value = Math.max(value, 0);
      material.value.uniforms.time.value = value;
    } else {
      value += delta;
      value = Math.min(value, 1);
      material.value.uniforms.time.value = value;
    }
  }
  // 渲染场景
  renderer.render(scene, camera);
  // 引擎自动更新渲染器
  requestAnimationFrame(render);
};

// 挂载完毕之后获取dom
let controls = ref("");
onMounted(() => {
  // 创建轨道控制器
  controls.value = new OrbitControls(camera, textEffects.value);
  controls.value.enableDamping = true;
  textEffects.value.appendChild(renderer.domElement);
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

let material = ref('');

gltfLoader.load("./model/newyear.glb", (gltf) => {
  console.log(gltf);
  let text = gltf.scene.children[0];
  scene.add(text);
  let geometry = text.geometry;
  const position = geometry.attributes.position;
  const vertexCount = position.count;
  const triangleCount = vertexCount / 3;

  const randomDirections = [];
  const randomStrengths = [];

  for (let i = 0; i < triangleCount; i++) {
    const dir = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
      .normalize()
      .toArray();

    // console.log(dir);
    randomDirections.push(dir[0], dir[1], dir[2]);
    const str = Math.random();
    randomStrengths.push(str, str, str);
  }

  const randomDirectionsAttribute = new THREE.Float32BufferAttribute(
    new Float32Array(randomDirections),
    3
  );

  geometry.setAttribute("randomDirection", randomDirectionsAttribute);
  const randomStrengthsAttribute = new THREE.Float32BufferAttribute(
    new Float32Array(randomStrengths),
    1
  );
  geometry.setAttribute("randomStrength", randomStrengthsAttribute);

  // 定义着色器材质
  material.value = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 1 },
    },
    vertexShader: `
      attribute vec3 randomDirection;
      attribute float randomStrength;
      uniform float time;
      varying vec3 vPosition;

      void main() {
        vPosition = position;
        vec3 pos = position.xyz;
        pos += randomDirection * randomStrength * time;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.xyz, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vPosition;
      void main() {
        vec3 color = normalize(vPosition)*0.5+0.5;
        color.z = color.z*3.0;
        gl_FragColor = vec4(color,1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: true,
  });
  text.material = material.value;
});
</script>

<style>
</style>
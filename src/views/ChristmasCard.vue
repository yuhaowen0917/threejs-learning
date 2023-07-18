<template>
  <div class="christmas-card" ref="ChristmasCard"></div>
  <div
    class="scenes"
    :style="{
      transform: `translate3d(0, ${-index * 100}vh, 0)`,
    }"
  >
    <div v-for="item in scenes" style="width: 100vw; height: 100vh" :key="item">
      <h1 style="padding: 100px 50px; font-size: 50px; color: #fff">
        {{ item.text }}
      </h1>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
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
camera.position.set(-10, 6, 12);
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
// 允许阴影
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

let controls;
onMounted(() => {
  // 创建轨道控制器
  controls = new OrbitControls(camera, ChristmasCard.value);
  controls.target.set(-8, 2, 0);
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
water.position.y = -0.6;
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

// 创建点光源组
const pointLightGroup = new THREE.Group();
pointLightGroup.position.set(-8, 2.5, -1.5);
let radius = 3;
let pointLightArr = [];
for (let i = 0; i < 3; i++) {
  // 创建球体当灯泡
  const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffff,
    emissiveIntensity: 10,
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  pointLightArr.push(sphere);
  sphere.position.set(
    radius * Math.cos((i * 2 * Math.PI) / 3),
    Math.cos((i * 2 * Math.PI) / 3),
    radius * Math.sin((i * 2 * Math.PI) / 3)
  );

  let pointLight = new THREE.PointLight(0xffffff, 3);
  sphere.add(pointLight);
  pointLightGroup.add(sphere);
}
scene.add(pointLightGroup);

// 使用补间函数，从0到2π，使灯泡旋转
let options = {
  angle: 0,
};
gsap.to(options, {
  angle: Math.PI * 2,
  duration: 10,
  repeat: -1,
  ease: "linear",
  onUpdate: () => {
    pointLightGroup.rotation.y = options.angle;
    pointLightArr.forEach((item, index) => {
      item.position.set(
        radius * Math.cos((index * 2 * Math.PI) / 3),
        Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
        radius * Math.sin((index * 2 * Math.PI) / 3)
      );
    });
  },
});

// 使用补间动画移动相机
let timeLine1 = gsap.timeline();
let timeline2 = gsap.timeline();

// 定义相机移动函数
const translateCamera = (position, target) => {
  timeLine1.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 1,
    ease: "power2.inOut",
  });
  timeline2.to(controls.target, {
    x: target.x,
    y: target.y,
    z: target.z,
    duration: 1,
    ease: "power2.inOut",
  });
};

let scenes = ref([
  {
    text: "圣诞快乐",
    callback: () => {
      // 执行函数切换位置
      translateCamera(
        new THREE.Vector3(-3.23, 3, 4.06),
        new THREE.Vector3(-8, 2, 0)
      );
    },
  },
  {
    text: "感谢在这么大的世界里遇见了你",
    callback: () => {
      translateCamera(new THREE.Vector3(5, 1, 23), new THREE.Vector3(0, 0, 0));
    },
  },
  {
    text: "愿与你探寻世界的每一个角落",
    callback: () => {
      translateCamera(new THREE.Vector3(10, 3, 0), new THREE.Vector3(0, 0, 0));
    },
  },
  {
    text: "愿将天上的星星送给你",
    callback: () => {
      translateCamera(new THREE.Vector3(7, 0, 23), new THREE.Vector3(0, 0, 0));
      makeHeart();
    },
  },
  {
    text: "愿疫情结束，大家健康快乐！",
    callback: () => {
      translateCamera(
        new THREE.Vector3(-6, 1.5, 7),
        new THREE.Vector3(5, 2, 0)
      );
    },
  },
]);

let index = ref(0);
let isAnimate = ref(false);
// 监听鼠标滚轮事件
window.addEventListener(
  "wheel",
  (e) => {
    if (isAnimate.value) return;
    isAnimate.value = true;
    if (e.deltaY > 0) {
      index.value++;
      if (index.value > scenes.value.length - 1) {
        index.value = 0;
        restoreHeart();
      }
    }
    scenes.value[index.value].callback();
    setTimeout(() => {
      isAnimate.value = false;
    }, 1000);
  },
  false
);

// 实例化创建漫天星星
let starsInstance = new THREE.InstancedMesh(
  new THREE.SphereGeometry(0.1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 10,
  }),
  100
);

// 星星随机到天上
let starsArr = [];
let endArr = [];

for (let i = 0; i < 100; i++) {
  let x = Math.random() * 100 - 50;
  let y = Math.random() * 100 - 50;
  let z = Math.random() * 100 - 50;
  starsArr.push(new THREE.Vector3(x, y, z));
  let matrix = new THREE.Matrix4();
  matrix.setPosition(x, y, z);
  starsInstance.setMatrixAt(i, matrix);
}
scene.add(starsInstance);

// 创建爱心路径
let heartShape = new THREE.Shape();
heartShape.moveTo(25, 25);
heartShape.bezierCurveTo(25, 25, 20, 0, 0, 0);
heartShape.bezierCurveTo(-30, 0, -30, 35, -30, 35);
heartShape.bezierCurveTo(-30, 55, -10, 77, 25, 95);
heartShape.bezierCurveTo(60, 77, 80, 55, 80, 35);
heartShape.bezierCurveTo(80, 35, 80, 0, 50, 0);
heartShape.bezierCurveTo(35, 0, 25, 25, 25, 25);

// 根据爱心路径获取点
let center = new THREE.Vector3(0, 2, 10);
for (let i = 0; i < 100; i++) {
  let point = heartShape.getPoint(i / 100);
  endArr.push(
    new THREE.Vector3(
      point.x * 0.1 + center.x,
      point.y * 0.1 + center.y,
      center.z
    )
  );
}
// 创建爱心动画
function makeHeart() {
  let params = {
    time: 0,
  };

  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for (let i = 0; i < 100; i++) {
        let x = starsArr[i].x + (endArr[i].x - starsArr[i].x) * params.time;
        let y = starsArr[i].y + (endArr[i].y - starsArr[i].y) * params.time;
        let z = starsArr[i].z + (endArr[i].z - starsArr[i].z) * params.time;
        let matrix = new THREE.Matrix4();
        matrix.setPosition(x, y, z);
        starsInstance.setMatrixAt(i, matrix);
      }
      starsInstance.instanceMatrix.needsUpdate = true;
    },
  });
}
function restoreHeart() {
  let params = {
    time: 0,
  };

  gsap.to(params, {
    time: 1,
    duration: 1,
    onUpdate: () => {
      for (let i = 0; i < 100; i++) {
        let x = endArr[i].x + (starsArr[i].x - endArr[i].x) * params.time;
        let y = endArr[i].y + (starsArr[i].y - endArr[i].y) * params.time;
        let z = endArr[i].z + (starsArr[i].z - endArr[i].z) * params.time;
        let matrix = new THREE.Matrix4();
        matrix.setPosition(x, y, z);
        starsInstance.setMatrixAt(i, matrix);
      }
      starsInstance.instanceMatrix.needsUpdate = true;
    },
  });
}
</script>

<style lang="less">
.scenes {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  pointer-events: none;
  transition: all 1s;
}
</style>
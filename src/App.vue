<template>
  <div class="container">
    <nav v-if="route.path === '/' || route.path === '/about'">
      <div v-for="(item, index) in nav" :key="index" class="project">
        <router-link :to="item.url">{{ item.name }}</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { ref } from "vue";
// import { useRoute,useRouter } from "vue-router";
// import { useStore } from "vuex";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route);
// const router = useRouter();
// const store = useStore();

const nav = ref([
  {
    name: "Home",
    url: "/",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "VR看房：VR_Showings",
    url: "/VR_Showings",
  },
  {
    name: "小岛：SmallIsland",
    url: "/small-island",
  },
  {
    name: "水晶小熊：CrystalBear",
    url: "/crystal-bear",
  },
  {
    name: "选购汽车：BuyCar",
    url: "/buy-car",
  },
  {
    name: "圣诞贺卡：ChristmasCard",
    url: "/christmas-card",
  },
  {
    name: "球形机器人：SphericalRobot",
    url: "/spherical-robot",
  },
  {
    name: "酷炫3D页面：ModelsPage",
    url: "/models-page",
  },
  {
    name: "3D地球模型：EarthModel",
    url: "/earth-model",
  },
]);
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.clears {
  clear: both;
  height: 0;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
}
ul,
li,
ol {
  list-style: none;
}
a {
  text-decoration: none;
}
img {
  border: none;
}
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
nav {
  padding: 25px 20px;
  .project {
    margin: 10px 0;
    font-size: 18px;
    a {
      color: #060606;
      &:hover{
        color: rgb(21, 114, 252);
      }
    }
  }
}
</style>

<template>
  <div class="container">
    <nav v-if="route.path === '/' || route.path === '/about'">
      <div>
        <router-link to="/">Home</router-link>
      </div>
      <div>
        <router-link to="/about">About</router-link>
      </div>
      <div>
        <router-link to="/VR_Showings">VR看房：VR_Showings</router-link>
      </div>
      <div>
        <router-link to="/small-island">小岛：SmallIsland</router-link>
      </div>
      <div>
        <router-link to="/crystal-bear">水晶小熊：CrystalBear</router-link>
      </div>
      <div>
        <router-link to="/buy-car">选购汽车：BuyCar</router-link>
      </div>
      <div>
        <router-link to="/christmas-card">圣诞贺卡：ChristmasCard</router-link>
      </div>
      <div>
        <router-link to="/spherical-robot">球形机器人：SphericalRobot</router-link>
      </div>
      <div>
        <router-link to="/models-page">酷炫3D页面：ModelsPage</router-link>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// import { reactive, ref } from "vue";
// import { useRoute,useRouter } from "vue-router";
// import { useStore } from "vuex";
import { useRoute } from "vue-router";
const route = useRoute();
console.log(route);
// const router = useRouter();
// const store = useStore();
</script>

<style>
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
</style>

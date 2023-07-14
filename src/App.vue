<template>
  <div class="container">
    <nav v-if="route.path==='/'||route.path==='/about'">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/VR_Showings">VR_Showings</router-link> |
      <router-link to="/small-island">SmallIsland</router-link>
      <router-link to="/crystal-bear">CrystalBear</router-link>
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

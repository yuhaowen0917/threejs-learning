import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/VR_Showings",
    name: "VrShowings",
    component: () => import("@/views/VR_Showings.vue"),
  },
  {
    path: "/small-island",
    name: "SmallIsland",
    component: () => import("@/views/SmallIsland.vue"),
  },
  {
    path: "/crystal-bear",
    name: "CrystalBear",
    component: () => import("@/views/CrystalBear.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

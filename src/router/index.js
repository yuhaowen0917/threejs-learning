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
  {
    path: "/buy-car",
    name: "BuyCar",
    component: () => import("@/views/BuyCar.vue"),
  },
  {
    path: "/christmas-card",
    name: "ChristmasCard",
    component: () => import("@/views/ChristmasCard.vue"),
  },
  {
    path: "/spherical-robot",
    name: "SphericalRobot",
    component: () => import("@/views/SphericalRobot.vue"),
  },
  {
    path: "/models-page",
    name: "ModelsPage",
    component: () => import("@/views/ModelsPage.vue"),
  },
  {
    path: "/earth-model",
    name: "EarthModel",
    component: () => import("@/views/EarthModel.vue"),
  },
  {
    path: "/cool-font",
    name: "CoolFont",
    component: () => import("@/views/CoolFont.vue"),
  },
  {
    path: "/text-effects",
    name: "TextEffects",
    component: () => import("@/views/TextEffects.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/User.vue"),
  },
  {
    path: "/chat",
    name: "Chat",
    component: () => import("@/views/chat.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

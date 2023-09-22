import { createRouter, createWebHistory } from "vue-router";
// import Login from "@/views/Login.vue";
import Intro from "@/views/intro.vue";
import Chat from "@/views/chat.vue";

const routes = [
  {
    path: "/",
    name: "Intro",
    component: Intro,
    meta: {
      hideSideBar: true,
    },
  },
  {
    path: "/chat/:type/:title?",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/myprofile",
    name: "myProfile",
    component: () => import("@/views/myprofile.vue"),
  },
  {
    path: "/profiles",
    name: "Profiles",
    component: () => import("@/views/profiles.vue"),
  },
  {
    path: "/profiles/:name",
    name: "Profile",
    component: () => import("@/views/profile.vue"),
  },
  {
    path: "/profiles/:name/:title",
    name: "PrivateChat",
    component: () => import("@/views/privateChat.vue"),
  },
  {
    path: "/opinions",
    name: "Opinions",
    component: () => import("@/views/opinions.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
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
  // {
  //   path: "/chat",
  //   name: "Chat",
  //   component: () => import("@/views/chat.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

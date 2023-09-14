import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Toast, { POSITION, TYPE } from "vue-toastification";
import "vue-toastification/dist/index.css";

import baseButton from "./components/base-button.vue";

const app = createApp(App);

const toastOptions = {
  position: POSITION.BOTTOM_RIGHT,
  type: TYPE.ERROR,
  maxToasts: 5,
};
app.use(Toast, toastOptions);

app.component("base-button", baseButton);

app.use(store).use(router).mount("#app");

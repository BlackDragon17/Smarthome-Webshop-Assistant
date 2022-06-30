import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import $bus from "./EventBus";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$bus = $bus;

app.mount("#app");

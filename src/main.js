import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "floating-vue/dist/style.css";

import $eventBus from "./assets/javascript/eventbus";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$eventBus = $eventBus;
app.config.globalProperties.hideBorders = true;
app.config.globalProperties.deviceTray = "Tray (not in a room)";

app.mount("#app");

import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import eventBus from "./assets/javascript/eventbus";
import getName from "@/assets/javascript/get-name";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$eventBus = eventBus;
app.config.globalProperties.$getName = getName;
app.config.globalProperties.deviceTray = "Tray (not in a room)";
app.config.globalProperties.hideBorders = true;

app.mount("#app");

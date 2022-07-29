import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import $eventBus from "./assets/javascript/eventbus";
import getIconName from "./assets/javascript/get-icon-name";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$eventBus = $eventBus;
app.config.globalProperties.getIconName = getIconName;
app.config.globalProperties.deviceTray = "Tray (not in a room)";
app.config.globalProperties.hideBorders = false;

app.mount("#app");

import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import eventBus from "./assets/javascript/eventbus";
import GetName from "@/assets/javascript/get-name";
import permissions from "@/assets/javascript/permissions";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$eventBus = eventBus;
app.config.globalProperties.$getName = new GetName();
app.config.globalProperties.$permissions = permissions;
app.config.globalProperties.deviceTray = "Tray (not in a room)";
app.config.globalProperties.hideBorders = true;

app.mount("#app");

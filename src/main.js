import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import $eventBus from "./assets/javascript/eventbus";
import getIconName from "./assets/javascript/get-icon-name";
import getPropertyName from "./assets/javascript/get-property-name";
import getSenseName from "./assets/javascript/get-sense-name";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$eventBus = $eventBus;
app.config.globalProperties.getIconName = getIconName;
app.config.globalProperties.getPropertyName = getPropertyName;
app.config.globalProperties.getSenseName = getSenseName;
app.config.globalProperties.deviceTray = "Tray (not in a room)";
app.config.globalProperties.hideBorders = true;

app.mount("#app");

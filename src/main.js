import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import $eventBus from "./assets/javascript/EventBus";
import App from "./App.vue";

const app = createApp(App);
app.config.globalProperties.$eventBus = $eventBus;
app.config.globalProperties.hideBorders = true;

app.mount("#app");

import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.vue";
import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup/HomeSetup.vue";
import HomeSidebar from "./components/HomeSetup/HomeSidebar.vue";
import AddDeviceModal from "./components/HomeSetup/AddDeviceModal.vue";

const app = createApp(App);
app.component("NavHeader", NavHeader);
app.component("HomeSetup", HomeSetup);
app.component("HomeSidebar", HomeSidebar);
app.component("AddDeviceModal", AddDeviceModal);

app.mount("#app");

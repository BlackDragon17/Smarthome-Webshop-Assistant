import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";
import $bus from "./EventBus";

import App from "./App.vue";
import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup/HomeSetup.vue";
import HomeSidebar from "./components/HomeSetup/HomeSidebar.vue";
import AddDeviceModal from "./components/HomeSetup/AddDeviceModal.vue";
import AddRoomModal from "./components/HomeSetup/AddRoomModal.vue";
import HomeRoomView from "./components/HomeSetup/HomeRoomView.vue";

const app = createApp(App);
app.component("NavHeader", NavHeader);
app.component("HomeSetup", HomeSetup);
app.component("HomeSidebar", HomeSidebar);
app.component("AddDeviceModal", AddDeviceModal);
app.component("AddRoomModal", AddRoomModal);
app.component("HomeRoomView", HomeRoomView);
app.config.globalProperties.$bus = $bus;

app.mount("#app");

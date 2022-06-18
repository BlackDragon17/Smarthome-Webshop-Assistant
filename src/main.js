import { createApp } from 'vue';
import App from './App.vue';
import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup/HomeSetup.vue";
import HomeSidebar from "./components/HomeSetup/HomeSidebar.vue";

const app = createApp(App);
app.component("NavHeader", NavHeader);
app.component("HomeSetup", HomeSetup);
app.component("HomeSidebar", HomeSidebar);

app.mount('#app');

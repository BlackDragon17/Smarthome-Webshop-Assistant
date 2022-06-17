import { createApp } from 'vue'
import App from './App.vue'
import NavHeader from "./components/NavHeader.vue";
import HomeSetup from "./components/HomeSetup.vue";

const app = createApp(App);
app.component("NavHeader", NavHeader);
app.component("HomeSetup", HomeSetup);

app.mount('#app');

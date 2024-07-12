import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import globalComponents from "./plugins/global-components";

import "./registerServiceWorker";

const app = createApp(App);

app.use(router);
app.use(store);

// Custom Components & Directives
app.use(globalComponents);

app.mount("#app");

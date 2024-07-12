import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import globalComponents from "./plugins/global-components";

import "./registerServiceWorker";

const app = createApp(App);

app.use(router);

// Custom Components & Directives
app.use(globalComponents);

app.mount("#app");

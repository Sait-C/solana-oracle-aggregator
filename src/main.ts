import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import globalComponents from "./plugins/global-components";
import globalProvides from "./plugins/globalProvides";

import "./registerServiceWorker";

const app = createApp(App);

app.use(router);
app.use(store);

// Custom Components & Directives
app.use(globalComponents);
app.use(globalProvides);

app.mount("#app");

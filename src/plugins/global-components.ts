import { App } from "vue";
import BrandLogo from "@/components/custom/logo/BrandLogo.vue";
import BrandName from "@/components/custom/logo/BrandName.vue";

export default {
  install: (app: App) => {
    // Brand Components
    app.component("brand-logo", BrandLogo);
    app.component("brand-name", BrandName);
  },
};

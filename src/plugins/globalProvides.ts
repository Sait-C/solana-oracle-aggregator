import pythAssetService from "@/services/assets/pyth.service";
import chainlinkService from "@/services/feeds/chainlink.service";
import pythPriceFeedService from "@/services/feeds/pyth.service";

// src/plugins/globalProvides.ts
export default {
  install(app: any) {
    app.provide("assetService", pythAssetService);
    app.provide("priceFeedServices", [pythPriceFeedService, chainlinkService]);
    // Add more services as needed
  },
};

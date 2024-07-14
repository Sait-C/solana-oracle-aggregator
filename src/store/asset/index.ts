import { IAssetService } from "@/services/assets/IAssetService";
import { PriceFeedSymbol } from "@/types";
import { AssetState } from "@/types/store/AssetState";
import { inject } from "vue";
import { Commit } from "vuex";

export default {
  namespaced: true,

  state(): AssetState {
    return {
      symbolsOfAssets: [] as Array<PriceFeedSymbol>,
    };
  },

  mutations: {
    setSymbolsOfAssets(
      state: AssetState,
      symbolsOfAssets: Array<PriceFeedSymbol>
    ) {
      state.symbolsOfAssets = symbolsOfAssets;
    },
  },

  actions: {
    async getAllSymbolsOfAssets({
      commit,
      state,
    }: {
      commit: Commit;
      state: AssetState;
    }) {
      if (state.symbolsOfAssets && state.symbolsOfAssets.length > 0) {
        return;
      }

      const assetService: IAssetService | undefined = inject("assetService");
      // withCredentials -> browser automatically appends the cookie for the every request of the API
      const response = await assetService?.getSymbolsOfAssets().catch((err) => {
        //err.message = err.response.data.error;
        err.message = "An error was encountered while getting assets.";
        throw err;
      });

      if (response && response.length > 0) {
        commit("setSymbolsOfAssets", response);
      }
    },
  },

  getters: {
    getSymbolsOfAssets(state: AssetState) {
      return state.symbolsOfAssets;
    },
  },
};

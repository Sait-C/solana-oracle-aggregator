import { createStore, createLogger } from "vuex";

import connection from "./connection";
import asset from "./asset";

const debug = process.env.VUE_APP_NODE_ENV !== "production";

export default createStore({
  modules: {
    connection: connection,
    asset: asset,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

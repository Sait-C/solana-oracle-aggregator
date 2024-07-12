import { createStore, createLogger } from "vuex";

import connection from "./connection";

const debug = process.env.VUE_APP_NODE_ENV !== "production";

export default createStore({
  modules: {
    connection: connection,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack(chain) {
    // this is in order to support the not-updated version of ccxt:
    // also needs:
    //    yarn add --dev node-polyfill-webpack-plugin browserify-zlib
    const nodePolyfillWebpackPlugin = require("node-polyfill-webpack-plugin");
    chain.plugin("node-polyfill").use(nodePolyfillWebpackPlugin);
    chain.resolve.alias.set("zlib", "browserify-zlib");
  },
});

import { ConnectionState } from "@/types";
import { Connection } from "@solana/web3.js";
import { Commit } from "vuex";

export default {
  namespaced: true,

  state(): ConnectionState {
    return {
      connection: null,
    };
  },

  mutations: {
    setConnection(state: ConnectionState, payload: Connection) {
      state.connection = payload;
    },
  },

  actions: {
    setConnection({ commit }: { commit: Commit }, payload: Connection) {
      if (typeof payload !== typeof undefined) {
        commit("setConnection", payload);
      }
    },
  },

  getters: {
    getConnection(state: ConnectionState): Connection | null {
      return state.connection;
    },
  },
};

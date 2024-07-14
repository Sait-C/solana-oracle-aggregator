import store from "../store";
import { Connection } from "@solana/web3.js";
import { computed } from "vue";

export default async function useSolanaConnection(): Promise<Connection> {
  const connection = computed(() => store.getters["connection/getConnection"]);

  if (!connection.value) {
    const newConnection = new Connection(`${process.env.VUE_APP_CLUSTER_URL}`);
    await store.dispatch("connection/setConnection", newConnection);
  }

  return connection.value;
}

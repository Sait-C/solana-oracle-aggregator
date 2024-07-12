import { useStore } from "vuex";
import { Connection } from "@solana/web3.js";
import { computed } from "vue";

export async function useConnection(): Promise<Connection | null> {
  const store = useStore();
  const connection = computed(() => store.getters["connection/getConnection"]);

  if (!connection.value) {
    const newConnection = new Connection(`${process.env.VUE_APP_CLUSTER_URL}`);
    await store.dispatch("connection/setConnection", newConnection);
  }

  return connection.value;
}

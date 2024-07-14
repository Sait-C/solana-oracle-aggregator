import store from "../store";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { computed } from "vue";

export default async function useSolanaConnection(): Promise<Connection> {
  const connection = computed(() => store.getters["connection/getConnection"]);

  if (!connection.value) {
    const newConnection = new Connection(
      "https://solana-mainnet.api.syndica.io/api-key/DswKY9XcRmeACT9QQTMG2KqnfmYks1CigBD2RRvaEwhUxERj14P9RRfRBMZFJhw9a9CtSzPXMeY9nSTC7Vq6s6ZZafSBQGzARX"
    );
    await store.dispatch("connection/setConnection", newConnection);
  }

  return connection.value;
}

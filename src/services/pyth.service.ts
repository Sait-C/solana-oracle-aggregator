// src/services/pythService.js

import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";

//const cluster = "mainnet-beta";
//const solanaRpcUrl = "https://api.mainnet-beta.solana.com";

const cluster: PythCluster = "devnet";

const connection = new Connection(clusterApiUrl(cluster));
const pythPublicKey = getPythProgramKeyForCluster(cluster);

export async function runQuery(): Promise<void> {
  const pythClient = new PythHttpClient(connection, pythPublicKey);
  const data = await pythClient.getData();
  for (const symbol of data.symbols) {
    const price = data.productPrice.get(symbol);
    console.log(price?.productAccountKey.toBase58());

    if (price?.aggregate.price && price?.aggregate.status) {
      // tslint:disable-next-line:no-console
      console.log(
        `${symbol}: $${price.aggregate.price} \xB1$${price.aggregate.status}`
      );
    } else {
      // tslint:disable-next-line:no-console
      console.log(`${symbol}: price currently unavailable.`);
    }
  }
}

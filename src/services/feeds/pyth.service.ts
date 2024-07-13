// src/services/pythService.js

import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import { PriceFeedService } from "./PriceFeedService";
import { PriceFeedModel } from "@/types/models/PriceFeedModel";
import { AssetService } from "../assets/AssetService";
import pythService from "../assets/pyth.service";

const cluster: PythCluster = "devnet";

const connection = new Connection(clusterApiUrl(cluster));
const pythPublicKey = getPythProgramKeyForCluster(cluster);

class PythService implements PriceFeedService {
  pythClient: PythHttpClient | null;
  assetService: AssetService;
  constructor(assetService: AssetService) {
    this.assetService = assetService;
    this.pythClient = new PythHttpClient(connection, pythPublicKey);
  }

  // @desc Loop through symbols of assets and fetch prices each of them
  async getAllPriceFeeds(): Promise<PriceFeedModel[]> {
    const data = await this.pythClient?.getData();
    const priceFeeds = [] as Array<PriceFeedModel>;
    if (
      this.assetService.assetSymbols.length > 0 &&
      data &&
      data.symbols.length > 0
    ) {
      for (const symbol of this.assetService.assetSymbols) {
        const price = data?.productPrice.get(symbol.fullSymbol);
        // Check if it is available
        if (price?.aggregate.status) {
          const priceFeed: PriceFeedModel = {
            symbol,
            price: price?.aggregate.price ?? null,
          };
          priceFeeds.push(priceFeed);
        }
      }
    }
    return priceFeeds;
  }
}

export default new PythService(pythService);

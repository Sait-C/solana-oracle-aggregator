// src/services/pythService.js

import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import { IPriceFeedService } from "./IPriceFeedService";
import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";
import { IAssetService } from "../assets/IAssetService";
import pythService from "../assets/pyth.service";
import useSolanaConnection from "@/composables/useSolanaConnection";

const cluster: PythCluster = "devnet";

const connection = await useSolanaConnection();
const pythPublicKey = getPythProgramKeyForCluster(cluster);

class PythService implements IPriceFeedService {
  serviceName = "Pyth";
  pythClient: PythHttpClient | null;
  assetService: IAssetService;
  constructor(assetService: IAssetService) {
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

  // @desc Get single price feed by price feed symbol
  async getSinglePriceFeed(
    symbol: PriceFeedSymbol
  ): Promise<PriceFeedModel | null> {
    const data = await this.pythClient?.getData();
    const price = data?.productPrice.get(symbol.fullSymbol);
    // Check if it is available
    if (price?.aggregate.status) {
      const priceFeed: PriceFeedModel = {
        symbol,
        price: price?.aggregate.price ?? null,
      };
      return priceFeed;
    }

    return null;
  }
}

export default new PythService(pythService);

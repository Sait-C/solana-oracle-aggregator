import api from "@/api/api-chainlink-config";
import { IPriceFeedService } from "./IPriceFeedService";
import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";
import { IAssetService } from "../assets/IAssetService";
import pythService from "../assets/pyth.service";

class ChainlinkService implements IPriceFeedService {
  assetService: IAssetService;
  constructor(assetService: IAssetService) {
    this.assetService = assetService;
  }

  // @desc Loop through symbols of assets and fetch prices each of them
  async getAllPriceFeeds(): Promise<PriceFeedModel[]> {
    const priceFeeds = [] as Array<PriceFeedModel>;
    if (this.assetService.assetSymbols.length > 0) {
      for (const symbol of this.assetService.assetSymbols) {
        const result = await api.get(
          `data/pricemultifull?fsyms=${symbol.fsyms}&tsyms=${symbol.tsyms}`,
          {
            headers: {
              authorization: `Apikey f8d63c185199b4c6a78d4d3f42d45248199d2a4ee5e037a532a3784d241eb752`,
            },
          }
        );
        if (result.data.RAW) {
          const priceFeed: PriceFeedModel = {
            symbol,
            price:
              symbol.fsyms && symbol.tsyms
                ? result.data.RAW[symbol.fsyms][symbol.tsyms].PRICE
                : 0,
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
    const result = await api.get(
      `data/pricemultifull?fsyms=${symbol.fsyms}&tsyms=${symbol.tsyms}`,
      {
        headers: {
          authorization: `Apikey f8d63c185199b4c6a78d4d3f42d45248199d2a4ee5e037a532a3784d241eb752`,
        },
      }
    );
    if (result.data.RAW) {
      const priceFeed: PriceFeedModel = {
        symbol,
        price:
          symbol.fsyms && symbol.tsyms
            ? result.data.RAW[symbol.fsyms][symbol.tsyms].PRICE
            : 0,
      };
      return priceFeed;
    }

    return null;
  }
}

export default new ChainlinkService(pythService);

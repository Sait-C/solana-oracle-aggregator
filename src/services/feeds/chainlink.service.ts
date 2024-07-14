import api from "@/api/api-chainlink-config";
import { IPriceFeedService } from "./IPriceFeedService";
import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";
import { IAssetService } from "../assets/IAssetService";
import pythService from "../assets/pyth.service";

class ChainlinkService implements IPriceFeedService {
  serviceName = "Chainlink";
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
              authorization: `Apikey ${process.env.VUE_APP_CRYPTOCOMPARE_API_KEY}`,
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
          authorization: `Apikey ${process.env.VUE_APP_CRYPTOCOMPARE_API_KEY}`,
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
        image:
          symbol.fsyms && symbol.tsyms
            ? "https://www.cryptocompare.com/" +
              result.data.RAW[symbol.fsyms][symbol.tsyms].IMAGEURL
            : null,
      };
      return priceFeed;
    }

    return null;
  }
}

export default new ChainlinkService(pythService);

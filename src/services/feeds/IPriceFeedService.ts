import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";

export interface IPriceFeedService {
  getAllPriceFeeds(): Promise<PriceFeedModel[]>;
  getSinglePriceFeed(symbol: PriceFeedSymbol): Promise<PriceFeedModel | null>;
}

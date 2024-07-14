import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";

export interface IPriceFeedService {
  serviceName: string;
  getAllPriceFeeds(): Promise<PriceFeedModel[]>;
  getSinglePriceFeed(symbol: PriceFeedSymbol): Promise<PriceFeedModel | null>;
}

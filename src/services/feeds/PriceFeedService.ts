import { PriceFeedModel } from "@/types/models/PriceFeedModel";

export interface PriceFeedService {
  getAllPriceFeeds(): Promise<PriceFeedModel[]>;
}

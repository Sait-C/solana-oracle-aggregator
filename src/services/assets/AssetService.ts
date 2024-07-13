import { PriceFeedSymbol } from "@/types/models/PriceFeedModel";

export interface AssetService {
  assetSymbols: Array<PriceFeedSymbol>;
  getSymbolsOfAssets(): Promise<PriceFeedSymbol[]>;
}

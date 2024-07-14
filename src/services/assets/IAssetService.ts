import { PriceFeedSymbol } from "@/types/models/PriceFeedModel";

export interface IAssetService {
  assetSymbols: Array<PriceFeedSymbol>;
  getSymbolsOfAssets(): Promise<PriceFeedSymbol[]>;
}

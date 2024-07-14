import { PriceFeedSymbol } from "@/types";
import { IAssetService } from "./IAssetService";
import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import useSolanaConnection from "@/composables/useSolanaConnection";

const cluster: PythCluster = "mainnet-beta";

const connection = await useSolanaConnection();
const pythPublicKey = getPythProgramKeyForCluster(cluster);

class PythAssetService implements IAssetService {
  pythClient: PythHttpClient | null;
  assetSymbols: Array<PriceFeedSymbol>;
  constructor() {
    this.pythClient = new PythHttpClient(connection, pythPublicKey);
    this.assetSymbols = [];
  }

  // @desc Get symbols of assets via Pyth and return necessary data to fetch prices
  async getSymbolsOfAssets(): Promise<PriceFeedSymbol[]> {
    const data = await this.pythClient?.getData();
    if (data && data.symbols.length > 0) {
      for (const symbol of data.symbols) {
        const product = data?.productFromSymbol.get(symbol);
        const assetSymbol: PriceFeedSymbol = {
          assetType: product?.asset_type,
          fullSymbol: symbol,
          tsyms: product?.quote_currency,
          fsyms: product?.base,
        };
        console.log(assetSymbol.tsyms);
        this.assetSymbols.push(assetSymbol);
      }
    }
    return this.assetSymbols;
  }
}

export default new PythAssetService();

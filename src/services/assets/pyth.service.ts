import { PriceFeedSymbol } from "@/types";
import { AssetService } from "./AssetService";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";

const cluster: PythCluster = "devnet";

const connection = new Connection(clusterApiUrl(cluster));
const pythPublicKey = getPythProgramKeyForCluster(cluster);

class PythAssetService implements AssetService {
  pythClient: PythHttpClient | null;
  assetSymbols: Array<PriceFeedSymbol>;
  constructor() {
    this.pythClient = new PythHttpClient(connection, pythPublicKey);
    this.assetSymbols = [];
    this.initialize();
  }

  async initialize() {
    try {
      await this.getSymbolsOfAssets();
    } catch (error) {
      console.error("Error:", error);
    }
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

        this.assetSymbols.push(assetSymbol);
      }
    }

    return this.assetSymbols;
  }
}

export default new PythAssetService();

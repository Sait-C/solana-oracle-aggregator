export interface PriceFeedModel {
  symbol: PriceFeedSymbol;
  price: number | null;
  image?: string | null;
  priceSign?: string | null;
}

export interface PriceFeedSymbol {
  assetType: string | undefined;
  fullSymbol: string;
  fsyms: string | undefined;
  tsyms: string | undefined;
}

export interface AggregatodPriceFeed extends PriceFeedModel {
  services: Array<string>;
}

export interface PriceFeedModel {
  symbol: PriceFeedSymbol;
  price: number | null;
}

export interface PriceFeedSymbol {
  assetType: string | undefined;
  fullSymbol: string;
  fsyms: string | undefined;
  tsyms: string | undefined;
}

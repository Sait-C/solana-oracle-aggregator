import {
  AggregatodPriceFeed,
  PriceFeedModel,
  PriceFeedSymbol,
  Result,
} from "@/types";
import { onMounted, inject, ref, reactive } from "vue";
import { IPriceFeedService } from "@/services/feeds/IPriceFeedService";
import truncateDecimalPlace from "@/utils/truncateDecimalPlace";

export function useSinglePriceFeed(symbol: PriceFeedSymbol): Result {
  const result = reactive<Result>({
    success: false,
  });
  const priceFeedServices: Array<IPriceFeedService> | undefined =
    inject("priceFeedServices");
  const aggregatedPriceFeed = ref<AggregatodPriceFeed | null>(null);
  const averagePrice = ref(0);
  const services = ref<Array<string>>([]);
  let image: string | null = null;

  onMounted(async () => {
    if (priceFeedServices) {
      for (const service of priceFeedServices) {
        const priceFeed: PriceFeedModel | null =
          await service.getSinglePriceFeed(symbol);
        if (priceFeed && priceFeed.price) {
          averagePrice.value += priceFeed.price;
          services.value.push(service.serviceName);
        }

        if (priceFeed?.image && !image) {
          image = priceFeed?.image;
        }
      }
    }

    if (services.value.length < 1) {
      Object.assign(result, {
        success: false,
        data: null,
        message: `The asset with the symbol of '${symbol.fullSymbol}' is not found on our oracles`,
      } as Result);
    } else {
      const truncatedPrice = truncateDecimalPlace(
        averagePrice.value / services.value.length,
        3
      );

      aggregatedPriceFeed.value = {
        symbol,
        price: truncatedPrice,
        services: services.value,
        image,
        priceSign: symbol.tsyms == "USD" ? "$" : "",
      };
      Object.assign(result, {
        success: true,
        data: aggregatedPriceFeed.value,
      });
    }
  });
  return result;
}

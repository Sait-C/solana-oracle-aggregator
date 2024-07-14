import { PriceFeedModel, PriceFeedSymbol, Result } from "@/types";
import { onMounted, inject, ref, reactive } from "vue";
import { IPriceFeedService } from "@/services/feeds/IPriceFeedService";

export function useSinglePriceFeed(symbol: PriceFeedSymbol): Result {
  const result = reactive<Result>({
    success: false,
  });
  const priceFeedServices: Array<IPriceFeedService> | undefined =
    inject("priceFeedServices");
  const aggregatedPriceFeed = ref<PriceFeedModel | null>(null);
  const averagePrice = ref(0);
  const serviceCount = ref(0);

  onMounted(async () => {
    if (priceFeedServices) {
      for (const service of priceFeedServices) {
        const priceFeed: PriceFeedModel | null =
          await service.getSinglePriceFeed(symbol);
        if (priceFeed && priceFeed.price) {
          averagePrice.value += priceFeed.price;
          serviceCount.value++;
        }
      }
    }

    if (serviceCount.value < 1) {
      Object.assign(result, {
        success: false,
        data: null,
        message: `The asset with the symbol of '${symbol.fullSymbol}' is not found on our oracles`,
      } as Result);
    } else {
      aggregatedPriceFeed.value = {
        symbol,
        price: averagePrice.value / serviceCount.value,
      };
      Object.assign(result, {
        success: true,
        data: aggregatedPriceFeed.value,
      });
    }
  });
  return result;
}

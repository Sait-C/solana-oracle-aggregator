<a id="readme-top"></a>

[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <h3 align="center">Oracle Aggregator</h3>

  <p align="center">
    The way to get reliable, real price feed data with a flexible and clean system
    <br />
    <a href="#"><strong>View Live Site Demo</strong></a>
    ·
    <a href="#"><strong>View Video Demonstration</strong></a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project
![product-screenshot](https://github.com/user-attachments/assets/46539d6e-3cc5-4e59-8f8a-1f0661d2dafb)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Vue][Vue.js]][Vue-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started
Here, you can view the latest price feeds blended with Pyth and Chainlink and integrate this flexible open source system into your projects.

This project was developed within the scope of Solana Talent Olympics. The project was created with love and attention to accuracy and reliability of the aggregated price, effectiveness of integrating multiple oracles and user-friendliness of the frontend.

### Installation

1. Get a free Cryptocompare API Key at [https://ccdata.io/](https://ccdata.io/)

2. Get a free Syndica API Key for Solana RPC endpoint at [https://syndica.io/](https://syndica.io/)

3. Clone the repo
   ```sh
   git clone https://github.com/Sait-C/solana-oracle-aggregator.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Create ".env" file inside of "src" and enter your API keys
   ```js
   VUE_APP_NODE_ENV=development
   VUE_APP_BASE_URL=/
   VUE_APP_CRYPTOCOMPARE_API_KEY = 'ENTER YOUR API';
   VUE_APP_SYNDICA_API_KEY = 'ENTER YOUR API';
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

This project is prepared according to SOLID principles. You can use Oracle Aggregator by implementing the service structure in the project into your own project. In addition, interface injection is included in the project. You can easily integrate any other asset service or oracle service. At the The general service structure and logic are explained below:

### Types

_src/types/models/PriceFeedModel/index.ts:_

```js
// @desc It is used for fetched price feeds from Price Feed Services
export interface PriceFeedModel {
  symbol: PriceFeedSymbol;
  price: number | null;
  image?: string | null;
  priceSign?: string | null;
}

// @desc It is used for fetched assets from Asset Service
export interface PriceFeedSymbol {
  assetType: string | undefined;
  fullSymbol: string;
  fsyms: string | undefined;
  tsyms: string | undefined;
}

// @desc It is used for final data of price feeds
export interface AggregatodPriceFeed extends PriceFeedModel {
  services: Array<string>;
}
```

_src/types/models/result/index.ts:_

```js
// @desc It is used in returns
export interface Result {
  success: boolean;
  message?: string;
  data?: any | null;
}
```

_src/types/models/store/AssetState.ts:_

```js
import { PriceFeedSymbol } from "../models/PriceFeedModel";

// It is used to define asset store state
export interface AssetState {
  symbolsOfAssets: Array<PriceFeedSymbol>;
}
```

_src/types/models/store/ConnectionState.ts:_

```js
import { Connection } from "@solana/web3.js";

// @desc It is used to define connection store state
export interface ConnectionState {
  connection: Connection | null;
}
```

### Services

Services are kept in the _src->services_ folder.

#### IAssetService

This service is used to fetch all feed symbols. (In this project, **_new Pyth module_** is used for Asset fetching.)

```js
import { PriceFeedSymbol } from "@/types/models/PriceFeedModel";

export interface IAssetService {
  assetSymbols: Array<PriceFeedSymbol>;
  getSymbolsOfAssets(): Promise<PriceFeedSymbol[]>;
}
```

Sample Implementation of IAssetService: (you can find it in: **_src/services/assets/pyth.service.ts_**)

```js
import { PriceFeedSymbol } from "@/types";
import { IAssetService } from "./IAssetService";
import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import useSolanaConnection from "@/composables/useSolanaConnection";

const cluster: PythCluster = "mainnet-beta";

// Connect to Solana
const connection = await useSolanaConnection();
const pythPublicKey = getPythProgramKeyForCluster(cluster);

class PythAssetService implements IAssetService {
  pythClient: PythHttpClient | null;
  assetSymbols: Array<PriceFeedSymbol>;
  constructor() {
    // Create a new Pyth Client to send requests
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
        this.assetSymbols.push(assetSymbol);
      }
    }
    return this.assetSymbols;
  }
}

export default new PythAssetService();
```

- tsyms is "To Symbol"
- fsyms is "From Symbol"
- assetType (Crypto, FX, etc..)
- fullSymbol is "AssetType.FromSymbol/ToSymbol"

#### IPriceFeedService

This service is the service that fetches data such as current price and iamge for each of feed which is claimed via asset service from an Oracle.

```js
import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";

export interface IPriceFeedService {
  serviceName: string;
  getAllPriceFeeds(): Promise<PriceFeedModel[]>;
  getSinglePriceFeed(symbol: PriceFeedSymbol): Promise<PriceFeedModel | null>;
}
```

- **serviceName** is used to know which services are included in the calculation because some feeds are not available in every Oracle to fetch
- **getAllPriceFeeds:** It uses asset service to pull all feeds and send some requests to fetch data for each feed
- **getSinglePriceFeed:** It gets PriceFeedSymbol which is claimed by asset service and send some requests to API to get related data

Sample implementation of IPriceFeedService: (you can find it in: **_src/services/feeds/pyth.service.ts_**)

```js
// src/services/pythService.js

import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from "@pythnetwork/client";
import { IPriceFeedService } from "./IPriceFeedService";
import { PriceFeedModel, PriceFeedSymbol } from "@/types/models/PriceFeedModel";
import { IAssetService } from "../assets/IAssetService";
import pythService from "../assets/pyth.service";
import useSolanaConnection from "@/composables/useSolanaConnection";

const cluster: PythCluster = "mainnet-beta";

const connection = await useSolanaConnection();
const pythPublicKey = getPythProgramKeyForCluster(cluster);

class PythService implements IPriceFeedService {
  serviceName = "Pyth";
  pythClient: PythHttpClient | null;
  assetService: IAssetService;
  constructor(assetService: IAssetService) {
    this.assetService = assetService;
    this.pythClient = new PythHttpClient(connection, pythPublicKey);
  }

  // @desc Loop through symbols of assets and fetch prices each of them
  async getAllPriceFeeds(): Promise<PriceFeedModel[]> {
    const data = await this.pythClient?.getData();
    const priceFeeds = [] as Array<PriceFeedModel>;
    if (
      this.assetService.assetSymbols.length > 0 &&
      data &&
      data.symbols.length > 0
    ) {
      for (const symbol of this.assetService.assetSymbols) {
        const price = data?.productPrice.get(symbol.fullSymbol);
        // Check if it is available
        if (price?.aggregate.status) {
          const priceFeed: PriceFeedModel = {
            symbol,
            price: price?.aggregate.price ?? null,
          };
          priceFeeds.push(priceFeed);
        }
      }
    }
    return priceFeeds;
  }

  // @desc Get single price feed by price feed symbol
  async getSinglePriceFeed(
    symbol: PriceFeedSymbol
  ): Promise<PriceFeedModel | null> {
    const data = await this.pythClient?.getData();
    const price = data?.productPrice.get(symbol.fullSymbol);
    // Check if it is available
    if (price?.aggregate.status) {
      const priceFeed: PriceFeedModel = {
        symbol,
        price: price?.aggregate.price ?? null,
      };
      return priceFeed;
    }

    return null;
  }
}

export default new PythService(pythService);

```

### Injection

This is where flexibility comes in... We never call services directly. We just request services and use whatever service is integrated and provided.

#### globalProvides.ts

**_src/plugins/globalProvides.ts_**

```js
import pythAssetService from "@/services/assets/pyth.service";
import chainlinkService from "@/services/feeds/chainlink.service";
import pythPriceFeedService from "@/services/feeds/pyth.service";

// src/plugins/globalProvides.ts
export default {
  install(app: any) {
    app.provide("assetService", pythAssetService);
    app.provide("priceFeedServices", [pythPriceFeedService, chainlinkService]);
    // Add more services as needed
  },
};
```

### Aggregatation via composable

With the help of a custom composable, we get data via our services and we create a result with AggregatodPriceFeed data

```js
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

```

### Now we can use the composable in our custom data component

```js
<template>
  <div class="price-feed-card" v-if="result.data">
    <div class="header-of-card">
      <img
        v-if="result.data.image"
        :src="result.data.image"
        alt="Symbol Logo"
      />
      <div class="symbol">
        <span class="symbol-asset-type">{{
          result.data.symbol.assetType
        }}</span>
        <span class="symbol-name"
          >{{ result.data.symbol.fsyms }}/{{ result.data.symbol.tsyms }}</span
        >
      </div>
    </div>
    <div class="body-of-card">
      <span class="price" v-if="result.success">
        {{ result.data.priceSign }}{{ result.data.price }}
      </span>
    </div>
    <div class="footer-of-card">
      <h4 class="footer-head">Services:</h4>
      <ul class="services-list">
        <li
          v-for="service in result.data.services"
          v-bind:key="service"
          class="tag"
        >
          {{ service }}
        </li>
      </ul>
    </div>
  </div>
  <span v-if="result && !result.success">
    <div class="price-feed-card">
      <div class="header-of-card">
        <AnimatedPlaceHolder height="60px" width="60px" borderRadius="50%" />
        <div class="symbol">
          <span class="symbol-asset-type">
            <AnimatedPlaceHolder height="20px" width="40px" />
          </span>
          <span class="symbol-name"
            ><AnimatedPlaceHolder height="40px" width="130px"
          /></span>
        </div>
      </div>
      <div class="body-of-card">
        <AnimatedPlaceHolder
          v-if="!result.message"
          height="40px"
          width="200px"
        />
        <p v-if="result.message" class="error">
          {{ result.message }}
        </p>
      </div>
      <div class="footer-of-card">
        <h4 class="footer-head">
          <AnimatedPlaceHolder height="40px" width="200px" />
        </h4>
      </div>
    </div>
  </span>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useSinglePriceFeed } from "@/composables/useSinglePriceFeed";
import { PriceFeedSymbol } from "@/types";
import AnimatedPlaceHolder from "@/components/custom/placeholder/AnimatedPlaceholder.vue";

const props = defineProps({
  symbol: { type: Object as () => PriceFeedSymbol, required: true },
});

const result = useSinglePriceFeed(props.symbol);
</script>

```

## Intersection Observer

I wanted to collect and display all the data on a single page. To ensure optimization, I wrote a custom intersection observer directive to ensure that the data is loaded as I scroll down.

**_src/directives/intersectionObserver.js_**

```js
import { Directive } from "vue";

const intersectionObserver: Directive = {
  beforeMount(el, binding) {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          binding.value();
          observer.unobserve(el);
        }
      });
    }, options);

    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    el._observer.unobserve(el);
  },
};

export default intersectionObserver;
```

### Usage of intersectionObserver in a Price Feed Listing Component

```js
<template>
  <div class="top-of-list container">
    <CustomTextInputComponent
      name="search"
      type="text"
      label="Search"
      :showLabel="false"
      placeholder="Search..."
      v-model:value="searchKey"
    />
  </div>
  <div id="price-feed-list" class="container">
    <div
      v-for="symbol in filteredAssets"
      :key="symbol.fullSymbol"
      v-intersection-observer="() => loadSymbol(symbol.fullSymbol)"
      class="intersect-container"
    >
      <PriceFeedDataComponent
        v-if="visibleSymbols.includes(symbol.fullSymbol)"
        :symbol="symbol"
      />
    </div>
  </div>
</template>
```
```js
<script setup lang="ts">
import PriceFeedDataComponent from "@/components/custom/solana/PriceFeedDataComponent.vue";
import { useStore } from "vuex";
import { ref, computed, onBeforeMount } from "vue";
import CustomTextInputComponent from "@/components/custom/form/CustomTextInputComponent.vue";
import { PriceFeedSymbol } from "@/types";

const store = useStore();

const searchKey = ref("");

const symbolsOfAssets = computed(
  () => store.getters["asset/getSymbolsOfAssets"]
);

const filteredAssets = computed(() =>
  symbolsOfAssets.value.filter((symbol: PriceFeedSymbol) => {
    return symbol.fullSymbol
      ? symbol.fullSymbol.toLowerCase().includes(searchKey.value.toLowerCase())
      : null;
  })
);
const visibleSymbols = ref<Array<string>>([]);

onBeforeMount(async () => {
  if (symbolsOfAssets.value.length <= 0) {
    await store.dispatch("asset/getAllSymbolsOfAssets");
  }
});

const loadSymbol = (symbol: string) => {
  if (!visibleSymbols.value.includes(symbol)) {
    visibleSymbols.value.push(symbol);
  }
};
</script>
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Muharrem Sait Çoktaş - [@MSCOktas](https://twitter.com/MSCOktas) - coktasmuharremsait@gmail.com

Project Link: [https://github.com/Sait-C/solana-oracle-aggregator](https://github.com/Sait-C/solana-oracle-aggregator)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

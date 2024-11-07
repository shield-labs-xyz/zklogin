import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { provider } from "./chain.js";
import { CoinbaseWalletService } from "./services/CoinbaseWalletService.js";
import { JwtAccountService } from "./services/JwtAccountService.js";
import { QueriesService } from "./services/QueriesService.svelte.js";
import { bundlerClient, publicClient } from "./viemClients.js";

export * from "./viemClients.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
    },
  },
});

const queries = new QueriesService(queryClient);
const coinbase = new CoinbaseWalletService(publicClient, bundlerClient);
const jwtAccount = new JwtAccountService(publicClient, provider.provider);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  coinbase,
  jwtAccount,
};

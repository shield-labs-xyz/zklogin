import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { CoinbaseWalletService } from "./services/CoinbaseWalletService.js";
import { JwtAccountService } from "./services/JwtAccountService.js";
import { QueriesService } from "./services/QueriesService.svelte.js";
import { Web3ModalService } from "./services/Web3ModalService.svelte.js";
import { bundlerClient, publicClient } from "./viemClients.js";

export * from "./viemClients.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
    },
  },
});

const web3modal = Web3ModalService.getSingleton();
const queries = new QueriesService(queryClient);
const coinbase = new CoinbaseWalletService(publicClient, bundlerClient);
const jwtAccount = new JwtAccountService(publicClient);

export const lib = {
  queries,
  web3modal,
  coinbase,
  jwtAccount,
};

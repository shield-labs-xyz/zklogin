import { browser } from "$app/environment";
import { zklogin } from "@shield-labs/zklogin";
import { QueryClient } from "@tanstack/svelte-query";
import { ChainService, provider } from "./chain.js";
import { JwtAccountService } from "./services/JwtAccountService.js";
import { QueriesService } from "./services/QueriesService.svelte.js";
import { publicClient } from "./viemClients.js";

export * from "./viemClients.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
    },
  },
});

const chain = new ChainService();
const queries = new QueriesService(queryClient);
const jwtProver = new zklogin.JwtProverService(
  new zklogin.PublicKeyRegistryService(""),
);
const jwtAccount = new JwtAccountService(
  publicClient,
  provider,
  jwtProver.publicKeyRegistry,
);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  chain,
  jwtProver,
  jwtAccount,
};

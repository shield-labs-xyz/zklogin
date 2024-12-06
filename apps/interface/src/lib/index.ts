import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { provider } from "./chain.js";
import { JwtAccountService } from "./services/JwtAccountService.js";
import { JwtProverService } from "./services/JwtProverService.js";
import { PublicKeyRegistryService } from "./services/PublicKeysRegistryService.js";
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

const queries = new QueriesService(queryClient);
const publicKeyRegistry = new PublicKeyRegistryService();
const jwtAccount = new JwtAccountService(
  publicClient,
  provider.provider,
  publicKeyRegistry,
);
const jwtProver = new JwtProverService(publicKeyRegistry);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  publicKeyRegistry,
  jwtProver,
  jwtAccount,
};

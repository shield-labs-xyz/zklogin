import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { Eip7702Service } from "./services/Eip7702Service.js";
import { PublicKeysRegistryService } from "./services/PublicKeysRegistryService.js";
import { QueriesService } from "./services/QueriesService.svelte.js";
import { WebAuthnService } from "./services/WebAuthnService.js";
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
const publicKeysRegistry = new PublicKeysRegistryService();
const webAuthn = new WebAuthnService();
const eip7702 = new Eip7702Service(publicKeysRegistry, publicClient);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  eip7702,
  webAuthn,
  publicKeysRegistry,
};

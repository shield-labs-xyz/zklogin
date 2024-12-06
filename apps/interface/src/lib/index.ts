import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { Eip7702Service } from "./services/Eip7702Service.js";
import { JwtProverService } from "./services/JwtProverService.js";
import { PublicKeyRegistryService } from "./services/PublicKeysRegistryService.js";
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
const webAuthn = new WebAuthnService();
const publicKeyRegistry = new PublicKeyRegistryService();
const jwtProver = new JwtProverService(publicKeyRegistry);
const eip7702 = new Eip7702Service(jwtProver, publicKeyRegistry, publicClient);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  eip7702,
  webAuthn,
  publicKeyRegistry,
  jwtProver,
};

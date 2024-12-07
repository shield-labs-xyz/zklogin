import { browser } from "$app/environment";
import { zklogin } from "@shield-labs/zklogin";
import { QueryClient } from "@tanstack/svelte-query";
import { provider } from "./chain.js";
import { Eip7702Service } from "./services/Eip7702Service.js";
import { JwtAccountService } from "./services/JwtAccountService.js";
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
const jwtProver = new zklogin.JwtProverService(
  new zklogin.PublicKeyRegistryService(),
);
const eip7702 = new Eip7702Service(jwtProver, publicClient);
const jwtAccount = new JwtAccountService(
  publicClient,
  provider,
  jwtProver.publicKeyRegistry,
);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  eip7702,
  webAuthn,
  jwtProver,
};

import { browser } from "$app/environment";
import { zklogin } from "@shield-labs/zklogin";
import { QueryClient } from "@tanstack/svelte-query";
import { ChainService } from "./chain.js";
import { Eip7702Service } from "./services/Eip7702Service.js";
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

const chain = new ChainService();
const queries = new QueriesService(queryClient);
const webAuthn = new WebAuthnService();
const zkLogin = new zklogin.ZkLogin(new zklogin.PublicKeyRegistry(""));
const eip7702 = new Eip7702Service(zkLogin, publicClient);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  chain,
  zkLogin,
  eip7702,
  webAuthn,
};

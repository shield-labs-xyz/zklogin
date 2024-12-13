import { browser } from "$app/environment";
import { PUBLIC_AUTH_GOOGLE_ID } from "$env/static/public";
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
const zkLogin = new zklogin.ZkLogin(new zklogin.PublicKeyRegistry(""));
const authProvider = new zklogin.GoogleProvider(PUBLIC_AUTH_GOOGLE_ID);
const jwtAccount = new JwtAccountService(publicClient, provider, zkLogin);
const queries = new QueriesService(authProvider, queryClient);

const APP_NAME = "zkLogin";
export const lib = {
  APP_NAME,
  queries,
  chain,
  zkLogin,
  authProvider,
  jwtAccount,
};

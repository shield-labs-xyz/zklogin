import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import { QueriesService } from "./services/QueriesService.svelte.js";
import { Web3ModalService } from "./services/Web3ModalService.svelte.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
    },
  },
});

const web3modal = Web3ModalService.getSingleton();
const queries = new QueriesService(queryClient);

export const lib = {
  queries,
  web3modal,
};

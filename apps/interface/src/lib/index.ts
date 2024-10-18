import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
} from "viem";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
import { privateKeyToAccount } from "viem/accounts";
import { CoinbaseWalletService } from "./services/CoinbaseWalletService.js";
import { JwtAccountService } from "./services/JwtAccountService.js";
import { QueriesService } from "./services/QueriesService.svelte.js";
import { chain, Web3ModalService } from "./services/Web3ModalService.svelte.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      enabled: browser,
    },
  },
});

export const publicClient = createPublicClient({
  chain,
  transport: http(),
}) as PublicClient;

export const owner = privateKeyToAccount(
  "0x18a30f5bbd37a5da63f5429133c06f43358d54b0b22eff921b98f92d93a98737",
);
export const recoveryOwner = privateKeyToAccount(
  "0x28a30f5bbd37a5da63f5429133c06f43358d54b0b22eff921b98f92d93a98737",
);
export const walletClient = createWalletClient({
  account: owner,
  chain,
  transport: http(),
});

const paymasterClient = createPaymasterClient({
  transport: http(
    "https://api.pimlico.io/v2/84532/rpc?apikey=pim_NN7RHTfDreHNUP6RTrkg7p",
  ),
});
export const bundlerClient = createBundlerClient({
  client: publicClient,
  paymaster: paymasterClient,
  transport: http(
    "https://api.pimlico.io/v2/84532/rpc?apikey=pim_NN7RHTfDreHNUP6RTrkg7p",
  ),
});

const web3modal = Web3ModalService.getSingleton();
const queries = new QueriesService(queryClient);
const coinbase = new CoinbaseWalletService(publicClient, bundlerClient);
const jwtAccount = new JwtAccountService(publicClient, bundlerClient);

export const lib = {
  queries,
  web3modal,
  coinbase,
  jwtAccount,
};

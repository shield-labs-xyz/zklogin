import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";
import type { ethers } from "ethers";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type Address,
  type Client,
  type PublicClient,
} from "viem";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
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

const paymasterClient = createPaymasterClient({
  transport: http(
    "https://api.pimlico.io/v2/84532/rpc?apikey=pim_NN7RHTfDreHNUP6RTrkg7p",
  ),
});

export function getBundlerClient(client: Client) {
  return createBundlerClient({
    client,
    paymaster: paymasterClient,
    transport: http(
      "https://api.pimlico.io/v2/84532/rpc?apikey=pim_NN7RHTfDreHNUP6RTrkg7p",
    ),
  });
}

export async function ethersSignerToWalletClient(signer: ethers.Signer) {
  return createWalletClient({
    account: (await signer.getAddress()) as Address,
    transport: custom({
      request: ({ method, params }) =>
        (signer.provider! as ethers.JsonRpcApiProvider).send(method, params),
    }),
  }) as any;
}

/**
 * @deprecated use {@link getBundlerClient}
 */
export const bundlerClient = getBundlerClient(publicClient);

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

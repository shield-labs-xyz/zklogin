import type { ethers } from "ethers";
import {
  type Address,
  type Client,
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type PublicClient,
} from "viem";
import {
  createBundlerClient,
  createPaymasterClient,
} from "viem/account-abstraction";
import { chain } from "./chain.js";

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

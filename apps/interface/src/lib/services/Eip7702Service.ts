import { chain } from "$lib/chain";
import { decodeJwt } from "$lib/utils";
import deployments from "@repo/contracts/deployments.json";
import { EoaAccount__factory } from "@repo/contracts/typechain-types";
import { createWalletClient, http, type Account, type Client } from "viem";
import { signAuthorization } from "viem/experimental";
import { getAccountIdFromJwt } from "./JwtAccountService";

export class Eip7702Service {
  constructor(private client: Client) {}

  async authorize({ account, jwt }: { account: Account; jwt: string }) {
    const contractAddress = deployments[chain.id].contracts
      .EoaAccount as `0x${string}`;
    const auth = await signAuthorization(this.client, {
      account,
      contractAddress,
    });

    const accountClient = createWalletClient({
      account: account,
      chain: this.client.chain,
      transport: http(),
    });

    const webauthnPublicKey = { x: 0n, y: 0n };
    const { accountId } = await getAccountIdFromJwt(decodeJwt(jwt));
    const publicKeyRegistry = deployments[chain.id].contracts
      .PublicKeyRegistry as `0x${string}`;
    const proofVerifier = deployments[chain.id].contracts
      .UltraVerifier as `0x${string}`;
    const hash = await accountClient.writeContract({
      abi: EoaAccount__factory.abi,
      address: account.address,
      functionName: "setAccountId",
      args: [webauthnPublicKey, accountId, publicKeyRegistry, proofVerifier],
      authorizationList: [auth],
      account: account,
      chain: this.client.chain,
    });

    // const result = await readContract(this.client, {
    //   address: account.address,
    //   abi: EoaAccount__factory.abi,
    //   functionName: "hello",
    //   args: [],
    // });
    // console.log("result", result);
    return hash;
  }
}

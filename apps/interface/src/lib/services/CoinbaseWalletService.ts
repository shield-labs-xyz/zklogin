import { LocalStore } from "$lib/localStorage.svelte";
import { ethers } from "ethers";
import { range } from "lodash-es";
import {
  getAddress,
  getContract,
  hexToBigInt,
  size,
  slice,
  toHex,
  type Address,
  type Hex,
  type LocalAccount,
  type PublicClient,
} from "viem";
import {
  toCoinbaseSmartAccount,
  type BundlerClient,
  type ToCoinbaseSmartAccountReturnType,
  type WebAuthnAccount,
} from "viem/account-abstraction";

export type OwnerAccount = LocalAccount | WebAuthnAccount;
export class CoinbaseWalletService {
  readonly #address = new LocalStore<Address | undefined>(
    "coinbase-wallet-address",
    undefined,
  );
  constructor(
    private client: PublicClient,
    private bundlerClient: BundlerClient,
  ) {}

  get address() {
    return this.#address.value;
  }

  async getAccount(
    owner: OwnerAccount,
  ): Promise<ToCoinbaseSmartAccountReturnType> {
    const address = this.#address.value;
    const account = await toCoinbaseSmartAccount({
      client: this.client,
      owners: [owner],
      address,
    });
    this.#address.value = account.address;
    return account;
  }

  async addOwner(owner: LocalAccount, newOwner: { address: Address }) {
    const account = await this.getAccount(owner);
    const data = new ethers.Interface([
      "function addOwnerAddress(address owner)",
    ]).encodeFunctionData("addOwnerAddress", [newOwner.address]) as Hex;
    return await this.bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to: account.address,
          data,
        },
      ],
    });
  }

  async getOwners(owner: OwnerAccount) {
    const account = await this.getAccount(owner);
    const deployed: boolean = await isDeployed(account, this.client);
    if (!deployed) {
      return [owner.type === "local" ? owner.address : owner.publicKey];
    }
    const contract = getContract({
      address: account.address,
      abi: account.abi,
      client: this.client,
    });
    const count = Number(await contract.read.ownerCount());
    const rawOwners = await Promise.all(
      range(count).map((i) => contract.read.ownerAtIndex([BigInt(i)])),
    );
    const owners = rawOwners.map((o) => {
      const len = size(toHex(hexToBigInt(o)));
      if (len <= 20) {
        return getAddress(slice(o, -20));
      }
      return o;
    });

    return owners;
  }
}

export async function isDeployed(
  { address }: { address: Address },
  publicClient: PublicClient,
) {
  const code = await publicClient.getCode({ address });
  const deployed = size(code ?? "0x") > 0;
  return deployed;
}

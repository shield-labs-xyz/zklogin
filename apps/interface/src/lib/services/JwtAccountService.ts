import { utils } from "@shield-labs/utils";
import { zklogin } from "@shield-labs/zklogin";
import deployments from "@shield-labs/zklogin-contracts/deployments.json";
import {
  SimpleAccount__factory,
  SimpleAccountFactory__factory,
} from "@shield-labs/zklogin-contracts/typechain-types";
import type { ZkLogin } from "@shield-labs/zklogin-contracts/typechain-types/contracts/SimpleAccount.js";
import { ethers } from "ethers";
import { assert } from "ts-essentials";
import type { Address, Chain, Hex, PublicClient, SignableMessage } from "viem";
import {
  entryPoint07Abi,
  entryPoint07Address,
  getUserOperationHash,
  toSmartAccount,
} from "viem/account-abstraction";
import { isDeployed } from "../utils";
import {
  ethersSignerToWalletClient,
  getBundlerClient,
} from "../viemClients.js";

export class JwtAccountService {
  constructor(
    private publicClient: PublicClient & { chain: Chain },
    private provider: ethers.Provider,
    private zkLogin: zklogin.ZkLogin,
  ) {}

  async getAccount(
    jwt: string,
    owner: ethers.Signer,
  ): Promise<JwtSmartAccount> {
    const accountData = await this.zkLogin.getAccountDataFromJwt(
      jwt,
      this.publicClient.chain.id,
    );
    const account = await toJwtSmartAccount(
      owner,
      this.publicClient,
      accountData,
    );
    return account;
  }

  async setOwner(
    jwt: string,
    owner: ethers.Signer,
    params: Omit<ZkLogin.VerificationDataStruct, "jwtNonce">,
  ) {
    const verificationData = {
      ...params,
      jwtNonce: ethers.zeroPadValue(await owner.getAddress(), 32),
    };

    const account = await this.getAccount(jwt, owner);

    const hash = await this.zkLogin.publicKeyRegistry.requestPublicKeysUpdate(
      this.publicClient.chain.id,
    );
    if (hash) {
      await this.publicClient.waitForTransactionReceipt({ hash });
    }

    const bundlerClient = getBundlerClient(
      await ethersSignerToWalletClient(owner),
    );
    return await bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to: account.address,
          data: SimpleAccount__factory.createInterface().encodeFunctionData(
            "setOwner",
            [verificationData],
          ) as Hex,
        },
      ],
    });
  }

  async currentOwner(account: JwtSmartAccount) {
    const deployed: boolean = await isDeployed(account, this.publicClient);
    if (!deployed) {
      return null;
    }
    const contract = SimpleAccount__factory.connect(
      account.address,
      this.provider,
    );
    const ownerInfo = await contract.ownerInfo();
    const ownerAddress = await contract.currentOwner();
    return {
      owner: ownerAddress,
      expirationTimestamp: ethers.toNumber(ownerInfo.expirationTimestamp),
    };
  }
}

export async function toJwtNonce(address: ethers.AddressLike) {
  return ethers
    .zeroPadValue(await ethers.resolveAddress(address), 32)
    .toLowerCase()
    .slice("0x".length);
}

export interface JwtSmartAccount
  extends Awaited<ReturnType<typeof toJwtSmartAccount>> {}

async function toJwtSmartAccount(
  owner: ethers.Signer,
  client: PublicClient,
  accountData: ZkLogin.AccountDataStruct,
) {
  const accountIface = SimpleAccount__factory.createInterface();
  const unrestrictedSelectors = [accountIface.getFunction("setOwner")].map(
    (x) => x.selector,
  );
  const chainId = client.chain!.id as unknown as keyof typeof deployments;
  assert(deployments[chainId], `deployments for ${chainId} not found`);

  const factoryAddress = deployments[chainId].contracts
    .SimpleAccountFactory as `0x${string}`;
  const factory = SimpleAccountFactory__factory.connect(factoryAddress, owner);
  const factoryCalldata = factory.interface.encodeFunctionData(
    "createAccount",
    [accountData],
  ) as Hex;

  const entryPoint = {
    address: entryPoint07Address,
    abi: entryPoint07Abi,
    version: "0.7",
  } as const;

  async function signMessage({ message }: { message: SignableMessage }) {
    const toSign =
      typeof message === "string" ? message : ethers.getBytes(message.raw);
    return (await owner.signMessage(toSign)) as Hex;
  }
  const account = await toSmartAccount({
    client,
    entryPoint,
    async getFactoryArgs() {
      return {
        factory: (await factory.getAddress()) as Address,
        factoryData: factoryCalldata,
      };
    },
    async getStubSignature() {
      return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
    },
    async signMessage({ message }) {
      return await signMessage({ message });
    },
    async signTypedData(parameters) {
      return (await owner.signTypedData(
        parameters.domain as any,
        parameters.types as any,
        parameters.message as any,
      )) as Hex;
    },
    async decodeCalls() {
      throw new Error("decodeCalls not implemented");
    },
    async signUserOperation({ chainId = client.chain!.id, ...userOperation }) {
      if (
        unrestrictedSelectors.some((sel) =>
          userOperation.callData.startsWith(sel),
        )
      ) {
        return await this.getStubSignature();
      }

      const address = await this.getAddress();
      const hash = getUserOperationHash({
        chainId,
        entryPointAddress: entryPoint.address,
        entryPointVersion: entryPoint.version,
        userOperation: {
          ...userOperation,
          sender: address,
        },
      });

      const sig = await signMessage({ message: { raw: hash } });
      return sig;
    },
    async getAddress() {
      return (await factory.getAccountAddress(accountData)) as Address;
    },
    async encodeCalls(calls) {
      if (calls.length === 1) {
        const call = calls[0]!;
        if (
          utils.isAddressEqual(call.to, account.address) &&
          (call.value ?? 0n) === 0n &&
          call.data &&
          unrestrictedSelectors.some((sel) => call.data?.startsWith(sel))
        ) {
          return call.data;
        }
      }
      return accountIface.encodeFunctionData("executeBatch", [
        calls.map((x) => ({
          target: x.to,
          value: x.value ?? 0n,
          data: x.data ?? "0x",
        })),
      ]) as Hex;
    },

    userOperation: {
      // TODO: is this needed?
      async estimateGas(userOperation) {
        return {
          preVerificationGas: BigInt(
            Math.max(Number(userOperation.preVerificationGas ?? 0n), 2_000_000),
          ),
          verificationGasLimit: BigInt(
            Math.max(
              Number(userOperation.verificationGasLimit ?? 0n),
              2_000_000,
            ),
          ),
        };
      },
    },
  });

  return account;
}

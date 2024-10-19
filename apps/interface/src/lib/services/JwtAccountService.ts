import { ethersSignerToWalletClient, getBundlerClient } from "$lib";
import { LocalStore } from "$lib/localStorage.svelte";
import {
  base64UrlToBase64,
  base64UrlToBigInt,
  decodeJwt,
  splitJwt,
} from "$lib/utils";
import {
  bnToLimbStrArray,
  bnToRedcLimbStrArray,
} from "@mach-34/noir-bignum-paramgen";
import deployments from "@repo/contracts/deployments.json";
import {
  SimpleAccount__factory,
  SimpleAccountFactory__factory,
  type SimpleAccount,
} from "@repo/contracts/typechain-types";
import { utils } from "@repo/utils";
import { ethers } from "ethers";
import ky from "ky";
import { assert } from "ts-essentials";
import type { Address, Hex, PublicClient, SignableMessage } from "viem";
import {
  entryPoint07Abi,
  entryPoint07Address,
  getUserOperationHash,
  toSmartAccount,
} from "viem/account-abstraction";
import { isDeployed } from "./CoinbaseWalletService";

// Note: keep in sync with Noir
const JWT_HEADER_MAX_LEN = 256;
// Note: keep in sync with Noir
const JWT_PAYLOAD_JSON_MAX_LEN = 768;
// Note: keep in sync with Noir
const JWT_PAYLOAD_MAX_LEN = Math.ceil(JWT_PAYLOAD_JSON_MAX_LEN / 3) * 4;
// Note: keep in sync with Noir
const JWT_SUB_MAX_LEN = 64;
// Note: keep in sync with Noir
const JWT_AUD_MAX_LEN = 256;
// Note: keep in sync with Noir
const JWT_NONCE_LEN = 40;

export class JwtAccountService {
  #address = new LocalStore<Address | undefined>(
    "jwt-account-address",
    undefined,
  );

  constructor(private publicClient: PublicClient) {}

  get address() {
    return this.#address.value;
  }

  async getAccount(jwt: string, owner: ethers.Signer) {
    const account = await toJwtSmartAccount(owner, jwt, this.publicClient);
    this.#address.value = account.address;
    return account;
  }

  async setOwner(
    jwt: string,
    owner: ethers.Signer,
    verificationData: VerificationData,
  ) {
    assert(
      utils.isAddressEqual(await owner.getAddress(), verificationData.jwtNonce),
      "jwt.nonce mismatch",
    );
    const account = await this.getAccount(jwt, owner);

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

  async currentOwner(jwt: string, owner: ethers.Signer) {
    const account = await this.getAccount(jwt, owner);
    const deployed: boolean = await isDeployed(account, this.publicClient);
    if (!deployed) {
      return await owner.getAddress();
    }
    const contract = SimpleAccount__factory.connect(account.address, owner);
    return (await contract.currentOwner()) as Address;
  }
}

export interface VerificationData {
  proof: Hex;
  jwtIat: number;
  jwtNonce: Address;
  publicKeyLimbs: string[];
  publicKeyRedcLimbs: string[];
}

export async function toJwtSmartAccount(
  owner: ethers.Signer,
  jwt: string,
  client: PublicClient,
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
    [await getJwtAccountInitParams(jwt)],
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
      return (await factory.getAccountAddress(
        await getJwtAccountInitParams(jwt),
      )) as Address;
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

export const authProviderId = ethers.id("accounts.google.com");
async function getJwtAccountInitParams(
  jwt: string,
): Promise<SimpleAccount.InitializeParamsStruct> {
  const input = await prepareJwt(jwt);
  return {
    accountId: input.account_id,
    jwtAud: ethers.toUtf8String(Uint8Array.from(input.jwt_aud)),
    authProviderId,
  };
}

export async function prepareJwt(jwt: string) {
  const [headerBase64Url, payloadBase64Url, signatureBase64Url] = splitJwt(jwt);

  const header_and_payload = toBoundedVec(
    Array.from(ethers.toUtf8Bytes(`${headerBase64Url}.${payloadBase64Url}`)),
    JWT_HEADER_MAX_LEN + 1 + JWT_PAYLOAD_MAX_LEN,
  );
  const payload_json = utils.arrayPadEnd(
    Array.from(ethers.decodeBase64(base64UrlToBase64(payloadBase64Url))),
    JWT_PAYLOAD_JSON_MAX_LEN,
    " ".charCodeAt(0),
  );
  const showDebug = false;
  if (showDebug) {
    console.log(
      `
      global header_base64url: [u8; ${headerBase64Url.length}] = ${JSON.stringify(headerBase64Url)}.as_bytes();
      global payload_base64url: [u8; ${payloadBase64Url.length}] = ${JSON.stringify(payloadBase64Url)}.as_bytes();
      global payload_json_padded = ${JSON.stringify(ethers.toUtf8String(Uint8Array.from(payload_json)))}.as_bytes();`,
    );
  }
  const signature_limbs = bnToLimbStrArray(
    base64UrlToBigInt(signatureBase64Url),
  );
  const jwtDecoded = decodeJwt(jwt);
  const publicKeys = await getGooglePublicKeys();
  const publicKey = publicKeys.find((key) => key.kid === jwtDecoded.header.kid);
  assert(publicKey, "publicKey not found");
  const salt = 0;
  const { pedersenHash } = await import("@aztec/foundation/crypto");
  const account_id = pedersenHash([
    ...utils.arrayPadEnd(
      Array.from(ethers.toUtf8Bytes(jwtDecoded.payload.sub)),
      JWT_SUB_MAX_LEN,
      0,
    ),
    salt,
  ]).toString();
  const jwt_iat = jwtDecoded.payload.iat;
  const jwt_aud = utils.arrayPadEnd(
    Array.from(ethers.toUtf8Bytes(jwtDecoded.payload.aud)),
    JWT_AUD_MAX_LEN,
    0,
  );
  const jwt_nonce = encodedAddressAsJwtNonce(jwtDecoded.payload.nonce);
  const input = {
    header_and_payload,
    payload_json,
    signature_limbs,
    account_id,
    salt,
    jwt_iat,
    jwt_aud,
    jwt_nonce,
    public_key_limbs: publicKey.limbs.public_key_limbs,
    public_key_redc_limbs: publicKey.limbs.public_key_redc_limbs,
  };
  if (showDebug) {
    console.log(input);
    console.log("public key", publicKey);
    console.log("jwt", jwtDecoded);
  }
  return input;
}

export function encodedAddressAsJwtNonce(address: string) {
  assert(address === address.toLowerCase(), "address must be lowercase");
  if (address.startsWith("0x")) {
    address = address.slice(2);
  }
  return utils.arrayPadEnd(
    Array.from(ethers.toUtf8Bytes(address)),
    JWT_NONCE_LEN,
    0,
  );
}

function toBoundedVec(arr: number[], maxLen: number) {
  const storage = utils.arrayPadEnd(arr, maxLen, 0);
  return { storage, len: arr.length };
}

async function getGooglePublicKeys() {
  const res = await ky
    .get("https://www.googleapis.com/oauth2/v3/certs")
    .json<{ keys: { n: string; kid: string }[] }>();
  const keys = res.keys.map((key) => {
    const publicKey = base64UrlToBigInt(key.n);
    const limbs = {
      public_key_limbs: bnToLimbStrArray(publicKey),
      public_key_redc_limbs: bnToRedcLimbStrArray(publicKey),
    };
    return { kid: key.kid, limbs };
  });
  return keys;
}

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
import circuit from "@repo/contracts/noir/target/jwt_account.json";
import {
  SimpleAccount__factory,
  SimpleAccountFactory__factory,
  type SimpleAccount,
} from "@repo/contracts/typechain-types";
import type { JwtVerifier } from "@repo/contracts/typechain-types/contracts/SimpleAccount.js";
import { utils } from "@repo/utils";
import { ethers } from "ethers";
import ky from "ky";
import ms from "ms";
import { assert } from "ts-essentials";
import type { Address, Hex, PublicClient, SignableMessage } from "viem";
import {
  entryPoint07Abi,
  entryPoint07Address,
  getUserOperationHash,
  toSmartAccount,
} from "viem/account-abstraction";
import {
  ethersSignerToWalletClient,
  getBundlerClient,
} from "../viemClients.js";
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

// Note: keep in sync with Solidity
export const JWT_EXPIRATION_TIME = Math.floor(ms("1 hour") / 1000);

export class JwtAccountService {
  constructor(private publicClient: PublicClient) {}

  async getAccount(jwt: string, owner: ethers.Signer) {
    const account = await toJwtSmartAccount(owner, jwt, this.publicClient);
    return account;
  }

  async setOwner(
    jwt: string,
    owner: ethers.Signer,
    verificationData: JwtVerifier.VerificationDataStruct,
  ) {
    assert(
      utils.isAddressEqual(
        await owner.getAddress(),
        await ethers.resolveAddress(verificationData.jwtNonce),
      ),
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
      return null;
    }
    const contract = SimpleAccount__factory.connect(account.address, owner);
    const ownerInfo = await contract.ownerInfo();
    const ownerAddress = await contract.currentOwner();
    return {
      owner: ownerAddress,
      expirationTimestamp: ethers.toNumber(ownerInfo.expirationTimestamp),
    };
  }
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
    ...noirPackBytes(
      utils.arrayPadEnd(
        Array.from(ethers.toUtf8Bytes(jwtDecoded.payload.sub)),
        JWT_SUB_MAX_LEN,
        0,
      ),
    ),
    ...noirPackBytes(
      utils.arrayPadEnd(
        Array.from(ethers.toUtf8Bytes(jwtDecoded.payload.aud)),
        JWT_AUD_MAX_LEN,
        0,
      ),
    ),
    salt,
  ]).toString();
  const jwt_iat = jwtDecoded.payload.iat;
  const jwt_nonce = encodedAddressAsJwtNonce(jwtDecoded.payload.nonce);
  const public_key_hash: string = await getPublicKeyHash(publicKey.limbs);
  const input = {
    header_and_payload,
    payload_json,
    signature_limbs,
    account_id,
    salt,
    jwt_iat,
    jwt_nonce,
    public_key_limbs: publicKey.limbs.public_key_limbs,
    public_key_redc_limbs: publicKey.limbs.public_key_redc_limbs,
    public_key_hash,
  };
  if (showDebug) {
    console.log(input);
    console.log("public key", publicKey);
    console.log("jwt", jwtDecoded, jwt);
  }
  return input;
}

const getNoir = utils.lazyValue(async () => {
  const { Noir } = await import("@noir-lang/noir_js");
  const { BarretenbergBackend } = await import(
    "@noir-lang/backend_barretenberg"
  );
  const noir = new Noir(circuit as any);
  const threads =
    typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 1;
  console.log(`Using ${threads} threads`);
  const backend = new BarretenbergBackend(circuit as any, { threads });
  return { noir, backend };
});
export async function proveJwt(input: Awaited<ReturnType<typeof prepareJwt>>) {
  const { noir, backend } = await getNoir();
  console.time("generate witness");
  const { witness } = await noir.execute(input);
  console.timeEnd("generate witness");
  console.time("generate proof");
  const { proof } = await backend.generateProof(witness);
  console.timeEnd("generate proof");

  return ethers.hexlify(proof);
}

export async function getPublicKeyHash(publicKey: {
  public_key_limbs: string[];
  public_key_redc_limbs: string[];
}) {
  const { pedersenHash } = await import("@aztec/foundation/crypto");
  return pedersenHash(
    [...publicKey.public_key_limbs, ...publicKey.public_key_redc_limbs].map(
      (x) => BigInt(x),
    ),
  ).toString();
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

export async function getGooglePublicKeys() {
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

function noirPackBytes(arr: number[]) {
  // keep in sync with Noir
  const arrPadded = utils.arrayPadEnd(
    arr,
    (Math.floor(arr.length / 31) + 1) * 31,
    0,
  );
  const res = [];
  for (let i = 0; i < arrPadded.length / 31; i++) {
    const chunk = arrPadded.slice(i * 31, i * 31 + 31);
    res.push(fieldFromBytes(chunk));
  }
  return res;

  function fieldFromBytes(bytes: number[]) {
    assert(
      bytes.length < 32,
      `fieldFromBytes: N must be less than 32. Got: ${bytes.length}`,
    );
    let asField = 0n;
    let offset = 1n;
    for (let i = 0; i < bytes.length; i++) {
      asField += BigInt(bytes[i]!) * offset;
      offset *= 256n;
    }
    return asField;
  }
}

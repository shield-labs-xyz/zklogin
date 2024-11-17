import { chain, provider, relayer } from "$lib/chain";
import { decodeJwt } from "$lib/utils";
import * as web2Auth from "@auth/sveltekit/client";
import deployments from "@repo/contracts/deployments.json";
import { EoaAccount__factory } from "@repo/contracts/typechain-types";
import { Ui } from "@repo/ui";
import { utils } from "@repo/utils";
import { ethers } from "ethers";
import { isEqual } from "lodash-es";
import ms from "ms";
import {
  createWalletClient,
  http,
  slice,
  type Account,
  type Client,
  type Hex,
} from "viem";
import { signAuthorization } from "viem/experimental";
import { parsePublicKey, sign } from "webauthn-p256";
import {
  authProviderId,
  encodedAddressAsJwtNonce,
  getAccountIdFromJwt,
  JWT_EXPIRATION_TIME,
  prepareJwt,
  proveJwt,
} from "./JwtAccountService";
import type { PublicKeysRegistryService } from "./PublicKeysRegistryService";

export class Eip7702Service {
  constructor(
    private publicKeysRegistry: PublicKeysRegistryService,
    private client: Client,
  ) {}

  async requestJwt({ webAuthnPublicKey }: { webAuthnPublicKey: Hex }) {
    const nonce = this.#toNonce(webAuthnPublicKey).slice("0x".length);
    const callbackUrl = new URL(location.href);
    await web2Auth.signIn(
      "google",
      { callbackUrl: callbackUrl.href },
      { nonce },
    );
  }

  async authorize({
    account,
    jwt,
    webAuthnPublicKey,
  }: {
    account: Account;
    jwt: string;
    webAuthnPublicKey: Hex;
  }) {
    if (!(await this.#requestJwtIfInvalid({ jwt, webAuthnPublicKey }))) {
      throw new Error("jwt invalid");
    }

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

    const { accountId } = await getAccountIdFromJwt(decodeJwt(jwt));
    const publicKeyRegistry = deployments[chain.id].contracts
      .PublicKeyRegistry as `0x${string}`;
    const proofVerifier = deployments[chain.id].contracts
      .UltraVerifier as `0x${string}`;
    const hash = await accountClient.writeContract({
      abi: EoaAccount__factory.abi,
      address: account.address,
      functionName: "setAccountId",
      args: [
        parsePublicKey(webAuthnPublicKey),
        accountId,
        authProviderId,
        publicKeyRegistry,
        proofVerifier,
      ],
      authorizationList: [auth],
      account: account,
      chain: this.client.chain,
    });

    return hash;
  }

  async recover({
    address,
    jwt,
    webAuthnPublicKey,
  }: {
    address: string;
    jwt: string;
    webAuthnPublicKey: Hex;
  }) {
    if (!(await this.#requestJwtIfInvalid({ jwt, webAuthnPublicKey }))) {
      throw new Error("jwt invalid");
    }

    const accContract = this.#toAccountContract(address);
    const input = await prepareJwt(jwt);

    await this.publicKeysRegistry.storePublicKeyIfNotStored(input);

    const proof = await proveJwt(input);
    const tx = await accContract.connect(relayer).recover(
      {
        proof: ethers.hexlify(proof),
        jwtIat: input.jwt_iat,
        jwtNonce: this.#toNonce(webAuthnPublicKey),
        publicKeyHash: input.public_key_hash,
      },
      parsePublicKey(webAuthnPublicKey),
    );
    return tx.hash;
  }

  async executeTx({
    credentialId,
    address,
  }: {
    credentialId: string;
    address: string;
  }) {
    const accContract = this.#toAccountContract(address);
    const nonce = await accContract.nonce();
    const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const value = ethers.parseEther("0.00000123");
    const data = "0x";
    const digest = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256", "address", "bytes", "uint256"],
      [nonce, to, data, value],
    );
    const digestHash = ethers.keccak256(digest) as `0x${string}`;

    const signature = await sign({ hash: digestHash, credentialId });
    const r = slice(signature.signature, 0, 32);
    const s = slice(signature.signature, 32, 64);

    console.log(
      "balance before",
      ethers.formatEther(await provider.provider.getBalance(accContract)),
    );

    const tx = await accContract
      .connect(relayer)
      .execute(to, data, value, { r, s }, signature.webauthn);
    console.log("tx", tx.hash);
    await tx.wait();
    console.log(
      "balance after",
      ethers.formatEther(await provider.provider.getBalance(accContract)),
    );
    return tx.hash;
  }

  async #requestJwtIfInvalid({
    jwt,
    webAuthnPublicKey,
  }: {
    jwt: string;
    webAuthnPublicKey: Hex;
  }): Promise<boolean> {
    const input = await prepareJwt(jwt);
    const jwtNonceMatches = isEqual(
      encodedAddressAsJwtNonce(this.#toNonce(webAuthnPublicKey).toLowerCase()),
      input.jwt_nonce,
    );
    const expirationMargin = Math.min(ms("20 min"), JWT_EXPIRATION_TIME / 2);
    const jwtExpired =
      input.jwt_iat + JWT_EXPIRATION_TIME <
      Math.floor((Date.now() - expirationMargin) / 1000);
    if (jwtNonceMatches && !jwtExpired) {
      return true;
    }
    Ui.toast.log(
      "Sign in again please to link your wallet to your Google account",
    );
    await utils.sleep("2 sec");
    await this.requestJwt({
      webAuthnPublicKey,
    });
    return false;
  }

  #toNonce(webAuthnPublicKey: Hex) {
    const parsed = parsePublicKey(webAuthnPublicKey);
    const hex = ethers.dataSlice(
      ethers.keccak256(
        ethers.AbiCoder.defaultAbiCoder().encode(
          ["uint256", "uint256"],
          [parsed.x, parsed.y],
        ),
      ),
      0,
      20,
    );
    return hex;
  }

  #toAccountContract(address: string) {
    return EoaAccount__factory.connect(address, provider.provider);
  }
}

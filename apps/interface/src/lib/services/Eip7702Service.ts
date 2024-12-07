import { chain, provider, relayer } from "$lib/chain";
import * as web2Auth from "@auth/sveltekit/client";
import deployments from "@repo/contracts/deployments.json";
import { EoaAccount__factory } from "@repo/contracts/typechain-types";
import { Ui } from "@repo/ui";
import { utils } from "@repo/utils";
import { zklogin } from "@shield-labs/zklogin";
import { ethers } from "ethers";
import { assert } from "ts-essentials";
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

export class Eip7702Service {
  constructor(
    private jwtProver: zklogin.JwtProverService,
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

    const { accountId } = await zklogin.getAccountIdFromJwt(
      zklogin.decodeJwt(jwt),
    );
    const publicKey =
      await this.jwtProver.publicKeyRegistry.getPublicKeyByJwt(jwt);
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
        publicKey.authProviderId,
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

    await this.jwtProver.publicKeyRegistry.requestPublicKeysUpdate();

    const result = await this.jwtProver.proveJwt(
      jwt,
      this.#toNonce(webAuthnPublicKey).slice("0x".length),
    );
    assert(result, "jwt invalid");
    const { input, proof } = result;

    const accContract = this.#toAccountContract(address);
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
    to,
    value,
  }: {
    to: string;
    value: bigint;
    credentialId: string;
    address: string;
  }) {
    const accContract = this.#toAccountContract(address);
    const nonce = await accContract.nonce();
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
    const isValid: boolean = await this.jwtProver.checkJwt(
      jwt,
      this.#toNonce(webAuthnPublicKey).slice("0x".length),
    );
    if (isValid) {
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

  async isWebAuthnPublicKeyCorrect({
    address,

    webAuthnPublicKey,
  }: {
    address: string;
    webAuthnPublicKey: Hex;
  }) {
    const accContract = this.#toAccountContract(address);
    const publicKeyOnChain = await accContract.webauthnPublicKey();
    return (
      ethers.concat([
        ethers.zeroPadValue(ethers.toBeArray(publicKeyOnChain.x), 32),
        ethers.zeroPadValue(ethers.toBeArray(publicKeyOnChain.y), 32),
      ]) === webAuthnPublicKey
    );
  }

  #toNonce(webAuthnPublicKey: Hex) {
    const parsed = parsePublicKey(webAuthnPublicKey);
    const hex = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["uint256", "uint256"],
        [parsed.x, parsed.y],
      ),
    );
    return hex;
  }

  #toAccountContract(address: string) {
    return EoaAccount__factory.connect(address, provider.provider);
  }
}

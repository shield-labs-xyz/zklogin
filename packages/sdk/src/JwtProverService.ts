import { bnToLimbStrArray } from "@mach-34/noir-bignum-paramgen";
import circuit from "@repo/contracts/noir/target/jwt_account.json";
import { utils } from "@repo/utils";
import { isEqual } from "lodash-es";
import { Base64, Bytes, Hex } from "ox";
import type { PublicKeyRegistryService } from "./PublicKeysRegistryService.js";
import { decodeJwt, noirPackBytes, splitJwt, toBoundedVec } from "./utils.js";

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
// Note: keep in sync with Solidity
const JWT_EXPIRATION_TIME = 60 * 60; // seconds

export class JwtProverService {
  constructor(readonly publicKeyRegistry: PublicKeyRegistryService) {}

  async proveJwt(jwt: string, expectedNonce: string) {
    const input = await this.prepareJwt(jwt);

    const isValid: boolean = await this.#checkJwt(input, expectedNonce);
    if (!isValid) {
      return undefined;
    }

    const { noir, backend } = await getNoir();
    console.time("generate witness");
    const { witness } = await noir.execute(input);
    console.timeEnd("generate witness");
    console.time("generate proof");
    const { proof } = await backend.generateProof(witness);
    console.timeEnd("generate proof");

    return {
      proof: Bytes.toHex(proof),
      input,
    };
  }

  private async prepareJwt(jwt: string) {
    const [headerBase64Url, payloadBase64Url, signatureBase64Url] =
      splitJwt(jwt);

    const header_and_payload = toBoundedVec(
      Array.from(Bytes.fromString(`${headerBase64Url}.${payloadBase64Url}`)),
      JWT_HEADER_MAX_LEN + 1 + JWT_PAYLOAD_MAX_LEN,
    );
    const payload_json = utils.arrayPadEnd(
      Array.from(Base64.toBytes(payloadBase64Url)),
      JWT_PAYLOAD_JSON_MAX_LEN,
      " ".charCodeAt(0),
    );
    const showDebug = false;
    if (showDebug) {
      console.log(
        `
      global header_base64url: [u8; ${headerBase64Url.length}] = ${JSON.stringify(headerBase64Url)}.as_bytes();
      global payload_base64url: [u8; ${payloadBase64Url.length}] = ${JSON.stringify(payloadBase64Url)}.as_bytes();
      global payload_json_padded = ${JSON.stringify(Bytes.toString(Uint8Array.from(payload_json)))}.as_bytes();`,
      );
    }
    const signature_limbs = bnToLimbStrArray(
      Bytes.toBigInt(Base64.toBytes(signatureBase64Url)),
    );
    const jwtDecoded = decodeJwt(jwt);
    const publicKey = await this.publicKeyRegistry.getPublicKeyByKid(
      jwtDecoded.header.kid,
    );
    const { accountId: account_id, salt } =
      await getAccountIdFromJwt(jwtDecoded);
    const jwt_iat = jwtDecoded.payload.iat;
    const jwt_nonce = toNoirNonce(jwtDecoded.payload.nonce);
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
      public_key_hash: publicKey.hash,
    };
    if (showDebug) {
      console.log(input);
      console.log("public key", publicKey);
      console.log("jwt", jwtDecoded, jwt);
    }
    return input;
  }

  async #checkJwt(
    input: Awaited<ReturnType<typeof this.prepareJwt>>,
    expectedNonce: string,
  ): Promise<boolean> {
    const jwtNonceMatches = isEqual(
      toNoirNonce(expectedNonce),
      input.jwt_nonce,
    );
    const expirationMargin = Math.min(
      20 * 60 /*seconds*/,
      JWT_EXPIRATION_TIME / 2,
    );
    const jwtExpired =
      input.jwt_iat + JWT_EXPIRATION_TIME <
      Math.floor((Date.now() - expirationMargin) / 1000);
    return jwtNonceMatches && !jwtExpired;
  }
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

export async function getAccountIdFromJwt(
  jwtDecoded: ReturnType<typeof decodeJwt>,
) {
  const { pedersenHash } = await import("@aztec/foundation/crypto");
  const salt = 0;
  const accountId = pedersenHash([
    ...noirPackBytes(
      utils.arrayPadEnd(
        Array.from(Bytes.fromString(jwtDecoded.payload.sub)),
        JWT_SUB_MAX_LEN,
        0,
      ),
    ),
    ...noirPackBytes(
      utils.arrayPadEnd(
        Array.from(Bytes.fromString(jwtDecoded.payload.aud)),
        JWT_AUD_MAX_LEN,
        0,
      ),
    ),
    salt,
  ]).toString();
  return { accountId, salt };
}

function toNoirNonce(nonce: string) {
  return Array.from(Bytes.fromString(nonce));
}

import {
  bnToLimbStrArray,
  bnToRedcLimbStrArray,
} from "@mach-34/noir-bignum-paramgen";
import { utils } from "@shield-labs/utils";
import ky from "ky";
import { Base64, Bytes, Hash, Hex } from "ox";
import { z } from "zod";
import { decodeJwt, HOSTED_SERVICE_URL } from "./utils.js";

export class PublicKeyRegistryService {
  constructor(private apiUrl = HOSTED_SERVICE_URL) {}

  // TODO: more specific chainId type
  async requestPublicKeysUpdate(chainId: number) {
    const { hash } = await ky
      .post(utils.joinUrl(this.apiUrl, "/api/register-public-keys"), {
        json: {
          chainId,
        },
      })
      .json<{ hash: Hex.Hex | null }>();

    if (!hash) {
      return;
    }

    return hash;

    // TODO: wait for transaction
    // await provider.waitForTransaction(hash);
  }

  async getPublicKeyByJwt(jwt: string) {
    const decoded = decodeJwt(jwt);
    const publicKeys = await this.getPublicKeys();
    const key = publicKeys.find((key) => key.kid === decoded.header.kid);
    if (!key) {
      throw new Error("Public key not found for jwt");
    }
    return key;
  }

  async getPublicKeyByKid(kid: string) {
    const keys = await this.getPublicKeys();
    const key = keys.find((key) => key.kid === kid);
    if (!key) {
      throw new Error(`Public key not found for kid ${kid}`);
    }
    return key;
  }

  async getPublicKeys() {
    const urls = ["https://www.googleapis.com/oauth2/v3/certs"];
    const keys = await Promise.all(
      urls.map(async (url) => this.#getPublicKeysByUrl(url)),
    );
    return keys.flat();
  }

  async #getPublicKeysByUrl(url: string) {
    const authProviderId = Bytes.toHex(Hash.keccak256(Bytes.fromString(url)));
    const res = z
      .object({
        keys: z.array(
          z.object({
            kid: z.string(),
            n: z.string(),
          }),
        ),
      })
      .parse(await ky.get(url).json());
    const keys = res.keys.map(async (key) => {
      const publicKey = Bytes.toBigInt(Base64.toBytes(key.n));
      const limbs = {
        public_key_limbs: bnToLimbStrArray(publicKey),
        public_key_redc_limbs: bnToRedcLimbStrArray(publicKey),
      };
      return {
        authProviderId,
        kid: key.kid,
        limbs,
        hash: await getPublicKeyHash(limbs),
      };
    });
    return await Promise.all(keys);
  }
}

async function getPublicKeyHash(publicKey: {
  public_key_limbs: string[];
  public_key_redc_limbs: string[];
}) {
  // TODO(perf): change pedersen to poseidon2
  const { pedersenHash } = await import("@aztec/foundation/crypto");
  return pedersenHash(
    [...publicKey.public_key_limbs, ...publicKey.public_key_redc_limbs].map(
      (x) => BigInt(x),
    ),
  ).toString();
}

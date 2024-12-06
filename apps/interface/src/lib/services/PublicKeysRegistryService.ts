import {
  bnToLimbStrArray,
  bnToRedcLimbStrArray,
} from "@mach-34/noir-bignum-paramgen";
import { Ui } from "@repo/ui";
import { utils } from "@repo/utils";
import { ethers } from "ethers";
import ky from "ky";
import { z } from "zod";
import { provider } from "../chain";
import { base64UrlToBigInt, decodeJwt } from "../utils";

export class PublicKeyRegistryService {
  async requestPublicKeysUpdate() {
    const { hash } = await ky
      .post("/api/register-public-keys")
      .json<{ hash: string | null }>();

    if (!hash) {
      return;
    }

    await Ui.toast.promise(provider.provider.waitForTransaction(hash), {
      loading: "Updating google public keys...",
      success: "Google public keys updated",
      error: (e) =>
        `Error updating google public keys: ${utils.errorToString(e)}`,
    });
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
    const authProviderId = ethers.id(url) as `0x${string}`;
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
      const publicKey = base64UrlToBigInt(key.n);
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

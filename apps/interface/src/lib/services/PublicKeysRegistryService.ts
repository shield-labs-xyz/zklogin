import { provider, publicKeyRegistry } from "$lib/chain";
import { Ui } from "@repo/ui";
import { utils } from "@repo/utils";
import ky from "ky";
import { authProviderId, getPublicKeyHash } from "./JwtAccountService";

export class PublicKeysRegistryService {
  async storePublicKeyIfNotStored(publicKey: {
    public_key_limbs: string[];
    public_key_redc_limbs: string[];
  }) {
    const publicKeyHash = await getPublicKeyHash(publicKey);
    const valid = await publicKeyRegistry.isPublicKeyHashValid(
      authProviderId,
      publicKeyHash,
    );
    if (valid) {
      return;
    }
    await Ui.toast.promise(
      utils.iife(async () => {
        const { hash } = await ky
          .post("/api/register-public-keys")
          .json<{ hash: string | null }>();
        if (hash) {
          await provider.provider.waitForTransaction(hash);
        }
      }),
      {
        loading: "Updating google public keys...",
        success: "Google public keys updated",
        error: (e) =>
          `Error updating google public keys: ${utils.errorToString(e)}`,
      },
    );
  }
}

import { provider, publicKeyRegistry } from "$lib/chain";
import {
  authProviderId,
  getGooglePublicKeys,
  getPublicKeyHash,
} from "$lib/services/JwtAccountService";
import { utils } from "@repo/utils";
import { error } from "@sveltejs/kit";
import { config } from "dotenv";
import { ethers } from "ethers";
import { compact } from "lodash-es";

export async function POST() {
  config();
  const privateKey = process.env.REGISTRY_OWNER_PRIVATE_KEY!;
  if (!privateKey) {
    error(500, "misconfigured: signer");
  }
  const owner = new ethers.Wallet(privateKey, provider.provider);
  if (!utils.isAddressEqual(await publicKeyRegistry.owner(), owner.address)) {
    error(500, "misconfigured: owner");
  }

  const publicKeys = await getGooglePublicKeys();
  const pendingPublicKeyHashes = compact(
    await Promise.all(
      publicKeys.map(async (publicKey) => {
        const publicKeyHash = await getPublicKeyHash(publicKey.limbs);
        const isValid = await publicKeyRegistry.isPublicKeyHashValid(
          authProviderId,
          publicKeyHash,
        );
        if (isValid) {
          return undefined;
        }
        return publicKeyHash;
      }),
    ),
  );
  if (pendingPublicKeyHashes.length === 0) {
    return Response.json({ hash: null });
  }
  console.log(`updating ${pendingPublicKeyHashes.length} public keys`);
  try {
    const tx = await publicKeyRegistry.connect(owner).setPublicKeysValid(
      pendingPublicKeyHashes.map((publicKeyHash) => ({
        providerId: authProviderId,
        publicKeyHash,
        valid: true,
      })),
    );
    return Response.json({ hash: tx.hash });
  } catch (e: any) {
    console.error(e);
    return Response.json(
      { error: "Failed to send transaction" },
      { status: 500 },
    );
  }
}

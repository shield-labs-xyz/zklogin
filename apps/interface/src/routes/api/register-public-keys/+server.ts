import { lib } from "$lib";
import { chain, provider } from "$lib/chain";
import { utils } from "@shield-labs/utils";
import deployments from "@shield-labs/zklogin-contracts/deployments.json";
import { PublicKeyRegistry__factory } from "@shield-labs/zklogin-contracts/typechain-types";
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

  const publicKeyRegistry = PublicKeyRegistry__factory.connect(
    deployments[chain.id].contracts.PublicKeyRegistry,
    provider,
  );

  const owner = new ethers.Wallet(privateKey, provider);
  if (!utils.isAddressEqual(await publicKeyRegistry.owner(), owner.address)) {
    error(500, "misconfigured: owner");
  }

  const publicKeys = await lib.jwtProver.publicKeyRegistry.getPublicKeys();
  const pendingPublicKeys = compact(
    await Promise.all(
      publicKeys.map(async (publicKey) => {
        const isValid = await publicKeyRegistry.isPublicKeyHashValid(
          publicKey.authProviderId,
          publicKey.hash,
        );
        if (isValid) {
          return undefined;
        }
        return publicKey;
      }),
    ),
  );
  if (pendingPublicKeys.length === 0) {
    return Response.json({ hash: null });
  }
  console.log(`updating ${pendingPublicKeys.length} public keys`);
  try {
    const tx = await publicKeyRegistry.connect(owner).setPublicKeysValid(
      pendingPublicKeys.map((publicKey) => ({
        providerId: publicKey.authProviderId,
        publicKeyHash: publicKey.hash,
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

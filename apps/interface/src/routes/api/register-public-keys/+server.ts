import { lib } from "$lib";
import { ChainIdSchema } from "$lib/chain";
import deployments from "@shield-labs/zklogin-contracts/deployments.json";
import { PublicKeyRegistry__factory } from "@shield-labs/zklogin-contracts/typechain-types";
import { error } from "@sveltejs/kit";
import { config } from "dotenv";
import { compact } from "lodash-es";
import {
  createWalletClient,
  getContract,
  http,
  isAddressEqual,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { z } from "zod";

export async function POST({ request }) {
  config();

  const body = z
    .object({
      chainId: ChainIdSchema,
    })
    .parse(await request.json());

  const privateKey = process.env.REGISTRY_OWNER_PRIVATE_KEY! as Hex;
  if (!privateKey) {
    error(500, "misconfigured: signer");
  }

  const chain = lib.chain.chainById(body.chainId);
  const owner = privateKeyToAccount(privateKey);
  const client = createWalletClient({
    chain,
    transport: http(),
    account: owner,
  });

  const publicKeyRegistry = getContract({
    address: deployments[chain.id].contracts.PublicKeyRegistry as Address,
    abi: PublicKeyRegistry__factory.abi,
    client,
  });

  if (!isAddressEqual(await publicKeyRegistry.read.owner(), owner.address)) {
    error(500, "misconfigured: owner");
  }

  const publicKeys = await lib.zkLogin.publicKeyRegistry.getPublicKeys();
  const pendingPublicKeys = compact(
    await Promise.all(
      publicKeys.map(async (publicKey) => {
        const isValid = await publicKeyRegistry.read.isPublicKeyHashValid([
          publicKey.authProviderId,
          publicKey.hash,
        ]);
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
    const hash = await publicKeyRegistry.write.setPublicKeysValid([
      pendingPublicKeys.map((publicKey) => ({
        providerId: publicKey.authProviderId,
        publicKeyHash: publicKey.hash,
        valid: true,
      })),
    ]);
    return Response.json({ hash });
  } catch (e: any) {
    console.error(e);
    return Response.json(
      { error: "Failed to send transaction" },
      { status: 500 },
    );
  }
}

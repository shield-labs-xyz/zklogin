import { ethers } from "ethers";
import { assert } from "ts-essentials";
import { baseSepolia, odysseyTestnet } from "viem/chains";
import type { z } from "zod";
import { zUnionFromArray } from "./utils";

/** @deprecated use {@link ChainService} */
export const chain = odysseyTestnet;

const RPC_URL = "https://odyssey.ithaca.xyz";
/** @deprecated migrate to viem */
export const provider = new ethers.JsonRpcProvider(RPC_URL);
/** @deprecated migrate to viem */
export const relayer = new ethers.Wallet(
  "0x4e560d1db4456119f9256bb65b4321ad54b860882c46b5ecb6ba92ca4d725dad",
  provider,
);

const chains = [baseSepolia, odysseyTestnet] as const;

export class ChainService {
  chainById(id: ChainId) {
    const chain = chains.find((x) => x.id === id);
    assert(chain, `chain not found for id ${id}`);
    return chain;
  }
}

export type ChainId = z.infer<typeof ChainIdSchema>;
export const ChainIdSchema = zUnionFromArray(chains.map((x) => x.id));

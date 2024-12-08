import { ethers } from "ethers";
import { assert } from "ts-essentials";
import { baseSepolia, odysseyTestnet } from "viem/chains";
import type { z } from "zod";
import { zUnionFromArray } from "./utils";

/** @deprecated use {@link ChainService} */
export const chain = baseSepolia;

const RPC_URL = "https://sepolia.base.org";
/** @deprecated migrate to viem */
export const provider = new ethers.JsonRpcProvider(RPC_URL);

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

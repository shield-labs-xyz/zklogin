import { ethers } from "ethers";
import { baseSepolia } from "viem/chains";

export const chain = baseSepolia;

const RPC_URL = "https://sepolia.base.org";
/** @deprecated migrate to viem */
export const provider = new ethers.JsonRpcProvider(RPC_URL);

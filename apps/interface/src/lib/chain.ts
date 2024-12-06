import { ethers } from "ethers";
import { baseSepolia } from "viem/chains";

export const chain = baseSepolia;
const RPC_URL = "https://sepolia.base.org";

export const provider = {
  chainId: chain.id,
  provider: new ethers.JsonRpcProvider(RPC_URL),
};

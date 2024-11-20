import deployments from "@repo/contracts/deployments.json";
import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types";
import { ethers } from "ethers";
import { baseSepolia } from "viem/chains";

export const chain = baseSepolia;
const RPC_URL = "https://sepolia.base.org";

export const provider = {
  chainId: chain.id,
  provider: new ethers.JsonRpcProvider(RPC_URL),
};

export const publicKeyRegistry = PublicKeyRegistry__factory.connect(
  deployments[provider.chainId].contracts.PublicKeyRegistry,
  provider.provider,
);

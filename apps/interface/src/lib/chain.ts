import deployments from "@repo/contracts/deployments.json";
import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types";
import { ethers } from "ethers";
import { baseSepolia } from "viem/chains";

export const chain = baseSepolia;

export const provider = {
  chainId: chain.id,
  provider: new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]),
};

export const publicKeyRegistry = PublicKeyRegistry__factory.connect(
  deployments[provider.chainId].contracts.PublicKeyRegistry,
  provider.provider,
);

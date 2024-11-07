import deployments from "@repo/contracts/deployments.json";
import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types";
import { ethers } from "ethers";
import { baseSepolia } from "viem/chains";

export const chain = baseSepolia;
const RPC_URL =
  "https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=AhzA6k_e8kYDnLbUfrHiY5FOMOv-nO0R76TfFhW5UfFk";

export const provider = {
  chainId: chain.id,
  provider: new ethers.JsonRpcProvider(RPC_URL),
};

export const publicKeyRegistry = PublicKeyRegistry__factory.connect(
  deployments[provider.chainId].contracts.PublicKeyRegistry,
  provider.provider,
);

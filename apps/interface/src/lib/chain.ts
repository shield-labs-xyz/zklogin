import deployments from "@repo/contracts/deployments.json";
import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types";
import { ethers } from "ethers";
import { anvil } from "viem/chains";

export const chain = anvil;
const RPC_URL = "http://localhost:8545";
// "https://lb.drpc.org/ogrpc?network=base-sepolia&dkey=AhzA6k_e8kYDnLbUfrHiY5FOMOv-nO0R76TfFhW5UfFk";

export const provider = {
  chainId: chain.id,
  provider: new ethers.JsonRpcProvider(RPC_URL),
};

export const publicKeyRegistry = PublicKeyRegistry__factory.connect(
  deployments[provider.chainId].contracts.PublicKeyRegistry,
  provider.provider,
);

export const relayer = new ethers.Wallet(
  "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
  provider.provider,
);

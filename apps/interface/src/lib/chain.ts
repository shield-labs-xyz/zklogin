import { ethers } from "ethers";
import { odysseyTestnet } from "viem/chains";

export const chain = odysseyTestnet;
// const RPC_URL = "http://localhost:8545";
const RPC_URL = "https://odyssey.ithaca.xyz";

export const provider = {
  chainId: chain.id,
  provider: new ethers.JsonRpcProvider(RPC_URL),
};

export const relayer = new ethers.Wallet(
  "0x4e560d1db4456119f9256bb65b4321ad54b860882c46b5ecb6ba92ca4d725dad",
  provider.provider,
);

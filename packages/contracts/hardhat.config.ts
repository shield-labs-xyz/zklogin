import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-viem";
import "hardhat-deploy";
import "hardhat-plugin-noir";
import { HardhatUserConfig } from "hardhat/config";
import envConfig from "./envConfig";
import "./shared/typed-hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100000000,
      },
    },
  },
  noir: {
    version: "1.0.0-beta.0",
    bbVersion: "0.65.2",
  },
  defaultNetwork: "localhost",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
    },
    odysseyTestnet: {
      url: "https://odyssey.ithaca.xyz",
      chainId: 911867,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: "XFIQMP77Q7JFTSAUI33EEQMUG9E1UBSB4X",
    },
  },
  namedAccounts: {
    deployer: `privatekey://${envConfig.DEPLOYER_PRIVATE_KEY}`,
  },
};

export default config;

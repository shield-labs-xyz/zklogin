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
    version: "0.34.0",
  },
  defaultNetwork: "localhost",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
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

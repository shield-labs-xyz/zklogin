import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";
import envConfig from "./envConfig";
import "./shared/typed-hardhat-deploy";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999999,
      },
    },
  },
  networks: {
    basesepolia: {
      url: "https://sepolia.base.org",
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {},
  },
  namedAccounts: {
    deployer: `privatekey://${envConfig.DEPLOYER_PRIVATE_KEY}`,
  },
};

export default config;

import { DeployFunction } from "hardhat-deploy/types";

// declare module "hardhat/types/runtime" {
//   interface TypedHardhatDeployNames {
//     USDC: "ERC20";
//   }
// }

const deploy: DeployFunction = async ({
  typedDeployments,
  safeGetNamedAccounts,
}) => {
  const { deployer } = await safeGetNamedAccounts({ deployer: true });

  // await typedDeployments.deploy("USDC", {
  //   from: deployer,
  //   log: true,
  //   args: ["USD Coin", "USDC"],
  //   contract: "ERC20",
  // });
};

export default deploy;

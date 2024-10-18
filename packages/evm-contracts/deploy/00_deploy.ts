import { DeployFunction } from "hardhat-deploy/types";

declare module "hardhat/types/runtime" {
  interface TypedHardhatDeployNames {
    SimpleAccountFactory: "SimpleAccountFactory";
    UltraVerifier: "UltraVerifier";
  }
}

const deploy: DeployFunction = async ({
  typedDeployments,
  safeGetNamedAccounts,
}) => {
  const { deployer } = await safeGetNamedAccounts({ deployer: true });

  const ultraVerifier = await typedDeployments.deploy("UltraVerifier", {
    from: deployer,
    log: true,
  });

  const entryPoint = "0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789";
  await typedDeployments.deploy("SimpleAccountFactory", {
    from: deployer,
    log: true,
    args: [entryPoint, ultraVerifier.address],
  });
};

deploy.tags = ["all"];

export default deploy;

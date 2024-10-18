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

  const entryPoint = "0x0000000071727De22E5E9d8BAf0edAc6f37da032";
  await typedDeployments.deploy("SimpleAccountFactory", {
    from: deployer,
    log: true,
    args: [entryPoint, ultraVerifier.address],
  });
};

deploy.tags = ["all"];

export default deploy;

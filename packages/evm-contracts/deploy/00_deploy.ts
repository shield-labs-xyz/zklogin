import { DeployFunction } from "hardhat-deploy/types";

declare module "hardhat/types/runtime" {
  interface TypedHardhatDeployNames {
    PublicKeyRegistry: "PublicKeyRegistry";
    SimpleAccountFactory: "SimpleAccountFactory";
    UltraVerifier: "UltraVerifier";
    EoaAccount: "EoaAccount";
  }
}

const deploy: DeployFunction = async ({
  typedDeployments,
  safeGetNamedAccounts,
}) => {
  const { deployer } = await safeGetNamedAccounts({ deployer: true });

  const publicKeyRegistry = await typedDeployments.deploy("PublicKeyRegistry", {
    from: deployer,
    log: true,
  });

  const proofVerifier = await typedDeployments.deploy("UltraVerifier", {
    from: deployer,
    log: true,
  });

  await typedDeployments.deploy("EoaAccount", {
    from: deployer,
    log: true,
  });
};

deploy.tags = ["all"];

export default deploy;

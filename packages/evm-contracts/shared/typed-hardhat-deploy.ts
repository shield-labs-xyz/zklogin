import { ethers } from "ethers";
import type {
  CallOptions,
  Deployment,
  DeploymentsExtension,
  DeployOptions,
  DeployResult,
  Receipt,
  TxOptions,
} from "hardhat-deploy/types";
import { extendEnvironment, task, types } from "hardhat/config";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { assert, type MergeN, type OmitProperties } from "ts-essentials";

task("deploy-and-export")
  .addParam(
    "tags",
    "tags passed to `hardhat deploy`",
    undefined,
    types.string,
    true,
  )
  .addParam(
    "gasprice",
    "Price in wei per unit of gas",
    undefined,
    types.string,
    false,
  )
  .setAction(async (args, hre) => {
    const unit = "gwei";
    assert(args.gasprice.endsWith(unit), `gasprice must end with ${unit}`);
    const gasprice = ethers
      .parseUnits(args.gasprice.slice(0, -unit.length), unit)
      .toString();
    await hre.run("deploy", {
      tags: args.tags,
      gasprice: gasprice,
    });
    await hre.run("export-all");
  });

task("export-all")
  .setDescription("Exports all deployments' addresses and ABIs")
  .setAction(async (_args, hre) => {
    const fs = await import("fs");
    const _ = await import("lodash");
    const { default: jsonStringifyDeterministic } = await import(
      "json-stringify-deterministic"
    );

    // Use the `export` task from `hardhat-deploy` to export all deployments.
    // Then flatten the result to transform `chainID => networkName => info`
    // into `chainID => info` structure.
    const filename = "deployments.json";
    const tmpFilename = filename + ".tmp";
    await hre.run("export", { exportAll: tmpFilename });
    const exports = JSON.parse(fs.readFileSync(tmpFilename).toString("utf-8"));
    const flattenExports = Object.fromEntries(
      Object.entries<any>(exports).map(([chainId, e]) => {
        const flatten: any = Object.values(e)[0];
        flatten.contracts = _.mapValues(
          flatten.contracts,
          ({ address }) => address,
        );
        return [chainId, flatten];
      }),
    );
    delete flattenExports["31337"]; // ignore hardhat deployments
    fs.writeFileSync(
      filename,
      jsonStringifyDeterministic(flattenExports, { space: "  " }),
    );
    fs.rmSync(tmpFilename);
  });

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    /**
     * Type-only wrapper around `hardhat-deploy` for typesafe deployments.
     */
    typedDeployments: TypedDeploymentsExtension;
    /**
     * Return `hre.getNamedAccounts` but additionally ensure that they are all valid addresses.
     */
    safeGetNamedAccounts: <N extends Record<string, true>>(
      names: N,
    ) => Promise<Record<keyof N, string>>;
  }

  interface TypedHardhatDeployNames {}
}

extendEnvironment((hre) => {
  hre.typedDeployments = hre.deployments as TypedDeploymentsExtension;
  hre.safeGetNamedAccounts = (names) => safeGetNamedAccounts(hre, names);
});

async function safeGetNamedAccounts<N extends Record<string, true>>(
  hre: HardhatRuntimeEnvironment,
  names: N,
): Promise<Record<keyof N, string>> {
  const { pick } = await import("lodash");
  const addresses = await hre.getNamedAccounts();
  const namesAsArray = Object.keys(names);
  const invalidName = namesAsArray.find(
    (name) => !hre.ethers.isAddress(addresses[name]),
  );
  if (invalidName) {
    throw new TypeError(
      `Invalid "namedAccounts" for network ${hre.network.name}: "${invalidName}" (${addresses[invalidName]})`,
    );
  }
  return pick(addresses, namesAsArray) as Record<keyof N, string>;
}

type CustomNames = OmitProperties<
  {
    [key in keyof import("hardhat/types/runtime").TypedHardhatDeployNames]: import("hardhat/types/runtime").TypedHardhatDeployNames[key] extends keyof Factories
      ? import("hardhat/types/runtime").TypedHardhatDeployNames[key]
      : never;
  },
  never
>;

interface TypedDeploymentsExtension extends DeploymentsExtension {
  deploy<N extends keyof CustomNames>(
    name: N,
    options: TypedDeployOptions<N>,
  ): Promise<DeployResult>;
  execute<
    N extends keyof CustomNames,
    M extends keyof Contracts[CustomNames[N]],
  >(
    name: N,
    options: TxOptions,
    methodName: M & string,
    ...args: SafeParameters<Contracts[CustomNames[N]][M]>
  ): Promise<Receipt>;
  read<N extends keyof CustomNames, M extends keyof Contracts[CustomNames[N]]>(
    name: N,
    options: CallOptions,
    methodName: M,
    ...args: SafeParameters<Contracts[CustomNames[N]][M]>
  ): SafeReturnType<Contracts[CustomNames[N]][M]>;
  read<N extends keyof CustomNames, M extends keyof Contracts[CustomNames[N]]>(
    name: N,
    methodName: M,
    ...args: SafeParameters<Contracts[CustomNames[N]][M]>
  ): SafeReturnType<Contracts[CustomNames[N]][M]>;
  get<N extends keyof CustomNames>(name: N): Promise<Deployment>;
}

// @ts-ignore
type _Typechain = typeof import("../typechain-types");
type _Factories0 = {
  [key in keyof _Typechain as key extends `${infer N}__factory`
    ? N
    : never]: _Typechain[key] extends abstract new (...args: any) => any
    ? InstanceType<_Typechain[key]>
    : never;
};
type Factories = Pick<
  _Factories0,
  {
    [key in keyof _Factories0]: _Factories0[key] extends ethers.ContractFactory
      ? key
      : never;
  }[keyof _Factories0]
>;
type TypedDeployOptions<N extends keyof CustomNames> = ExpandObject<
  MergeN<
    [
      DeployOptions,
      {
        log: boolean;
      },
      Parameters<Factories[CustomNames[N]]["deploy"]> extends [
        ethers.Overrides?,
      ]
        ? {
            args?: Parameters<Factories[CustomNames[N]]["deploy"]>;
          }
        : {
            args: Parameters<Factories[CustomNames[N]]["deploy"]>;
          },
      N extends CustomNames[N]
        ? {
            contract?: CustomNames[N];
          }
        : {
            contract: CustomNames[N];
          },
    ]
  >
>;

type Contracts = {
  [key in keyof Factories]: Awaited<ReturnType<Factories[key]["deploy"]>>;
};

type SafeParameters<T> = T extends (...args: any[]) => any
  ? Parameters<T>
  : never;
type SafeReturnType<T> = T extends (...args: any[]) => any
  ? ReturnType<T>
  : never;
type ExpandObject<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "BaseAccount",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseAccount__factory>;
    getContractFactory(
      name: "UserOperationLib",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UserOperationLib__factory>;
    getContractFactory(
      name: "IAccount",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAccount__factory>;
    getContractFactory(
      name: "IAggregator",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAggregator__factory>;
    getContractFactory(
      name: "IEntryPoint",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IEntryPoint__factory>;
    getContractFactory(
      name: "INonceManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.INonceManager__factory>;
    getContractFactory(
      name: "IStakeManager",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStakeManager__factory>;
    getContractFactory(
      name: "TokenCallbackHandler",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TokenCallbackHandler__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1822Proxiable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1822Proxiable__factory>;
    getContractFactory(
      name: "IERC1967",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1967__factory>;
    getContractFactory(
      name: "IBeacon",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeacon__factory>;
    getContractFactory(
      name: "ERC1967Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Proxy__factory>;
    getContractFactory(
      name: "ERC1967Utils",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC1967Utils__factory>;
    getContractFactory(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Proxy__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UUPSUpgradeable__factory>;
    getContractFactory(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Receiver__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "Address",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Address__factory>;
    getContractFactory(
      name: "Create2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Create2__factory>;
    getContractFactory(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ECDSA__factory>;
    getContractFactory(
      name: "Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Errors__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "SafeCast",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SafeCast__factory>;
    getContractFactory(
      name: "Strings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Strings__factory>;
    getContractFactory(
      name: "TestJwtAccount",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TestJwtAccount__factory>;
    getContractFactory(
      name: "IPublicKeyRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IPublicKeyRegistry__factory>;
    getContractFactory(
      name: "PublicKeyRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.PublicKeyRegistry__factory>;
    getContractFactory(
      name: "IProofVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IProofVerifier__factory>;
    getContractFactory(
      name: "SimpleAccount",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleAccount__factory>;
    getContractFactory(
      name: "SimpleAccountFactory",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SimpleAccountFactory__factory>;
    getContractFactory(
      name: "Strings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Strings__factory>;
    getContractFactory(
      name: "BaseUltraVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseUltraVerifier__factory>;
    getContractFactory(
      name: "UltraVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.UltraVerifier__factory>;

    getContractAt(
      name: "BaseAccount",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseAccount>;
    getContractAt(
      name: "UserOperationLib",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UserOperationLib>;
    getContractAt(
      name: "IAccount",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAccount>;
    getContractAt(
      name: "IAggregator",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IAggregator>;
    getContractAt(
      name: "IEntryPoint",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IEntryPoint>;
    getContractAt(
      name: "INonceManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.INonceManager>;
    getContractAt(
      name: "IStakeManager",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IStakeManager>;
    getContractAt(
      name: "TokenCallbackHandler",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TokenCallbackHandler>;
    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1822Proxiable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1822Proxiable>;
    getContractAt(
      name: "IERC1967",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1967>;
    getContractAt(
      name: "IBeacon",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeacon>;
    getContractAt(
      name: "ERC1967Proxy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Proxy>;
    getContractAt(
      name: "ERC1967Utils",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC1967Utils>;
    getContractAt(
      name: "Proxy",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Proxy>;
    getContractAt(
      name: "Initializable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "UUPSUpgradeable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UUPSUpgradeable>;
    getContractAt(
      name: "IERC1155Receiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Receiver>;
    getContractAt(
      name: "IERC721Receiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "Address",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Address>;
    getContractAt(
      name: "Create2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Create2>;
    getContractAt(
      name: "ECDSA",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ECDSA>;
    getContractAt(
      name: "Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Errors>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "SafeCast",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SafeCast>;
    getContractAt(
      name: "Strings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Strings>;
    getContractAt(
      name: "TestJwtAccount",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TestJwtAccount>;
    getContractAt(
      name: "IPublicKeyRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IPublicKeyRegistry>;
    getContractAt(
      name: "PublicKeyRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.PublicKeyRegistry>;
    getContractAt(
      name: "IProofVerifier",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IProofVerifier>;
    getContractAt(
      name: "SimpleAccount",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleAccount>;
    getContractAt(
      name: "SimpleAccountFactory",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SimpleAccountFactory>;
    getContractAt(
      name: "Strings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Strings>;
    getContractAt(
      name: "BaseUltraVerifier",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseUltraVerifier>;
    getContractAt(
      name: "UltraVerifier",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.UltraVerifier>;

    deployContract(
      name: "BaseAccount",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseAccount>;
    deployContract(
      name: "UserOperationLib",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UserOperationLib>;
    deployContract(
      name: "IAccount",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccount>;
    deployContract(
      name: "IAggregator",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAggregator>;
    deployContract(
      name: "IEntryPoint",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IEntryPoint>;
    deployContract(
      name: "INonceManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.INonceManager>;
    deployContract(
      name: "IStakeManager",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IStakeManager>;
    deployContract(
      name: "TokenCallbackHandler",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenCallbackHandler>;
    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC1822Proxiable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822Proxiable>;
    deployContract(
      name: "IERC1967",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1967>;
    deployContract(
      name: "IBeacon",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeacon>;
    deployContract(
      name: "ERC1967Proxy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Proxy>;
    deployContract(
      name: "ERC1967Utils",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Utils>;
    deployContract(
      name: "Proxy",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Proxy>;
    deployContract(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "IERC1155Receiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Receiver>;
    deployContract(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "Address",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Address>;
    deployContract(
      name: "Create2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Create2>;
    deployContract(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Errors>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "SafeCast",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeCast>;
    deployContract(
      name: "Strings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "TestJwtAccount",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestJwtAccount>;
    deployContract(
      name: "IPublicKeyRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IPublicKeyRegistry>;
    deployContract(
      name: "PublicKeyRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PublicKeyRegistry>;
    deployContract(
      name: "IProofVerifier",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProofVerifier>;
    deployContract(
      name: "SimpleAccount",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpleAccount>;
    deployContract(
      name: "SimpleAccountFactory",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpleAccountFactory>;
    deployContract(
      name: "Strings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "BaseUltraVerifier",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseUltraVerifier>;
    deployContract(
      name: "UltraVerifier",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UltraVerifier>;

    deployContract(
      name: "BaseAccount",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseAccount>;
    deployContract(
      name: "UserOperationLib",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UserOperationLib>;
    deployContract(
      name: "IAccount",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAccount>;
    deployContract(
      name: "IAggregator",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IAggregator>;
    deployContract(
      name: "IEntryPoint",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IEntryPoint>;
    deployContract(
      name: "INonceManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.INonceManager>;
    deployContract(
      name: "IStakeManager",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IStakeManager>;
    deployContract(
      name: "TokenCallbackHandler",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TokenCallbackHandler>;
    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC1822Proxiable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1822Proxiable>;
    deployContract(
      name: "IERC1967",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1967>;
    deployContract(
      name: "IBeacon",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IBeacon>;
    deployContract(
      name: "ERC1967Proxy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Proxy>;
    deployContract(
      name: "ERC1967Utils",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC1967Utils>;
    deployContract(
      name: "Proxy",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Proxy>;
    deployContract(
      name: "Initializable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Initializable>;
    deployContract(
      name: "UUPSUpgradeable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UUPSUpgradeable>;
    deployContract(
      name: "IERC1155Receiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Receiver>;
    deployContract(
      name: "IERC721Receiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Receiver>;
    deployContract(
      name: "Address",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Address>;
    deployContract(
      name: "Create2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Create2>;
    deployContract(
      name: "ECDSA",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Errors>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "SafeCast",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeCast>;
    deployContract(
      name: "Strings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "TestJwtAccount",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.TestJwtAccount>;
    deployContract(
      name: "IPublicKeyRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IPublicKeyRegistry>;
    deployContract(
      name: "PublicKeyRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.PublicKeyRegistry>;
    deployContract(
      name: "IProofVerifier",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IProofVerifier>;
    deployContract(
      name: "SimpleAccount",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpleAccount>;
    deployContract(
      name: "SimpleAccountFactory",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SimpleAccountFactory>;
    deployContract(
      name: "Strings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "BaseUltraVerifier",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseUltraVerifier>;
    deployContract(
      name: "UltraVerifier",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.UltraVerifier>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}

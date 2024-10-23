/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  PublicKeyRegistry,
  PublicKeyRegistryInterface,
} from "../../contracts/PublicKeyRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "providerId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "publicKeyHash",
        type: "bytes32",
      },
    ],
    name: "checkPublicKey",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "isPublicKeyHashValid",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "providerId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "publicKeyHash",
        type: "bytes32",
      },
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    name: "setPublicKeyValid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b503380603557604051631e4fbdf760e01b81526000600482015260240160405180910390fd5b603c816041565b506091565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6103a8806100a06000396000f3fe608060405234801561001057600080fd5b50600436106100725760003560e01c80638da5cb5b116100505780638da5cb5b146100f2578063c059d83b1461011a578063f2fde38b1461012d57600080fd5b80635879142a14610077578063715018a6146100ba57806380a798cf146100c4575b600080fd5b6100a56100853660046102d5565b600091825260016020908152604080842092845291905290205460ff1690565b60405190151581526020015b60405180910390f35b6100c2610140565b005b6100a56100d23660046102d5565b600160209081526000928352604080842090915290825290205460ff1681565b60005460405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100b1565b6100c26101283660046102f7565b610154565b6100c261013b366004610335565b6101a4565b61014861020d565b6101526000610260565b565b61015c61020d565b6000928352600160209081526040808520938552929052912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b6101ac61020d565b73ffffffffffffffffffffffffffffffffffffffff8116610201576040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600060048201526024015b60405180910390fd5b61020a81610260565b50565b60005473ffffffffffffffffffffffffffffffffffffffff163314610152576040517f118cdaa70000000000000000000000000000000000000000000000000000000081523360048201526024016101f8565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080604083850312156102e857600080fd5b50508035926020909101359150565b60008060006060848603121561030c57600080fd5b83359250602084013591506040840135801515811461032a57600080fd5b809150509250925092565b60006020828403121561034757600080fd5b813573ffffffffffffffffffffffffffffffffffffffff8116811461036b57600080fd5b939250505056fea2646970667358221220898536035d8a055cc1bf01d482cea849255af1cb882294e640b6993a00b27f7364736f6c634300081b0033";

type PublicKeyRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PublicKeyRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PublicKeyRegistry__factory extends ContractFactory {
  constructor(...args: PublicKeyRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      PublicKeyRegistry & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): PublicKeyRegistry__factory {
    return super.connect(runner) as PublicKeyRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PublicKeyRegistryInterface {
    return new Interface(_abi) as PublicKeyRegistryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): PublicKeyRegistry {
    return new Contract(address, _abi, runner) as unknown as PublicKeyRegistry;
  }
}

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
  EoaAccount,
  EoaAccountInterface,
} from "../../contracts/EoaAccount";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "StringsInsufficientHexLength",
    type: "error",
  },
  {
    inputs: [],
    name: "accountId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "authProviderId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "dummy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "hello",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "proofVerifier",
    outputs: [
      {
        internalType: "contract UltraVerifier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicKeyRegistry",
    outputs: [
      {
        internalType: "contract PublicKeyRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "proof",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "jwtIat",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "jwtNonce",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "publicKeyHash",
            type: "bytes32",
          },
        ],
        internalType: "struct JwtVerifierP256.VerificationData",
        name: "verificationData",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "x",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "y",
            type: "uint256",
          },
        ],
        internalType: "struct EoaAccount.WebauthnPublicKey",
        name: "newP256PublicKey",
        type: "tuple",
      },
    ],
    name: "recover",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "x",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "y",
            type: "uint256",
          },
        ],
        internalType: "struct EoaAccount.WebauthnPublicKey",
        name: "webauthnPublicKey_",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "accountId_",
        type: "bytes32",
      },
      {
        internalType: "contract PublicKeyRegistry",
        name: "publicKeyRegistry_",
        type: "address",
      },
      {
        internalType: "contract UltraVerifier",
        name: "proofVerifier_",
        type: "address",
      },
    ],
    name: "setAccountId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "webauthnPublicKey",
    outputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040527f8f2f90d8304f6eb382d037c47a041d8c8b4d18bdd8b082fa32828e016a584ca7600155348015603357600080fd5b50610d6d806100436000396000f3fe608060405234801561001057600080fd5b50600436106100a35760003560e01c80637dc0872e1161007657806386aeebf71161005b57806386aeebf7146101845780639cfd7cff146101a4578063be6bbfd9146101ad57600080fd5b80637dc0872e1461011c5780637fa417b31461013f57600080fd5b806319ff1d21146100a85780631e203b54146100f057806332e43a11146101035780636b124f5b14610105575b600080fd5b604080518082018252600b81527f68656c6c6f20776f726c64000000000000000000000000000000000000000000602082015290516100e791906108ff565b60405180910390f35b6101036100fe366004610931565b6101c0565b005b61010e60015481565b6040519081526020016100e7565b60045460055461012a919082565b604080519283526020830191909152016100e7565b60035461015f9073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016100e7565b60025461015f9073ffffffffffffffffffffffffffffffffffffffff1681565b61010e60005481565b6101036101bb3660046109aa565b610350565b6101f76101cc83610ab3565b60005460015460025460035473ffffffffffffffffffffffffffffffffffffffff9182169116610420565b610262576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f696e76616c69642070726f6f660000000000000000000000000000000000000060448201526064015b60405180910390fd5b6102726060830160408401610b96565b73ffffffffffffffffffffffffffffffffffffffff16816040516020016102ab9190813581526020918201359181019190915260400190565b6040516020818303038152906040528051906020012060601c73ffffffffffffffffffffffffffffffffffffffff1614610341576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f696e76616c69642070323536207075626c6963206b65790000000000000000006044820152606401610259565b80356004556020013560055550565b3330146103b9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f6e6f742073656c660000000000000000000000000000000000000000000000006044820152606401610259565b83356004556020909301356005556000919091556002805473ffffffffffffffffffffffffffffffffffffffff9283167fffffffffffffffffffffffff00000000000000000000000000000000000000009182161790915560038054929093169116179055565b60608501516040517f5879142a00000000000000000000000000000000000000000000000000000000815260048101859052602481019190915260009073ffffffffffffffffffffffffffffffffffffffff841690635879142a90604401602060405180830381865afa15801561049b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104bf9190610bb3565b610525576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f7075626c6963206b65792068617368206d69736d6174636800000000000000006044820152606401610259565b60006105348760400151610713565b80519091506003906000906105499083610c04565b67ffffffffffffffff811115610561576105616109fc565b60405190808252806020026020018201604052801561058a578160200160208202803683370190505b509050600088828261059b81610c17565b9350815181106105ad576105ad610c4f565b602002602001018181525050896020015160001b8282806105cd90610c17565b9350815181106105df576105df610c4f565b602090810291909101015260608a015182826105fa81610c17565b93508151811061060c5761060c610c4f565b60200260200101818152505060005b845181101561066e5784818151811061063657610636610c4f565b016020015160f81c838361064981610c17565b94508151811061065b5761065b610c4f565b602090810291909101015260010161061b565b5089516040517fea50d0e400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff88169163ea50d0e4916106c491908690600401610c7e565b602060405180830381865afa1580156106e1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107059190610bb3565b9a9950505050505050505050565b606061073673ffffffffffffffffffffffffffffffffffffffff8316601461073c565b92915050565b606082600061074c846002610cd8565b67ffffffffffffffff811115610764576107646109fc565b6040519080825280601f01601f19166020018201604052801561078e576020820181803683370190505b509050600061079e856002610cd8565b6107a9906001610c04565b90505b6001811115610850577f303132333435363738396162636465660000000000000000000000000000000083600f16601081106107ea576107ea610c4f565b1a60f81b826107fa600284610cef565b8151811061080a5761080a610c4f565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049290921c9161084981610d02565b90506107ac565b508115610893576040517fe22e27eb0000000000000000000000000000000000000000000000000000000081526004810186905260248101859052604401610259565b949350505050565b6000815180845260005b818110156108c1576020818501810151868301820152016108a5565b5060006020828601015260207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f83011685010191505092915050565b602081526000610912602083018461089b565b9392505050565b60006040828403121561092b57600080fd5b50919050565b6000806060838503121561094457600080fd5b823567ffffffffffffffff81111561095b57600080fd5b83016080818603121561096d57600080fd5b915061097c8460208501610919565b90509250929050565b73ffffffffffffffffffffffffffffffffffffffff811681146109a757600080fd5b50565b60008060008060a085870312156109c057600080fd5b6109ca8686610919565b93506040850135925060608501356109e181610985565b915060808501356109f181610985565b939692955090935050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516080810167ffffffffffffffff81118282101715610a4e57610a4e6109fc565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715610a9b57610a9b6109fc565b604052919050565b8035610aae81610985565b919050565b600060808236031215610ac557600080fd5b610acd610a2b565b823567ffffffffffffffff811115610ae457600080fd5b830136601f820112610af557600080fd5b803567ffffffffffffffff811115610b0f57610b0f6109fc565b610b4060207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601610a54565b818152366020838501011115610b5557600080fd5b81602084016020830137600060209282018301528352848101359083015250610b8060408401610aa3565b6040820152606092830135928101929092525090565b600060208284031215610ba857600080fd5b813561091281610985565b600060208284031215610bc557600080fd5b8151801515811461091257600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082018082111561073657610736610bd5565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610c4857610c48610bd5565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b604081526000610c91604083018561089b565b828103602084015280845180835260208301915060208601925060005b81811015610ccc578351835260209384019390920191600101610cae565b50909695505050505050565b808202811582820484141761073657610736610bd5565b8181038181111561073657610736610bd5565b600081610d1157610d11610bd5565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019056fea26469706673582212200b665ad3efc13b6d18323c899ea134dc45ff356dd36c6a08c3420cf74cee90b464736f6c634300081b0033";

type EoaAccountConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: EoaAccountConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class EoaAccount__factory extends ContractFactory {
  constructor(...args: EoaAccountConstructorParams) {
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
      EoaAccount & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): EoaAccount__factory {
    return super.connect(runner) as EoaAccount__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): EoaAccountInterface {
    return new Interface(_abi) as EoaAccountInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): EoaAccount {
    return new Contract(address, _abi, runner) as unknown as EoaAccount;
  }
}

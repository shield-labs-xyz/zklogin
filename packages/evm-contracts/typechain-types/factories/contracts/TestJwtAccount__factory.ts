/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  BytesLike,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  TestJwtAccount,
  TestJwtAccountInterface,
} from "../../contracts/TestJwtAccount";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "accountId_",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "authProviderId_",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "proofVerifier",
        type: "address",
      },
      {
        internalType: "contract PublicKeyRegistry",
        name: "publicKeyRegistry_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        internalType: "struct JwtVerifier.VerificationData",
        name: "verificationData",
        type: "tuple",
      },
    ],
    name: "verify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60c060405234801561001057600080fd5b50604051610b47380380610b4783398101604081905261002f91610067565b6001600160a01b039182166080521660a0526000919091556001556100b3565b6001600160a01b038116811461006457600080fd5b50565b6000806000806080858703121561007d57600080fd5b84516020860151604087015191955093506100978161004f565b60608601519092506100a88161004f565b939692955090935050565b60805160a051610a636100e46000396000818160d901526101de015260008181608d015261044f0152610a636000f3fe608060405234801561001057600080fd5b50600436106100675760003560e01c806386aeebf71161005057806386aeebf7146100d45780638aea2d43146100fb5780639cfd7cff1461011057600080fd5b80636b124f5b1461006c5780637fa417b314610088575b600080fd5b61007560015481565b6040519081526020015b60405180910390f35b6100af7f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161007f565b6100af7f000000000000000000000000000000000000000000000000000000000000000081565b61010e610109366004610658565b610119565b005b61007560005481565b600061012c6101278361076a565b61019e565b90508061019a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4a77744163636f756e743a20696e76616c69642070726f6f660000000000000060448201526064015b60405180910390fd5b5050565b60015460608201516040517f5879142a000000000000000000000000000000000000000000000000000000008152600481019290925260248201526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1690635879142a90604401602060405180830381865afa15801561023a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061025e919061084d565b6102c4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f7075626c6963206b65792068617368206d69736d6174636800000000000000006044820152606401610191565b60006102d383604001516104d0565b80519091506003906000906102e8908361089e565b67ffffffffffffffff8111156103005761030061069a565b604051908082528060200260200182016040528015610329578160200160208202803683370190505b5090506000805482828061033c906108b1565b93508151811061034e5761034e6108e9565b602002602001018181525050856020015160001b82828061036e906108b1565b935081518110610380576103806108e9565b60209081029190910101526060860151828261039b816108b1565b9350815181106103ad576103ad6108e9565b60200260200101818152505060005b845181101561040f578481815181106103d7576103d76108e9565b016020015160f81c83836103ea816108b1565b9450815181106103fc576103fc6108e9565b60209081029190910101526001016103bc565b5085516040517fea50d0e400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169163ea50d0e49161048591908690600401610918565b602060405180830381865afa1580156104a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104c6919061084d565b9695505050505050565b60606104f373ffffffffffffffffffffffffffffffffffffffff831660146104f9565b92915050565b60608260006105098460026109ce565b67ffffffffffffffff8111156105215761052161069a565b6040519080825280601f01601f19166020018201604052801561054b576020820181803683370190505b509050600061055b8560026109ce565b61056690600161089e565b90505b600181111561060d577f303132333435363738396162636465660000000000000000000000000000000083600f16601081106105a7576105a76108e9565b1a60f81b826105b76002846109e5565b815181106105c7576105c76108e9565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049290921c91610606816109f8565b9050610569565b508115610650576040517fe22e27eb0000000000000000000000000000000000000000000000000000000081526004810186905260248101859052604401610191565b949350505050565b60006020828403121561066a57600080fd5b813567ffffffffffffffff81111561068157600080fd5b82016080818503121561069357600080fd5b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040516080810167ffffffffffffffff811182821017156106ec576106ec61069a565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff811182821017156107395761073961069a565b604052919050565b803573ffffffffffffffffffffffffffffffffffffffff8116811461076557600080fd5b919050565b60006080823603121561077c57600080fd5b6107846106c9565b823567ffffffffffffffff81111561079b57600080fd5b830136601f8201126107ac57600080fd5b803567ffffffffffffffff8111156107c6576107c661069a565b6107f760207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f840116016106f2565b81815236602083850101111561080c57600080fd5b8160208401602083013760006020928201830152835284810135908301525061083760408401610741565b6040820152606092830135928101929092525090565b60006020828403121561085f57600080fd5b8151801515811461069357600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156104f3576104f361086f565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82036108e2576108e261086f565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b604081526000835180604084015260005b818110156109465760208187018101516060868401015201610929565b506000606082850101527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f82011683019050606081016060848303016020850152808551808352608084019150602087019350600092505b808310156109c357835182526020820191506020840193506001830192506109a0565b509695505050505050565b80820281158282048414176104f3576104f361086f565b818103818111156104f3576104f361086f565b600081610a0757610a0761086f565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019056fea2646970667358221220c98a6d6b1bafa40b94366f60fde884d89c0de78233365d0aaa1a6c13bd4efb8964736f6c634300081b0033";

type TestJwtAccountConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestJwtAccountConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestJwtAccount__factory extends ContractFactory {
  constructor(...args: TestJwtAccountConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    accountId_: BytesLike,
    authProviderId_: BytesLike,
    proofVerifier: AddressLike,
    publicKeyRegistry_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      accountId_,
      authProviderId_,
      proofVerifier,
      publicKeyRegistry_,
      overrides || {}
    );
  }
  override deploy(
    accountId_: BytesLike,
    authProviderId_: BytesLike,
    proofVerifier: AddressLike,
    publicKeyRegistry_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      accountId_,
      authProviderId_,
      proofVerifier,
      publicKeyRegistry_,
      overrides || {}
    ) as Promise<
      TestJwtAccount & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): TestJwtAccount__factory {
    return super.connect(runner) as TestJwtAccount__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestJwtAccountInterface {
    return new Interface(_abi) as TestJwtAccountInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): TestJwtAccount {
    return new Contract(address, _abi, runner) as unknown as TestJwtAccount;
  }
}

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
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  SimpleAccount,
  SimpleAccountInterface,
} from "../../contracts/SimpleAccount";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IEntryPoint",
        name: "anEntryPoint",
        type: "address",
      },
      {
        internalType: "address",
        name: "proofVerifier_",
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
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
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
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    name: "addDeposit",
    outputs: [],
    stateMutability: "payable",
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
    name: "currentOwner",
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
    name: "entryPoint",
    outputs: [
      {
        internalType: "contract IEntryPoint",
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
        internalType: "address",
        name: "dest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "func",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct SimpleAccount.Call[]",
        name: "calls",
        type: "tuple[]",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
            internalType: "bytes32",
            name: "accountId",
            type: "bytes32",
          },
          {
            internalType: "string",
            name: "jwtAud",
            type: "string",
          },
          {
            internalType: "bytes32",
            name: "authProviderId",
            type: "bytes32",
          },
        ],
        internalType: "struct SimpleAccount.InitializeParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "jwtAud",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155BatchReceived",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC1155Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerInfo",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint96",
        name: "expirationTimestamp",
        type: "uint96",
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
    name: "proxiableUUID",
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
    name: "setOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
          {
            internalType: "bytes32",
            name: "accountGasLimits",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "gasFees",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "paymasterAndData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct PackedUserOperation",
        name: "userOp",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "missingAccountFunds",
        type: "uint256",
      },
    ],
    name: "validateUserOp",
    outputs: [
      {
        internalType: "uint256",
        name: "validationData",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "withdrawAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawDepositTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x6101006040523060805234801561001557600080fd5b50604051612efd380380612efd83398101604081905261003491610124565b6001600160a01b0380831660a05280821660c052831660e05261005561005d565b505050610171565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff16156100ad5760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b039081161461010c5780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b6001600160a01b038116811461010c57600080fd5b60008060006060848603121561013957600080fd5b83516101448161010f565b60208501519093506101558161010f565b60408501519092506101668161010f565b809150509250925092565b60805160a05160c05160e051612d0d6101f0600039600081816104e7015281816109e701528181610a9501528181610ee501528181610fa3015281816113ca01526115a101526000818161043701526110120152600081816103de01526113310152600081816117a0015281816117c901526119e50152612d0d6000f3fe60806040526004361061018f5760003560e01c80637fa417b3116100d6578063b387ef921161007f578063c399ec8811610059578063c399ec8814610588578063d087d2881461059d578063f23a6e61146105b257600080fd5b8063b387ef921461050b578063b61d27f614610520578063bc197c811461054057600080fd5b80639cfd7cff116100b05780639cfd7cff14610479578063ad3cb1cc1461048f578063b0d691fe146104d857600080fd5b80637fa417b3146103cc57806386aeebf7146104255780638dcfb9191461045957600080fd5b80634bd834c71161013857806352d1902d1161011257806352d1902d1461037f5780635ad662d4146103945780636b124f5b146103b657600080fd5b80634bd834c7146102be5780634d44560d1461034c5780634f1ef2861461036c57600080fd5b806319822f7c1161016957806319822f7c1461026857806334fcd5be146102965780634a58db19146102b657600080fd5b806301ffc9a71461019b5780630e76173b146101d0578063150b7a02146101f257600080fd5b3661019657005b600080fd5b3480156101a757600080fd5b506101bb6101b6366004612183565b6105f8565b60405190151581526020015b60405180910390f35b3480156101dc57600080fd5b506101f06101eb3660046121c5565b6106dd565b005b3480156101fe57600080fd5b5061023761020d36600461226b565b7f150b7a020000000000000000000000000000000000000000000000000000000095945050505050565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016101c7565b34801561027457600080fd5b506102886102833660046122de565b610870565b6040519081526020016101c7565b3480156102a257600080fd5b506101f06102b1366004612377565b6108fc565b6101f06109e5565b3480156102ca57600080fd5b506003546103139073ffffffffffffffffffffffffffffffffffffffff8116907401000000000000000000000000000000000000000090046bffffffffffffffffffffffff1682565b6040805173ffffffffffffffffffffffffffffffffffffffff90931683526bffffffffffffffffffffffff9091166020830152016101c7565b34801561035857600080fd5b506101f06103673660046123b9565b610a8b565b6101f061037a3660046124c1565b610b42565b34801561038b57600080fd5b50610288610b61565b3480156103a057600080fd5b506103a9610b90565b6040516101c7919061257f565b3480156103c257600080fd5b5061028860025481565b3480156103d857600080fd5b506104007f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101c7565b34801561043157600080fd5b506104007f000000000000000000000000000000000000000000000000000000000000000081565b34801561046557600080fd5b506101f0610474366004612592565b610c1e565b34801561048557600080fd5b5061028860005481565b34801561049b57600080fd5b506103a96040518060400160405280600581526020017f352e302e3000000000000000000000000000000000000000000000000000000081525081565b3480156104e457600080fd5b507f0000000000000000000000000000000000000000000000000000000000000000610400565b34801561051757600080fd5b50610400610de4565b34801561052c57600080fd5b506101f061053b3660046125cd565b610e50565b34801561054c57600080fd5b5061023761055b366004612629565b7fbc197c810000000000000000000000000000000000000000000000000000000098975050505050505050565b34801561059457600080fd5b50610288610e9f565b3480156105a957600080fd5b50610288610f56565b3480156105be57600080fd5b506102376105cd3660046126f4565b7ff23a6e61000000000000000000000000000000000000000000000000000000009695505050505050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f150b7a0200000000000000000000000000000000000000000000000000000000148061068b57507fffffffff0000000000000000000000000000000000000000000000000000000082167f4e2312e000000000000000000000000000000000000000000000000000000000145b806106d757507fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000145b92915050565b426106ee610e10602084013561279f565b101561075b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4a77744163636f756e743a20657870697265642070726f6f660000000000000060448201526064015b60405180910390fd5b600061076e610769836127b2565b610fd2565b9050806107d7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4a77744163636f756e743a20696e76616c69642070726f6f66000000000000006044820152606401610752565b60405180604001604052808360400160208101906107f5919061283e565b73ffffffffffffffffffffffffffffffffffffffff16815260200161081d620151804261285b565b6bffffffffffffffffffffffff908116909152815160209092015116740100000000000000000000000000000000000000000273ffffffffffffffffffffffffffffffffffffffff909116176003555050565b60007f0e76173b000000000000000000000000000000000000000000000000000000006108a0606086018661287f565b6108a9916128e4565b7fffffffff0000000000000000000000000000000000000000000000000000000016036108d8575060006108f5565b6108e06113b2565b6108ea8484611453565b90506108f58261151e565b9392505050565b610904611589565b60005b818110156109e0576109d88383838181106109245761092461294a565b90506020028101906109369190612979565b61094490602081019061283e565b8484848181106109565761095661294a565b90506020028101906109689190612979565b6020013585858581811061097e5761097e61294a565b90506020028101906109909190612979565b61099e90604081019061287f565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061166592505050565b600101610907565b505050565b7f00000000000000000000000000000000000000000000000000000000000000006040517fb760faf900000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff919091169063b760faf99034906024016000604051808303818588803b158015610a7057600080fd5b505af1158015610a84573d6000803e3d6000fd5b5050505050565b610a936116e2565b7f00000000000000000000000000000000000000000000000000000000000000006040517f205c287800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff848116600483015260248201849052919091169063205c287890604401600060405180830381600087803b158015610b2657600080fd5b505af1158015610b3a573d6000803e3d6000fd5b505050505050565b610b4a611788565b610b538261188c565b610b5d8282611894565b5050565b6000610b6b6119cd565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b60018054610b9d906129b7565b80601f0160208091040260200160405190810160405280929190818152602001828054610bc9906129b7565b8015610c165780601f10610beb57610100808354040283529160200191610c16565b820191906000526020600020905b815481529060010190602001808311610bf957829003601f168201915b505050505081565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff16600081158015610c695750825b905060008267ffffffffffffffff166001148015610c865750303b155b905081158015610c94575080155b15610ccb576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b84547fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000001660011785558315610d2c5784547fffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffffffff16680100000000000000001785555b610d7c8635610d3e602089018961287f565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505050506040890135611a3c565b8315610b3a5784547fffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffffffff168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a1505050505050565b6040805180820190915260035473ffffffffffffffffffffffffffffffffffffffff811682527401000000000000000000000000000000000000000090046bffffffffffffffffffffffff166020820181905260009190421115610e4a57600091505090565b51919050565b610e58611589565b610e99848484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061166592505050565b50505050565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016906370a08231906024015b602060405180830381865afa158015610f2d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f519190612a0a565b905090565b6040517f35567e1a0000000000000000000000000000000000000000000000000000000081523060048201526000602482018190529073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016906335567e1a90604401610f10565b60025460608201516040517f5879142a000000000000000000000000000000000000000000000000000000008152600481019290925260248201526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1690635879142a90604401602060405180830381865afa15801561106e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110929190612a23565b6110f8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f7075626c6963206b65792068617368206d69736d6174636800000000000000006044820152606401610752565b60006111078360400151611ace565b805190915060039060009061111e6101008461279f565b611128919061279f565b67ffffffffffffffff811115611140576111406123e5565b604051908082528060200260200182016040528015611169578160200160208202803683370190505b5090506000805482828061117c90612a45565b93508151811061118e5761118e61294a565b602002602001018181525050856020015160001b8282806111ae90612a45565b9350815181106111c0576111c061294a565b6020908102919091010152606086015182826111db81612a45565b9350815181106111ed576111ed61294a565b60200260200101818152505060005b61010081101561129a576001818154611214906129b7565b81106112225761122261294a565b8154600116156112415790600052602060002090602091828204019190065b90547f0100000000000000000000000000000000000000000000000000000000000000911a0260f81c838361127581612a45565b9450815181106112875761128761294a565b60209081029190910101526001016111fc565b5060005b84518110156112f1578481815181106112b9576112b961294a565b016020015160f81c83836112cc81612a45565b9450815181106112de576112de61294a565b602090810291909101015260010161129e565b5085516040517fea50d0e400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169163ea50d0e49161136791908690600401612a7d565b602060405180830381865afa158015611384573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113a89190612a23565b9695505050505050565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614611451576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f6163636f756e743a206e6f742066726f6d20456e747279506f696e74000000006044820152606401610752565b565b7f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c829052603c81206114ce8161149461010087018761287f565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611af192505050565b73ffffffffffffffffffffffffffffffffffffffff166114ec610de4565b73ffffffffffffffffffffffffffffffffffffffff16146115115760019150506106d7565b5060009392505050565b50565b801561151b5760405160009033907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90849084818181858888f193505050503d8060008114610a84576040519150601f19603f3d011682016040523d82523d6000602084013e610a84565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614806115ff57506115d0610de4565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b611451576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f6163636f756e743a206e6f74204f776e6572206f7220456e747279506f696e746044820152606401610752565b6000808473ffffffffffffffffffffffffffffffffffffffff16848460405161168e9190612ad7565b60006040518083038185875af1925050503d80600081146116cb576040519150601f19603f3d011682016040523d82523d6000602084013e6116d0565b606091505b509150915081610a8457805160208201fd5b6116ea610de4565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061172257503330145b611451576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f6f6e6c79206f776e6572000000000000000000000000000000000000000000006044820152606401610752565b3073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016148061185557507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1661183c7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff1614155b15611451576040517fe07c8dba00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b61151b6116e2565b8173ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa925050508015611919575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016820190925261191691810190612a0a565b60015b611967576040517f4c9c8ce300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff83166004820152602401610752565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc81146119c3576040517faa1d49a400000000000000000000000000000000000000000000000000000000815260048101829052602401610752565b6109e08383611b1b565b3073ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614611451576040517fe07c8dba00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60008390556001611a4d8382612b30565b5061010060018054611a5e906129b7565b905014611ac7576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f6a77742e617564206c656e677468206d69736d617463680000000000000000006044820152606401610752565b6002555050565b60606106d773ffffffffffffffffffffffffffffffffffffffff83166014611b7e565b600080600080611b018686611cdd565b925092509250611b118282611d2a565b5090949350505050565b611b2482611e2e565b60405173ffffffffffffffffffffffffffffffffffffffff8316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a2805115611b76576109e08282611efd565b610b5d611f80565b6060826000611b8e846002612c49565b67ffffffffffffffff811115611ba657611ba66123e5565b6040519080825280601f01601f191660200182016040528015611bd0576020820181803683370190505b5090506000611be0856002612c49565b611beb90600161279f565b90505b6001811115611c92577f303132333435363738396162636465660000000000000000000000000000000083600f1660108110611c2c57611c2c61294a565b1a60f81b82611c3c600284612c60565b81518110611c4c57611c4c61294a565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049290921c91611c8b81612c73565b9050611bee565b508115611cd5576040517fe22e27eb0000000000000000000000000000000000000000000000000000000081526004810186905260248101859052604401610752565b949350505050565b60008060008351604103611d175760208401516040850151606086015160001a611d0988828585611fb8565b955095509550505050611d23565b50508151600091506002905b9250925092565b6000826003811115611d3e57611d3e612ca8565b03611d47575050565b6001826003811115611d5b57611d5b612ca8565b03611d92576040517ff645eedf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002826003811115611da657611da6612ca8565b03611de0576040517ffce698f700000000000000000000000000000000000000000000000000000000815260048101829052602401610752565b6003826003811115611df457611df4612ca8565b03610b5d576040517fd78bce0c00000000000000000000000000000000000000000000000000000000815260048101829052602401610752565b8073ffffffffffffffffffffffffffffffffffffffff163b600003611e97576040517f4c9c8ce300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602401610752565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b60606000808473ffffffffffffffffffffffffffffffffffffffff1684604051611f279190612ad7565b600060405180830381855af49150503d8060008114611f62576040519150601f19603f3d011682016040523d82523d6000602084013e611f67565b606091505b5091509150611f778583836120b2565b95945050505050565b3415611451576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0841115611ff357506000915060039050826120a8565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa158015612047573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811661209e575060009250600191508290506120a8565b9250600091508190505b9450945094915050565b6060826120c7576120c282612141565b6108f5565b81511580156120eb575073ffffffffffffffffffffffffffffffffffffffff84163b155b1561213a576040517f9996b31500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85166004820152602401610752565b50806108f5565b8051156121515780518082602001fd5b6040517fd6bda27500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006020828403121561219557600080fd5b81357fffffffff00000000000000000000000000000000000000000000000000000000811681146108f557600080fd5b6000602082840312156121d757600080fd5b813567ffffffffffffffff8111156121ee57600080fd5b8201608081850312156108f557600080fd5b73ffffffffffffffffffffffffffffffffffffffff8116811461151b57600080fd5b60008083601f84011261223457600080fd5b50813567ffffffffffffffff81111561224c57600080fd5b60208301915083602082850101111561226457600080fd5b9250929050565b60008060008060006080868803121561228357600080fd5b853561228e81612200565b9450602086013561229e81612200565b935060408601359250606086013567ffffffffffffffff8111156122c157600080fd5b6122cd88828901612222565b969995985093965092949392505050565b6000806000606084860312156122f357600080fd5b833567ffffffffffffffff81111561230a57600080fd5b8401610120818703121561231d57600080fd5b95602085013595506040909401359392505050565b60008083601f84011261234457600080fd5b50813567ffffffffffffffff81111561235c57600080fd5b6020830191508360208260051b850101111561226457600080fd5b6000806020838503121561238a57600080fd5b823567ffffffffffffffff8111156123a157600080fd5b6123ad85828601612332565b90969095509350505050565b600080604083850312156123cc57600080fd5b82356123d781612200565b946020939093013593505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f83011261242557600080fd5b813567ffffffffffffffff81111561243f5761243f6123e5565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810167ffffffffffffffff8111828210171561248c5761248c6123e5565b6040528181528382016020018510156124a457600080fd5b816020850160208301376000918101602001919091529392505050565b600080604083850312156124d457600080fd5b82356124df81612200565b9150602083013567ffffffffffffffff8111156124fb57600080fd5b61250785828601612414565b9150509250929050565b60005b8381101561252c578181015183820152602001612514565b50506000910152565b6000815180845261254d816020860160208601612511565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b6020815260006108f56020830184612535565b6000602082840312156125a457600080fd5b813567ffffffffffffffff8111156125bb57600080fd5b8201606081850312156108f557600080fd5b600080600080606085870312156125e357600080fd5b84356125ee81612200565b935060208501359250604085013567ffffffffffffffff81111561261157600080fd5b61261d87828801612222565b95989497509550505050565b60008060008060008060008060a0898b03121561264557600080fd5b883561265081612200565b9750602089013561266081612200565b9650604089013567ffffffffffffffff81111561267c57600080fd5b6126888b828c01612332565b909750955050606089013567ffffffffffffffff8111156126a857600080fd5b6126b48b828c01612332565b909550935050608089013567ffffffffffffffff8111156126d457600080fd5b6126e08b828c01612222565b999c989b5096995094979396929594505050565b60008060008060008060a0878903121561270d57600080fd5b863561271881612200565b9550602087013561272881612200565b94506040870135935060608701359250608087013567ffffffffffffffff81111561275257600080fd5b61275e89828a01612222565b979a9699509497509295939492505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156106d7576106d7612770565b6000608082360312156127c457600080fd5b6040516080810167ffffffffffffffff811182821017156127e7576127e76123e5565b604052823567ffffffffffffffff81111561280157600080fd5b61280d36828601612414565b82525060208381013590820152604083013561282881612200565b6040820152606092830135928101929092525090565b60006020828403121561285057600080fd5b81356108f581612200565b6bffffffffffffffffffffffff81811683821601908111156106d7576106d7612770565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe18436030181126128b457600080fd5b83018035915067ffffffffffffffff8211156128cf57600080fd5b60200191503681900382131561226457600080fd5b80357fffffffff000000000000000000000000000000000000000000000000000000008116906004841015612943577fffffffff00000000000000000000000000000000000000000000000000000000808560040360031b1b82161691505b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa18336030181126129ad57600080fd5b9190910192915050565b600181811c908216806129cb57607f821691505b602082108103612a04577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b600060208284031215612a1c57600080fd5b5051919050565b600060208284031215612a3557600080fd5b815180151581146108f557600080fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203612a7657612a76612770565b5060010190565b604081526000612a906040830185612535565b828103602084015280845180835260208301915060208601925060005b81811015612acb578351835260209384019390920191600101612aad565b50909695505050505050565b600082516129ad818460208701612511565b601f8211156109e057806000526020600020601f840160051c81016020851015612b105750805b601f840160051c820191505b81811015610a845760008155600101612b1c565b815167ffffffffffffffff811115612b4a57612b4a6123e5565b612b5e81612b5884546129b7565b84612ae9565b6020601f821160018114612bb05760008315612b7a5750848201515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600385901b1c1916600184901b178455610a84565b6000848152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08516915b82811015612bfe5787850151825560209485019460019092019101612bde565b5084821015612c3a57868401517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600387901b60f8161c191681555b50505050600190811b01905550565b80820281158282048414176106d7576106d7612770565b818103818111156106d7576106d7612770565b600081612c8257612c82612770565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fdfea264697066735822122098800c296b62efb77c2f188cab98448ee685ff1ee12530a7822f7ed97a849db164736f6c634300081b0033";

type SimpleAccountConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SimpleAccountConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SimpleAccount__factory extends ContractFactory {
  constructor(...args: SimpleAccountConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    anEntryPoint: AddressLike,
    proofVerifier_: AddressLike,
    publicKeyRegistry_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      anEntryPoint,
      proofVerifier_,
      publicKeyRegistry_,
      overrides || {}
    );
  }
  override deploy(
    anEntryPoint: AddressLike,
    proofVerifier_: AddressLike,
    publicKeyRegistry_: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      anEntryPoint,
      proofVerifier_,
      publicKeyRegistry_,
      overrides || {}
    ) as Promise<
      SimpleAccount & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SimpleAccount__factory {
    return super.connect(runner) as SimpleAccount__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SimpleAccountInterface {
    return new Interface(_abi) as SimpleAccountInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SimpleAccount {
    return new Contract(address, _abi, runner) as unknown as SimpleAccount;
  }
}

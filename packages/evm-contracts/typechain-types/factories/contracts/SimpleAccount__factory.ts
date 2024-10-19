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
        internalType: "uint256",
        name: "expirationTimestamp",
        type: "uint256",
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
            internalType: "uint256[18]",
            name: "publicKeyLimbs",
            type: "uint256[18]",
          },
          {
            internalType: "uint256[18]",
            name: "publicKeyRedcLimbs",
            type: "uint256[18]",
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
  "0x6101006040523060805234801561001557600080fd5b5060405161301b38038061301b83398101604081905261003491610124565b6001600160a01b0380831660a05280821660c052831660e05261005561005d565b505050610171565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff16156100ad5760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b039081161461010c5780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b6001600160a01b038116811461010c57600080fd5b60008060006060848603121561013957600080fd5b83516101448161010f565b60208501519093506101558161010f565b60408501519092506101668161010f565b809150509250925092565b60805160a05160c05160e051612e2b6101f0600039600081816104b601528181610823015281816108d101528181610e7701528181610f3501528181610f7c01526111530152600081816103e6015261168401526000818161038d0152611a8b0152600081816113520152818161137b01526115970152612e2b6000f3fe60806040526004361061018f5760003560e01c806386aeebf7116100d6578063b387ef921161007f578063c399ec8811610059578063c399ec8814610557578063d087d2881461056c578063f23a6e611461058157600080fd5b8063b387ef92146104da578063b61d27f6146104ef578063bc197c811461050f57600080fd5b80639cfd7cff116100b05780639cfd7cff14610448578063ad3cb1cc1461045e578063b0d691fe146104a757600080fd5b806386aeebf7146103d45780638dcfb91914610408578063906cc5301461042857600080fd5b80634d44560d116101385780635ad662d4116101125780635ad662d4146103435780636b124f5b146103655780637fa417b31461037b57600080fd5b80634d44560d146102fb5780634f1ef2861461031b57806352d1902d1461032e57600080fd5b806334fcd5be1161016957806334fcd5be146102745780634a58db19146102965780634bd834c71461029e57600080fd5b806301ffc9a71461019b578063150b7a02146101d057806319822f7c1461024657600080fd5b3661019657005b600080fd5b3480156101a757600080fd5b506101bb6101b63660046121f4565b6105c7565b60405190151581526020015b60405180910390f35b3480156101dc57600080fd5b506102156101eb3660046122a1565b7f150b7a020000000000000000000000000000000000000000000000000000000095945050505050565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016101c7565b34801561025257600080fd5b50610266610261366004612314565b6106ac565b6040519081526020016101c7565b34801561028057600080fd5b5061029461028f3660046123ad565b610738565b005b610294610821565b3480156102aa57600080fd5b506003546004546102cf9173ffffffffffffffffffffffffffffffffffffffff169082565b6040805173ffffffffffffffffffffffffffffffffffffffff90931683526020830191909152016101c7565b34801561030757600080fd5b506102946103163660046123ef565b6108c7565b6102946103293660046124f7565b61097e565b34801561033a57600080fd5b5061026661099d565b34801561034f57600080fd5b506103586109cc565b6040516101c791906125b5565b34801561037157600080fd5b5061026660025481565b34801561038757600080fd5b506103af7f000000000000000000000000000000000000000000000000000000000000000081565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016101c7565b3480156103e057600080fd5b506103af7f000000000000000000000000000000000000000000000000000000000000000081565b34801561041457600080fd5b506102946104233660046125c8565b610a5a565b34801561043457600080fd5b50610294610443366004612603565b610c20565b34801561045457600080fd5b5061026660005481565b34801561046a57600080fd5b506103586040518060400160405280600581526020017f352e302e3000000000000000000000000000000000000000000000000000000081525081565b3480156104b357600080fd5b507f00000000000000000000000000000000000000000000000000000000000000006103af565b3480156104e657600080fd5b506103af610d9a565b3480156104fb57600080fd5b5061029461050a36600461263f565b610de2565b34801561051b57600080fd5b5061021561052a36600461269b565b7fbc197c810000000000000000000000000000000000000000000000000000000098975050505050505050565b34801561056357600080fd5b50610266610e31565b34801561057857600080fd5b50610266610ee8565b34801561058d57600080fd5b5061021561059c366004612766565b7ff23a6e61000000000000000000000000000000000000000000000000000000009695505050505050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f150b7a0200000000000000000000000000000000000000000000000000000000148061065a57507fffffffff0000000000000000000000000000000000000000000000000000000082167f4e2312e000000000000000000000000000000000000000000000000000000000145b806106a657507fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000145b92915050565b60007f906cc530000000000000000000000000000000000000000000000000000000006106dc60608601866127e2565b6106e591612847565b7fffffffff00000000000000000000000000000000000000000000000000000000160361071457506000610731565b61071c610f64565b6107268484611005565b9050610731826110d0565b9392505050565b61074061113b565b60005b8181101561081c57610814838383818110610760576107606128ad565b905060200281019061077291906128dc565b61078090602081019061291a565b848484818110610792576107926128ad565b90506020028101906107a491906128dc565b602001358585858181106107ba576107ba6128ad565b90506020028101906107cc91906128dc565b6107da9060408101906127e2565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061121792505050565b600101610743565b505050565b7f00000000000000000000000000000000000000000000000000000000000000006040517fb760faf900000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff919091169063b760faf99034906024016000604051808303818588803b1580156108ac57600080fd5b505af11580156108c0573d6000803e3d6000fd5b5050505050565b6108cf611294565b7f00000000000000000000000000000000000000000000000000000000000000006040517f205c287800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff848116600483015260248201849052919091169063205c287890604401600060405180830381600087803b15801561096257600080fd5b505af1158015610976573d6000803e3d6000fd5b505050505050565b61098661133a565b61098f8261143e565b6109998282611446565b5050565b60006109a761157f565b507f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc90565b600180546109d990612937565b80601f0160208091040260200160405190810160405280929190818152602001828054610a0590612937565b8015610a525780601f10610a2757610100808354040283529160200191610a52565b820191906000526020600020905b815481529060010190602001808311610a3557829003601f168201915b505050505081565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff16159067ffffffffffffffff16600081158015610aa55750825b905060008267ffffffffffffffff166001148015610ac25750303b155b905081158015610ad0575080155b15610b07576040517ff92ee8a900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b84547fffffffffffffffffffffffffffffffffffffffffffffffff00000000000000001660011785558315610b685784547fffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffffffff16680100000000000000001785555b610bb88635610b7a60208901896127e2565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525050505060408901356115ee565b83156109765784547fffffffffffffffffffffffffffffffffffffffffffffff00ffffffffffffffff168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a1505050505050565b6000610c32610e1060208401356129b9565b9050428111610ca2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4a77744163636f756e743a20657870697265642070726f6f660000000000000060448201526064015b60405180910390fd5b6000610cb5610cb084612a3c565b611680565b905080610d1e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4a77744163636f756e743a20696e76616c69642070726f6f66000000000000006044820152606401610c99565b6040518060400160405280846040016020810190610d3c919061291a565b73ffffffffffffffffffffffffffffffffffffffff90811682526020918201949094528151600380547fffffffffffffffffffffffff0000000000000000000000000000000000000000169190951617909355909101516004555050565b6040805180820190915260035473ffffffffffffffffffffffffffffffffffffffff1681526004546020820181905260009190421115610ddc57600091505090565b51919050565b610dea61113b565b610e2b848484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061121792505050565b50505050565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015260009073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016906370a08231906024015b602060405180830381865afa158015610ebf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ee39190612ae3565b905090565b6040517f35567e1a0000000000000000000000000000000000000000000000000000000081523060048201526000602482018190529073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016906335567e1a90604401610ea2565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614611003576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f6163636f756e743a206e6f742066726f6d20456e747279506f696e74000000006044820152606401610c99565b565b7f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c829052603c8120611080816110466101008701876127e2565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611b0c92505050565b73ffffffffffffffffffffffffffffffffffffffff1661109e610d9a565b73ffffffffffffffffffffffffffffffffffffffff16146110c35760019150506106a6565b5060009392505050565b50565b80156110cd5760405160009033907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90849084818181858888f193505050503d80600081146108c0576040519150601f19603f3d011682016040523d82523d6000602084013e6108c0565b3373ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614806111b15750611182610d9a565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b611003576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820181905260248201527f6163636f756e743a206e6f74204f776e6572206f7220456e747279506f696e746044820152606401610c99565b6000808473ffffffffffffffffffffffffffffffffffffffff1684846040516112409190612afc565b60006040518083038185875af1925050503d806000811461127d576040519150601f19603f3d011682016040523d82523d6000602084013e611282565b606091505b5091509150816108c057805160208201fd5b61129c610d9a565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806112d457503330145b611003576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600a60248201527f6f6e6c79206f776e6572000000000000000000000000000000000000000000006044820152606401610c99565b3073ffffffffffffffffffffffffffffffffffffffff7f000000000000000000000000000000000000000000000000000000000000000016148061140757507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166113ee7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc5473ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff1614155b15611003576040517fe07c8dba00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6110cd611294565b8173ffffffffffffffffffffffffffffffffffffffff166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa9250505080156114cb575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526114c891810190612ae3565b60015b611519576040517f4c9c8ce300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff83166004820152602401610c99565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc8114611575576040517faa1d49a400000000000000000000000000000000000000000000000000000000815260048101829052602401610c99565b61081c8383611b36565b3073ffffffffffffffffffffffffffffffffffffffff7f00000000000000000000000000000000000000000000000000000000000000001614611003576040517fe07c8dba00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600083905560016115ff8382612b55565b506101006001805461161090612937565b905014611679576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f6a77742e617564206c656e677468206d69736d617463680000000000000000006044820152606401610c99565b6002555050565b60007f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16635879142a6002546116d385606001518660800151611b99565b6040517fffffffff0000000000000000000000000000000000000000000000000000000060e085901b16815260048101929092526024820152604401602060405180830381865afa15801561172c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117509190612c6e565b6117b6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601860248201527f7075626c6963206b65792068617368206d69736d6174636800000000000000006044820152606401610c99565b60006117c58360400151611bcc565b805190915060029060009060129081906117e1610100866129b9565b6117eb91906129b9565b6117f591906129b9565b6117ff91906129b9565b67ffffffffffffffff8111156118175761181761241b565b604051908082528060200260200182016040528015611840578160200160208202803683370190505b5090506000805482828061185390612c90565b935081518110611865576118656128ad565b602002602001018181525050856020015160001b82828061188590612c90565b935081518110611897576118976128ad565b60200260200101818152505060005b6101008110156119445760018181546118be90612937565b81106118cc576118cc6128ad565b8154600116156118eb5790600052602060002090602091828204019190065b90547f0100000000000000000000000000000000000000000000000000000000000000911a0260f81c838361191f81612c90565b945081518110611931576119316128ad565b60209081029190910101526001016118a6565b5060005b845181101561199b57848181518110611963576119636128ad565b016020015160f81c838361197681612c90565b945081518110611988576119886128ad565b6020908102919091010152600101611948565b5060005b60128110156119f357866060015181601281106119be576119be6128ad565b602002015183836119ce81612c90565b9450815181106119e0576119e06128ad565b602090810291909101015260010161199f565b5060005b6012811015611a4b5786608001518160128110611a1657611a166128ad565b60200201518383611a2681612c90565b945081518110611a3857611a386128ad565b60209081029190910101526001016119f7565b5085516040517fea50d0e400000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000169163ea50d0e491611ac191908690600401612cc8565b602060405180830381865afa158015611ade573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b029190612c6e565b9695505050505050565b600080600080611b1c8686611bef565b925092509250611b2c8282611c3c565b5090949350505050565b611b3f82611d40565b60405173ffffffffffffffffffffffffffffffffffffffff8316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a2805115611b915761081c8282611e0f565b610999611e92565b60008282604051602001611bae929190612d45565b60405160208183030381529060405280519060200120905092915050565b60606106a673ffffffffffffffffffffffffffffffffffffffff83166014611eca565b60008060008351604103611c295760208401516040850151606086015160001a611c1b88828585612029565b955095509550505050611c35565b50508151600091506002905b9250925092565b6000826003811115611c5057611c50612d67565b03611c59575050565b6001826003811115611c6d57611c6d612d67565b03611ca4576040517ff645eedf00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6002826003811115611cb857611cb8612d67565b03611cf2576040517ffce698f700000000000000000000000000000000000000000000000000000000815260048101829052602401610c99565b6003826003811115611d0657611d06612d67565b03610999576040517fd78bce0c00000000000000000000000000000000000000000000000000000000815260048101829052602401610c99565b8073ffffffffffffffffffffffffffffffffffffffff163b600003611da9576040517f4c9c8ce300000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff82166004820152602401610c99565b7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc80547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b60606000808473ffffffffffffffffffffffffffffffffffffffff1684604051611e399190612afc565b600060405180830381855af49150503d8060008114611e74576040519150601f19603f3d011682016040523d82523d6000602084013e611e79565b606091505b5091509150611e89858383612123565b95945050505050565b3415611003576040517fb398979f00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6060826000611eda846002612d96565b67ffffffffffffffff811115611ef257611ef261241b565b6040519080825280601f01601f191660200182016040528015611f1c576020820181803683370190505b5090506000611f2c856002612d96565b611f379060016129b9565b90505b6001811115611fde577f303132333435363738396162636465660000000000000000000000000000000083600f1660108110611f7857611f786128ad565b1a60f81b82611f88600284612dad565b81518110611f9857611f986128ad565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049290921c91611fd781612dc0565b9050611f3a565b508115612021576040517fe22e27eb0000000000000000000000000000000000000000000000000000000081526004810186905260248101859052604401610c99565b949350505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08411156120645750600091506003905082612119565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa1580156120b8573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811661210f57506000925060019150829050612119565b9250600091508190505b9450945094915050565b60608261213857612133826121b2565b610731565b815115801561215c575073ffffffffffffffffffffffffffffffffffffffff84163b155b156121ab576040517f9996b31500000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff85166004820152602401610c99565b5080610731565b8051156121c25780518082602001fd5b6040517fd6bda27500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60006020828403121561220657600080fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461073157600080fd5b73ffffffffffffffffffffffffffffffffffffffff811681146110cd57600080fd5b60008083601f84011261226a57600080fd5b50813567ffffffffffffffff81111561228257600080fd5b60208301915083602082850101111561229a57600080fd5b9250929050565b6000806000806000608086880312156122b957600080fd5b85356122c481612236565b945060208601356122d481612236565b935060408601359250606086013567ffffffffffffffff8111156122f757600080fd5b61230388828901612258565b969995985093965092949392505050565b60008060006060848603121561232957600080fd5b833567ffffffffffffffff81111561234057600080fd5b8401610120818703121561235357600080fd5b95602085013595506040909401359392505050565b60008083601f84011261237a57600080fd5b50813567ffffffffffffffff81111561239257600080fd5b6020830191508360208260051b850101111561229a57600080fd5b600080602083850312156123c057600080fd5b823567ffffffffffffffff8111156123d757600080fd5b6123e385828601612368565b90969095509350505050565b6000806040838503121561240257600080fd5b823561240d81612236565b946020939093013593505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600082601f83011261245b57600080fd5b813567ffffffffffffffff8111156124755761247561241b565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f0116810167ffffffffffffffff811182821017156124c2576124c261241b565b6040528181528382016020018510156124da57600080fd5b816020850160208301376000918101602001919091529392505050565b6000806040838503121561250a57600080fd5b823561251581612236565b9150602083013567ffffffffffffffff81111561253157600080fd5b61253d8582860161244a565b9150509250929050565b60005b8381101561256257818101518382015260200161254a565b50506000910152565b60008151808452612583816020860160208601612547565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b602081526000610731602083018461256b565b6000602082840312156125da57600080fd5b813567ffffffffffffffff8111156125f157600080fd5b82016060818503121561073157600080fd5b60006020828403121561261557600080fd5b813567ffffffffffffffff81111561262c57600080fd5b82016104e0818503121561073157600080fd5b6000806000806060858703121561265557600080fd5b843561266081612236565b935060208501359250604085013567ffffffffffffffff81111561268357600080fd5b61268f87828801612258565b95989497509550505050565b60008060008060008060008060a0898b0312156126b757600080fd5b88356126c281612236565b975060208901356126d281612236565b9650604089013567ffffffffffffffff8111156126ee57600080fd5b6126fa8b828c01612368565b909750955050606089013567ffffffffffffffff81111561271a57600080fd5b6127268b828c01612368565b909550935050608089013567ffffffffffffffff81111561274657600080fd5b6127528b828c01612258565b999c989b5096995094979396929594505050565b60008060008060008060a0878903121561277f57600080fd5b863561278a81612236565b9550602087013561279a81612236565b94506040870135935060608701359250608087013567ffffffffffffffff8111156127c457600080fd5b6127d089828a01612258565b979a9699509497509295939492505050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261281757600080fd5b83018035915067ffffffffffffffff82111561283257600080fd5b60200191503681900382131561229a57600080fd5b80357fffffffff0000000000000000000000000000000000000000000000000000000081169060048410156128a6577fffffffff00000000000000000000000000000000000000000000000000000000808560040360031b1b82161691505b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa183360301811261291057600080fd5b9190910192915050565b60006020828403121561292c57600080fd5b813561073181612236565b600181811c9082168061294b57607f821691505b602082108103612984577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b808201808211156106a6576106a661298a565b600082601f8301126129dd57600080fd5b604051610240810167ffffffffffffffff81118282101715612a0157612a0161241b565b60405280610240840185811115612a1757600080fd5b845b81811015612a31578035835260209283019201612a19565b509195945050505050565b60006104e08236031215612a4f57600080fd5b60405160a0810167ffffffffffffffff81118282101715612a7257612a7261241b565b604052823567ffffffffffffffff811115612a8c57600080fd5b612a983682860161244a565b825250602083810135908201526040830135612ab381612236565b6040820152612ac536606085016129cc565b6060820152612ad8366102a085016129cc565b608082015292915050565b600060208284031215612af557600080fd5b5051919050565b60008251612910818460208701612547565b601f82111561081c57806000526020600020601f840160051c81016020851015612b355750805b601f840160051c820191505b818110156108c05760008155600101612b41565b815167ffffffffffffffff811115612b6f57612b6f61241b565b612b8381612b7d8454612937565b84612b0e565b6020601f821160018114612bd55760008315612b9f5750848201515b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600385901b1c1916600184901b1784556108c0565b6000848152602081207fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08516915b82811015612c235787850151825560209485019460019092019101612c03565b5084821015612c5f57868401517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600387901b60f8161c191681555b50505050600190811b01905550565b600060208284031215612c8057600080fd5b8151801515811461073157600080fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203612cc157612cc161298a565b5060010190565b604081526000612cdb604083018561256b565b828103602084015280845180835260208301915060208601925060005b81811015612d16578351835260209384019390920191600101612cf8565b50909695505050505050565b8060005b6012811015610e2b578151845260209384019390910190600101612d26565b612d4f8184612d22565b612d5d610240820183612d22565b6104800192915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b80820281158282048414176106a6576106a661298a565b818103818111156106a6576106a661298a565b600081612dcf57612dcf61298a565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff019056fea2646970667358221220c3b4affffc6e371ad384e72806ae967a64dea1fb055182e075922dd6407943e364736f6c634300081b0033";

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

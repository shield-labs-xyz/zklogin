export const accountAbi = [
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "r",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "s",
            type: "uint256",
          },
        ],
        internalType: "struct ECDSA.Signature",
        name: "signature",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "authenticatorData",
            type: "bytes",
          },
          {
            internalType: "string",
            name: "clientDataJSON",
            type: "string",
          },
          {
            internalType: "uint16",
            name: "challengeIndex",
            type: "uint16",
          },
          {
            internalType: "uint16",
            name: "typeIndex",
            type: "uint16",
          },
          {
            internalType: "bool",
            name: "userVerificationRequired",
            type: "bool",
          },
        ],
        internalType: "struct WebAuthnP256.Metadata",
        name: "metadata",
        type: "tuple",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "getDigest",
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
    name: "nonce",
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
        internalType: "struct ECDSA.PublicKey",
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
        internalType: "struct ECDSA.PublicKey",
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
];

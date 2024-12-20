/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IProofVerifier,
  IProofVerifierInterface,
} from "../../contracts/IProofVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "proof",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "publicInputs",
        type: "bytes32[]",
      },
    ],
    name: "verify",
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
] as const;

export class IProofVerifier__factory {
  static readonly abi = _abi;
  static createInterface(): IProofVerifierInterface {
    return new Interface(_abi) as IProofVerifierInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IProofVerifier {
    return new Contract(address, _abi, runner) as unknown as IProofVerifier;
  }
}

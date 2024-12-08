/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export declare namespace ZkLogin {
  export type AccountDataStruct = {
    accountId: BytesLike;
    authProviderId: BytesLike;
    publicKeyRegistry: AddressLike;
    proofVerifier: AddressLike;
  };

  export type AccountDataStructOutput = [
    accountId: string,
    authProviderId: string,
    publicKeyRegistry: string,
    proofVerifier: string
  ] & {
    accountId: string;
    authProviderId: string;
    publicKeyRegistry: string;
    proofVerifier: string;
  };

  export type VerificationDataStruct = {
    proof: BytesLike;
    jwtIat: BigNumberish;
    jwtNonce: BytesLike;
    publicKeyHash: BytesLike;
  };

  export type VerificationDataStructOutput = [
    proof: string,
    jwtIat: bigint,
    jwtNonce: string,
    publicKeyHash: string
  ] & {
    proof: string;
    jwtIat: bigint;
    jwtNonce: string;
    publicKeyHash: string;
  };
}

export interface TestJwtAccountInterface extends Interface {
  getFunction(nameOrSignature: "accountData" | "verify"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "accountData",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "verify",
    values: [ZkLogin.VerificationDataStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "accountData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "verify", data: BytesLike): Result;
}

export interface TestJwtAccount extends BaseContract {
  connect(runner?: ContractRunner | null): TestJwtAccount;
  waitForDeployment(): Promise<this>;

  interface: TestJwtAccountInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  accountData: TypedContractMethod<
    [],
    [
      [string, string, string, string] & {
        accountId: string;
        authProviderId: string;
        publicKeyRegistry: string;
        proofVerifier: string;
      }
    ],
    "view"
  >;

  verify: TypedContractMethod<
    [verificationData: ZkLogin.VerificationDataStruct],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "accountData"
  ): TypedContractMethod<
    [],
    [
      [string, string, string, string] & {
        accountId: string;
        authProviderId: string;
        publicKeyRegistry: string;
        proofVerifier: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "verify"
  ): TypedContractMethod<
    [verificationData: ZkLogin.VerificationDataStruct],
    [void],
    "nonpayable"
  >;

  filters: {};
}
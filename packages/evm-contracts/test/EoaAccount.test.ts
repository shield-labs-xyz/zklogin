import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import hre, { ethers, safeGetNamedAccounts, typedDeployments } from "hardhat";
import { describe } from "mocha";
import { Account, Client, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readContract } from "viem/actions";
import { signAuthorization } from "viem/experimental";
import { snapshottedBeforeEach } from "../shared/utils";
import {
  EoaAccount__factory,
  PublicKeyRegistry,
  PublicKeyRegistry__factory,
} from "../typechain-types";

describe("EoaAccount", () => {
  let alice: SignerWithAddress;
  let deployer: SignerWithAddress;
  let publicKeyRegistry: PublicKeyRegistry;
  const authProviderId = ethers.id("google"); // TODO: think about the structure

  snapshottedBeforeEach(async () => {
    deployer = await ethers.getSigner(
      (await safeGetNamedAccounts({ deployer: true })).deployer,
    );
    await ethers.provider.send("hardhat_setBalance", [
      deployer.address,
      ethers.toQuantity(ethers.parseEther("100")),
    ]);
    await typedDeployments.fixture();

    [alice] = await ethers.getSigners();

    publicKeyRegistry = PublicKeyRegistry__factory.connect(
      (await typedDeployments.get("PublicKeyRegistry")).address,
      deployer,
    );
  });

  it("works", async () => {
    const publicClient = await hre.viem.getPublicClient();
    const service = new Eip7702Service(publicClient);
    const account = privateKeyToAccount(
      "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
    );
    const result = await service.authorize({ account });
  });
});

class Eip7702Service {
  constructor(private client: Client) {}

  async authorize({ account }: { account: Account }) {
    const contractAddress = (await typedDeployments.get("EoaAccount"))
      .address as `0x${string}`;
    const auth = await signAuthorization(this.client, {
      account,
      contractAddress,
    });

    const accountClient = createWalletClient({
      account: account,
      chain: this.client.chain,
      transport: http(),
    });

    await accountClient.writeContract({
      abi: EoaAccount__factory.abi,
      address: account.address,
      functionName: "dummy",
      args: [],
      authorizationList: [auth],
      account: account,
      chain: this.client.chain,
    });

    const result = await readContract(this.client, {
      address: account.address,
      abi: EoaAccount__factory.abi,
      functionName: "hello",
      args: [],
    });
    console.log("result", result);
  }
}

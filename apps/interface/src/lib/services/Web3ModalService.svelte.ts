import { utils } from "@repo/utils";
import { type EVMEthersClient } from "@web3modal/base/adapters/evm/ethers";
import { createWeb3Modal } from "@web3modal/ethers";
import { ethers } from "ethers";
import { assert } from "ts-essentials";
import { baseSepolia, type Chain } from "viem/chains";

export interface Account {
  address: string;
  chainId: number;
  getSigner: () => Promise<ethers.Signer>;
}

export const chain = baseSepolia;

export class Web3ModalService {
  #modal: ReturnType<typeof createWeb3Modal>;
  #account: Account | undefined = $state();
  #provider:
    | {
        chainId: number;
        provider: ethers.BrowserProvider;
      }
    | undefined = $state();
  readonly #chains = [chain].map(viemChainToEthersChain);

  static getSingleton = utils.lazyValue(() => new Web3ModalService());
  private constructor() {
    const metadata = {
      name: "test",
      description: "",
      url: "https://example.com",
      icons: [],
    };
    this.#modal = createWeb3Modal({
      projectId: "cae629ca204e7bb61f8011b6b74981b7",
      ethersConfig: {
        metadata,
      },
      chains: this.#chains,
    });

    const ethersAdapter = this.#modal.adapter as EVMEthersClient;
    assert(ethersAdapter, "ethersAdapter is not set");
    this.#provider = providerOrUndefined({
      chainId: ethersAdapter.getChainId(),
      provider: ethersAdapter.getWalletProvider(),
    });
    this.#account = accountOrUndefined({
      address: ethersAdapter.getAddress(),
      provider: this.#provider,
    });
    ethersAdapter.subscribeProvider((state) => {
      this.#provider = providerOrUndefined({
        chainId: state.chainId,
        provider: state.provider,
      });
      this.#account = accountOrUndefined({
        address: state.address,
        provider: this.#provider,
      });
    });
    function accountOrUndefined({
      address,
      provider,
    }: {
      address: string | undefined;
      provider: ReturnType<typeof providerOrUndefined> | undefined;
    }) {
      if (address && provider) {
        return {
          address,
          chainId: provider.chainId,
          getSigner: () => provider.provider.getSigner(address),
        };
      }
      return undefined;
    }
    function providerOrUndefined({
      chainId,
      provider,
    }: {
      chainId: number | string | undefined;
      provider: ethers.Eip1193Provider | undefined;
    }) {
      if (chainId && provider) {
        return {
          chainId: ethers.getNumber(chainId),
          provider: new ethers.BrowserProvider(provider),
        };
      }
      return undefined;
    }
  }

  async open() {
    return await this.#modal.open();
  }

  get account() {
    return this.#account;
  }

  get provider() {
    return this.#provider;
  }

  explorerUrl(chainId: number) {
    const root =
      this.#chains.find((c) => c.chainId === chainId)?.explorerUrl ??
      "https://blockscan.com/";
    return {
      address: (address: string) => utils.joinUrl(root, `address/${address}`),
      nft: (address: string, tokenId: string) =>
        utils.joinUrl(root, `nft/${address}/${ethers.getBigInt(tokenId)}`),
    };
  }
}

function viemChainToEthersChain<T extends Chain>(chain: T) {
  const rpcUrl = chain.rpcUrls.default.http[0];
  assert(rpcUrl, "rpcUrl is required");
  const explorerUrl = chain.blockExplorers?.default.url;
  assert(explorerUrl, "explorerUrl is required");
  return {
    chainId: chain.id,
    rpcUrl,
    name: chain.name,
    currency: chain.nativeCurrency.symbol,
    explorerUrl,
  };
}

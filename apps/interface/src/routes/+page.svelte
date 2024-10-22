<script lang="ts">
  import { lib } from "$lib";
  import { chain } from "$lib/chain.js";
  import { LocalStore } from "$lib/localStorage.svelte.js";
  import SendEthCard from "$lib/SendEthCard.svelte";
  import {
    authProviderId,
    encodedAddressAsJwtNonce,
    OWNER_EXPIRATION_TIME,
    prepareJwt,
    proveJwt,
  } from "$lib/services/JwtAccountService.js";
  import { EXTEND_SESSION_SEARCH_PARAM } from "$lib/utils.js";
  import * as web2Auth from "@auth/sveltekit/client";
  import deployments from "@repo/contracts/deployments.json";
  import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types/index.js";
  import { Ui } from "@repo/ui";
  import { utils } from "@repo/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import { ethers } from "ethers";
  import { isEqual } from "lodash-es";
  import ms from "ms";
  import { onMount } from "svelte";
  import { assert } from "ts-essentials";
  import { type Hex } from "viem";
  import type { Address } from "viem/accounts";

  let { data } = $props();

  let jwt = $derived(data.session?.id_token);

  const provider = {
    chainId: chain.id,
    provider: new ethers.JsonRpcProvider(chain.rpcUrls.default.http[0]),
  };

  const signerPrivateKey = new LocalStore<string | undefined>(
    "signer-private-key",
    undefined,
  );
  if (!signerPrivateKey.value) {
    signerPrivateKey.value = ethers.Wallet.createRandom().privateKey;
  }

  let signer = $derived(
    new ethers.Wallet(signerPrivateKey.value, provider.provider),
  );

  // let ownersQuery = $derived(
  //   createQuery(
  //     {
  //       queryKey: ["owners", lib.coinbase.address],
  //       queryFn: async () => {
  //         return await lib.coinbase.getOwners(owner);
  //       },
  //     },
  //     lib.queries.queryClient,
  //   ),
  // );

  let jwtAccountInfo = $derived(
    createQuery(
      {
        queryKey: ["jwtCurrentOwner", jwt, signer.address],
        queryFn: async () => {
          if (!jwt) {
            return null;
          }
          const { account, ownerInfo } = await ethers.resolveProperties({
            account: lib.jwtAccount.getAccount(jwt, signer),
            ownerInfo: lib.jwtAccount.currentOwner(jwt, signer),
          });
          return {
            address: account.address,
            ownerInfo:
              ownerInfo && utils.isAddressEqual(ownerInfo.owner, signer.address)
                ? ownerInfo.expirationTimestamp > Math.floor(Date.now() / 1000)
                  ? ownerInfo
                  : ("expired" as const)
                : undefined,
          };
        },
        refetchInterval: ms("10 sec"),
      },
      lib.queries.queryClient,
    ),
  );

  let isExtendingSession = $state(false);
  async function extendSession() {
    try {
      isExtendingSession = true;
      await extendSessionInner();
    } finally {
      isExtendingSession = false;
    }
  }
  async function extendSessionInner() {
    assert(jwt, "jwt not found");
    const input = await prepareJwt(jwt);
    const jwtNonceMatches = isEqual(
      encodedAddressAsJwtNonce((await signer.getAddress()).toLowerCase()),
      input.jwt_nonce,
    );
    const expirationMargin = Math.min(ms("20 min"), OWNER_EXPIRATION_TIME / 2);
    const jwtExpired =
      input.jwt_iat + OWNER_EXPIRATION_TIME <
      Math.floor((Date.now() - expirationMargin) / 1000);
    if (!jwtNonceMatches || jwtExpired) {
      Ui.toast.log(
        "Sign in again please to link your wallet to your Google account",
      );
      await utils.sleep("2 sec");
      await signIn(signer, { extendSessionAfterLogin: true });
      return;
    }

    {
      const chainId = chain.id as unknown as keyof typeof deployments;
      const publicKeyRegistry = PublicKeyRegistry__factory.connect(
        deployments[chainId].contracts.PublicKeyRegistry,
        signer,
      );
      const publicKeyHash = await publicKeyRegistry.getPublicKeyHash(
        input.public_key_limbs,
        input.public_key_redc_limbs,
      );
      const valid = await publicKeyRegistry.isPublicKeyHashValid(
        authProviderId,
        publicKeyHash,
      );
      if (!valid) {
        assert(
          utils.isAddressEqual(await publicKeyRegistry.owner(), signer.address),
          "Public key hash is not registered",
        );
        const result: boolean = await Ui.toast.confirm({
          confirmText: "Public key is not registered. Register it?",
        });
        assert(result, "rejected to register public key");
        await publicKeyRegistry.setPublicKeyValid(
          authProviderId,
          publicKeyHash,
          true,
        );
      }
    }

    const proof = await proveJwt(input);
    console.log("proof", proof);

    const tx = await lib.jwtAccount.setOwner(jwt, signer, {
      proof: ethers.hexlify(proof) as Hex,
      jwtIat: input.jwt_iat,
      jwtNonce: (await signer.getAddress()) as Address,
      publicKeyLimbs: input.public_key_limbs,
      publicKeyRedcLimbs: input.public_key_redc_limbs,
    });
    console.log("recovery tx", tx);
    Ui.toast.success("Session extended successfully");
    // const jwtAccount = await lib.jwtAccount.getAccount(jwt, signer.address);
    // const tx2 = await lib.coinbase.addOwner(jwtAccount, signer.address);
    // console.log("new owner tx", tx2);
  }

  async function signIn(
    signer: ethers.Signer,
    { extendSessionAfterLogin = false } = {},
  ) {
    const nonce = ethers
      .hexlify(ethers.getBytes(await signer.getAddress()))
      .slice("0x".length);
    const callbackUrl = new URL(location.href);
    if (extendSessionAfterLogin) {
      callbackUrl.searchParams.set(
        EXTEND_SESSION_SEARCH_PARAM.key,
        EXTEND_SESSION_SEARCH_PARAM.value,
      );
    }
    await web2Auth.signIn(
      "google",
      { callbackUrl: callbackUrl.href },
      {
        nonce,
      },
    );
  }

  onMount(async () => {
    const url = new URL(location.href);
    if (
      url.searchParams.get(EXTEND_SESSION_SEARCH_PARAM.key) !==
      EXTEND_SESSION_SEARCH_PARAM.value
    ) {
      return;
    }
    url.searchParams.delete(EXTEND_SESSION_SEARCH_PARAM.key);
    history.replaceState(null, "", url.href);
    await extendSession();
  });

  // async function connectGoogle() {
  //   assert(jwt, "jwt not found");
  //   const account = await lib.jwtAccount.getAccount(
  //     jwt,
  //     signer,
  //   );
  //   const tx = await lib.coinbase.addOwner(owner, account);
  //   console.log("tx", tx);
  // }
</script>

<Ui.GapContainer class="container">
  <section>
    <div class="prose mb-2">
      <h2>Wallet</h2>
    </div>
  </section>

  <!--
  <Ui.Card.Root>
    <Ui.Card.Header>
      <Ui.Card.Title>Coinbase Wallet</Ui.Card.Title>
      {#if lib.coinbase.address}
        {lib.coinbase.address}
      {:else}
        <Ui.LoadingButton
          variant="default"
          style="width: 100%;"
          onclick={async () => {
            await lib.coinbase.getAccount(owner);
          }}
        >
          Create smart wallet
        </Ui.LoadingButton>
      {/if}
    </Ui.Card.Header>

    <Ui.Card.Content>
      <h3>Owners</h3>
      <Ui.Query query={$ownersQuery}>
        {#snippet success(data)}
          {#each data as owner}
            <div>{owner}</div>
          {/each}
        {/snippet}
      </Ui.Query>
    </Ui.Card.Content>
  </Ui.Card.Root>
  -->

  <Ui.Card.Root>
    <Ui.Card.Header>
      <Ui.Card.Title>Google account</Ui.Card.Title>
    </Ui.Card.Header>
    <Ui.Card.Content>
      {#if !jwt}
        <Ui.LoadingButton
          variant="default"
          style="width: 100%;"
          onclick={() => signIn(signer)}
        >
          Sign in with Google
        </Ui.LoadingButton>
      {:else}
        <Ui.Query query={$jwtAccountInfo}>
          {#snippet pending()}
            <div>Loading...</div>
          {/snippet}
          {#snippet success(data)}
            {#if data}
              <div>Address: {data.address}</div>
              <div>Network: {chain.name}</div>
              <div>
                {#if data.ownerInfo == null}
                  No session
                {:else if data.ownerInfo === "expired"}
                  Session expired
                {:else}
                  Session expiration: in {Math.floor(
                    (data.ownerInfo.expirationTimestamp -
                      Math.floor(Date.now() / 1000)) /
                      60,
                  )} minutes
                {/if}
              </div>
              <Ui.LoadingButton
                variant="default"
                onclick={extendSession}
                loading={isExtendingSession}
              >
                {data.ownerInfo == null ? "Create" : "Extend"} session
              </Ui.LoadingButton>
            {/if}
          {/snippet}
        </Ui.Query>
      {/if}
    </Ui.Card.Content>
  </Ui.Card.Root>

  <SendEthCard
    {jwt}
    {signer}
    disabled={!jwt ||
      !$jwtAccountInfo.data?.ownerInfo ||
      $jwtAccountInfo.data.ownerInfo === "expired"}
  />
</Ui.GapContainer>

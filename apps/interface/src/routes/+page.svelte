<script lang="ts">
  import { ethersSignerToWalletClient, getBundlerClient, lib } from "$lib";
  import { chain } from "$lib/chain.js";
  import { LocalStore } from "$lib/localStorage.svelte.js";
  import {
    authProviderId,
    encodedAddressAsJwtNonce,
    prepareJwt,
    proveJwt,
  } from "$lib/services/JwtAccountService.js";
  import { Ui } from "$lib/ui";
  import { zAddress } from "$lib/utils";
  import * as web2Auth from "@auth/sveltekit/client";
  import deployments from "@repo/contracts/deployments.json";
  import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types/index.js";
  import { utils } from "@repo/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import { ethers } from "ethers";
  import { isEqual } from "lodash-es";
  import { assert } from "ts-essentials";
  import { type Hex } from "viem";
  import type { Address } from "viem/accounts";
  import { z } from "zod";

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

  let balanceQuery = $derived(
    createQuery(
      {
        queryKey: ["balance", provider, lib.jwtAccount.address],
        queryFn: async () => {
          const raw = lib.jwtAccount.address
            ? await provider.provider.getBalance(lib.jwtAccount.address)
            : 0n;
          return `${ethers.formatEther(raw)} ETH`;
        },
      },
      lib.queries.queryClient,
    ),
  );

  let jwtCurrentOwnerQuery = $derived(
    createQuery(
      {
        queryKey: ["jwtCurrentOwner", jwt, signer.address],
        queryFn: async () => {
          if (!jwt) {
            return null;
          }
          return await lib.jwtAccount.currentOwner(jwt, signer);
        },
      },
      lib.queries.queryClient,
    ),
  );

  async function recover() {
    assert(jwt, "jwt not found");
    const input = await prepareJwt(jwt);
    const jwtNonceMatches = isEqual(
      encodedAddressAsJwtNonce((await signer.getAddress()).toLowerCase()),
      input.jwt_nonce,
    );
    if (!jwtNonceMatches) {
      Ui.toast.log(
        "Sign in again please to link your wallet to your Google account",
      );
      await utils.sleep("2 sec");
      await signIn();
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
    // const jwtAccount = await lib.jwtAccount.getAccount(jwt, signer.address);
    // const tx2 = await lib.coinbase.addOwner(jwtAccount, signer.address);
    // console.log("new owner tx", tx2);
  }

  async function signIn() {
    const nonce = ethers
      .hexlify(ethers.getBytes(await signer.getAddress()))
      .slice("0x".length);
    await web2Auth.signIn("google", undefined, {
      nonce,
    });
  }

  async function signOut() {
    await web2Auth.signOut();
  }

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
  <Ui.Card>
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
  </Ui.Card>
  -->

  <Ui.Card>
    <Ui.Card.Header>
      <Ui.Card.Title>Google account: {lib.jwtAccount.address}</Ui.Card.Title>
    </Ui.Card.Header>
    <Ui.Card.Content>
      <h3>
        Current owner:
        <Ui.Query query={$jwtCurrentOwnerQuery}>
          {#snippet success(data)}
            {#if !data}
              Unknown
            {:else}
              {data.owner}
              <br />
              Expires in {Math.floor(
                (data.expirationTimestamp - Math.floor(Date.now() / 1000)) / 60,
              )} minutes
            {/if}
          {/snippet}
        </Ui.Query>
      </h3>

      {#if !jwt}
        <Ui.LoadingButton
          variant="default"
          style="width: 100%;"
          onclick={signIn}
        >
          Sign in with Google
        </Ui.LoadingButton>
      {:else}
        <!-- {#if $ownersQuery.data && lib.jwtAccount.address}
          {#if $ownersQuery.data.find((o) => lib.jwtAccount.address && utils.isAddressEqual(o, lib.jwtAccount.address))}
            Google recovery is set -->
        <Ui.LoadingButton onclick={recover}>Recover</Ui.LoadingButton>
        <!-- {:else}
            <Ui.LoadingButton onclick={connectGoogle} variant="default">
              Set Google as recovery method
            </Ui.LoadingButton>
          {/if}
        {/if} -->

        <Ui.LoadingButton onclick={signOut}>Logout</Ui.LoadingButton>
      {/if}
    </Ui.Card.Content>
  </Ui.Card>

  <Ui.Card>
    <Ui.Card.Header>
      <Ui.Card.Title>Send ETH</Ui.Card.Title>
    </Ui.Card.Header>
    <Ui.Card.Content>
      <div>
        Balance: <Ui.Query query={$balanceQuery}>
          {#snippet success(data)}
            {data}
          {/snippet}
        </Ui.Query>
      </div>

      <Ui.Form
        schema={z.object({
          recipient: zAddress(),
          amount: z.string(),
        })}
        onsubmit={async (data) => {
          assert(jwt, "jwt not found");
          const bundlerClient = getBundlerClient(
            await ethersSignerToWalletClient(signer),
          );
          const account = await lib.jwtAccount.getAccount(jwt, signer);
          const tx = await bundlerClient.sendUserOperation({
            account,
            calls: [
              {
                to: data.recipient as Address,
                value: ethers.parseEther(data.amount),
              },
            ],
          });
          console.log("tx", tx);
        }}
      >
        {#snippet children(form, formData)}
          <Ui.Form.Field {form} name="recipient">
            <Ui.Form.Control let:attrs>
              <Ui.Form.Label>Address</Ui.Form.Label>
              <Ui.Input {...attrs} bind:value={formData.recipient} />
            </Ui.Form.Control>
            <Ui.Form.Description></Ui.Form.Description>
            <Ui.Form.FieldErrors />
          </Ui.Form.Field>

          <Ui.Form.Field {form} name="amount">
            <Ui.Form.Control let:attrs>
              <Ui.Form.Label>Amount</Ui.Form.Label>
              <Ui.Input {...attrs} bind:value={formData.amount} />
            </Ui.Form.Control>
            <Ui.Form.Description></Ui.Form.Description>
            <Ui.Form.FieldErrors />
          </Ui.Form.Field>

          <Ui.Form.SubmitButton variant="default">Send</Ui.Form.SubmitButton>
        {/snippet}
      </Ui.Form>
    </Ui.Card.Content>
  </Ui.Card>
</Ui.GapContainer>

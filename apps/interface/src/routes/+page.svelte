<script lang="ts">
  import { lib } from "$lib";
  import ConnectWalletOr from "$lib/ConnectWalletOr.svelte";
  import {
    authProviderId,
    encodedAddressAsJwtNonce,
    prepareJwt,
  } from "$lib/services/JwtAccountService.js";
  import { chain } from "$lib/services/Web3ModalService.svelte.js";
  import { Ui } from "$lib/ui";
  import { decodeJwt, zAddress } from "$lib/utils";
  import * as web2Auth from "@auth/sveltekit/client";
  import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
  import { Noir } from "@noir-lang/noir_js";
  import circuit from "@repo/circuits/target/jwt_account.json";
  import deployments from "@repo/contracts/deployments.json";
  import { PublicKeyRegistry__factory } from "@repo/contracts/typechain-types/index.js";
  import { utils } from "@repo/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import { ethers } from "ethers";
  import { isEqual } from "lodash-es";
  import { onMount } from "svelte";
  import { assert } from "ts-essentials";
  import { bytesToHex, parseEther } from "viem";
  import type { Address } from "viem/accounts";
  import { z } from "zod";

  let { data } = $props();

  let jwt = $derived(data.session?.id_token);

  onMount(async () => {
    console.log("session", data.session);
    if (!jwt) {
      return;
    }
    console.log(decodeJwt(jwt));
  });

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

  let jwtCurrentOwnerQuery = $derived(
    createQuery(
      {
        queryKey: ["jwtCurrentOwner", jwt, lib.jwtAccount.address],
        queryFn: async () => {
          if (!jwt || !lib.web3modal.account) {
            return null;
          }
          return await lib.jwtAccount.currentOwner(
            jwt,
            await lib.web3modal.account.getSigner(),
          );
        },
      },
      lib.queries.queryClient,
    ),
  );

  async function recover() {
    assert(jwt, "jwt not found");
    utils.assertConnected(lib.web3modal.account);

    const signer = await lib.web3modal.account.getSigner();
    const input = await prepareJwt(jwt);
    const jwtNonceMatches = isEqual(
      encodedAddressAsJwtNonce((await signer.getAddress()).toLowerCase()),
      input.jwt_nonce,
    );
    if (!jwtNonceMatches) {
      await signIn();
    }

    {
      const chainId = chain.id as unknown as keyof typeof deployments;
      const publicKeyRegistry = PublicKeyRegistry__factory.connect(
        deployments[chainId].contracts.PublicKeyRegistry,
        await lib.web3modal.account.getSigner(),
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
          utils.isAddressEqual(
            await publicKeyRegistry.owner(),
            lib.web3modal.account.address,
          ),
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

    console.log("generating proof...");
    const noir = new Noir(circuit as any);
    const barretenberg = new BarretenbergBackend(circuit as any);
    console.time("generate witness");
    const { witness } = await noir.execute(input);
    console.timeEnd("generate witness");
    console.time("generate proof");
    const { proof } = await barretenberg.generateProof(witness);
    console.timeEnd("generate proof");
    console.log("proof", bytesToHex(proof));

    const tx = await lib.jwtAccount.setOwner(jwt, signer, {
      proof: bytesToHex(proof),
      jwtIat: input.jwt_iat,
      jwtNonce: (await signer.getAddress()) as Address,
      publicKeyLimbs: input.public_key_limbs,
      publicKeyRedcLimbs: input.public_key_redc_limbs,
    });
    console.log("recovery tx", tx);
    // const jwtAccount = await lib.jwtAccount.getAccount(jwt, lib.web3modal.account.address);
    // const tx2 = await lib.coinbase.addOwner(jwtAccount, lib.web3modal.account.address);
    // console.log("new owner tx", tx2);
  }

  async function signIn() {
    utils.assertConnected(lib.web3modal.account);
    const nonce = ethers
      .hexlify(ethers.getBytes(lib.web3modal.account.address))
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
  //   utils.assertConnected(lib.web3modal.account);
  //   const account = await lib.jwtAccount.getAccount(
  //     jwt,
  //     await lib.web3modal.account.getSigner(),
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
            {data}
          {/snippet}
        </Ui.Query>
      </h3>

      {#if !jwt}
        <Ui.LoadingButton
          variant="default"
          style="width: 100%;"
          onclick={signIn}
        >
          Login with Google
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
      <Ui.Form
        schema={z.object({
          recipient: zAddress(),
          amount: z.string(),
        })}
        onsubmit={async (data) => {
          utils.assertConnected(lib.web3modal.account);
          const signer = await lib.web3modal.account.getSigner();
          console.log(await signer.getAddress());
          await signer.sendTransaction({
            to: data.recipient,
            value: parseEther(data.amount),
          });
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
              <Ui.Form.Label>Address</Ui.Form.Label>
              <Ui.Input {...attrs} bind:value={formData.amount} />
            </Ui.Form.Control>
            <Ui.Form.Description></Ui.Form.Description>
            <Ui.Form.FieldErrors />
          </Ui.Form.Field>

          <ConnectWalletOr class="w-full">
            <Ui.Form.SubmitButton variant="default">Send</Ui.Form.SubmitButton>
          </ConnectWalletOr>
        {/snippet}
      </Ui.Form>
    </Ui.Card.Content>
  </Ui.Card>
</Ui.GapContainer>

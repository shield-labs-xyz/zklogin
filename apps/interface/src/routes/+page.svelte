<script lang="ts">
  import { lib } from "$lib";
  import { chain, provider, relayer } from "$lib/chain.js";
  import { LocalStore } from "$lib/localStorage.svelte.js";
  import { now } from "$lib/now.svelte.js";
  import SendEthCard from "$lib/SendEthCard.svelte";
  import { Ui } from "@repo/ui";
  import { utils } from "@repo/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import { formatDuration, intervalToDuration } from "date-fns";
  import { ethers } from "ethers";
  import ms from "ms";
  import { assert } from "ts-essentials";
  import { isAddress, type Hex } from "viem";
  import {
    generatePrivateKey,
    privateKeyToAccount,
    privateKeyToAddress,
  } from "viem/accounts";

  let { data } = $props();

  let jwt = $derived(data.session?.id_token);

  const accStore = new LocalStore<
    | {
        type: "address";
        address: Hex;
      }
    | {
        type: "privateKey";
        privateKey: Hex;
        address: Hex;
      }
    | undefined
  >("eoa-account", undefined);
  let acc = $derived(accStore.value);

  let codeConnectedQuery = $derived(
    createQuery(
      {
        queryKey: ["codeSize", acc?.address],
        queryFn: async () => {
          if (!acc) {
            return false;
          }
          const code = await provider.provider.getCode(acc?.address);
          return ethers.dataLength(code) > 0;
        },
        refetchInterval: ms("10 sec"),
      },
      lib.queries.queryClient,
    ),
  );

  let credentialIsCorrectQuery = $derived(
    createQuery(
      {
        queryKey: ["credentialIsCorrect", chain.id, acc?.address],
        queryFn: async () => {
          if (!acc) {
            return true;
          }
          const cred = await lib.webAuthn.getCredential();
          if (!cred) {
            return false;
          }
          const isCorrect = await lib.eip7702.isWebAuthnPublicKeyCorrect({
            address: acc.address,
            webAuthnPublicKey: cred.publicKey,
          });
          return isCorrect;
        },
        refetchInterval: ms("10 sec"),
      },
      lib.queries.queryClient,
    ),
  );

  let balanceQuery = $derived(
    createQuery(
      {
        queryKey: ["balance", chain.id, acc?.address],
        queryFn: async () => {
          return acc ? await provider.getBalance(acc.address) : 0n;
        },
        refetchInterval: ms("10 sec"),
      },
      lib.queries.queryClient,
    ),
  );

  async function connect() {
    assert(jwt, "no session");
    utils.assertConnected(acc);
    assert(acc.type === "privateKey", "cannot connect to a recovered account");

    const accountWithPrivateKey = privateKeyToAccount(acc.privateKey);
    const cred = await lib.webAuthn.getOrCreateCredential({ name: "me" });
    const tx = await lib.eip7702.authorize({
      jwt,
      account: accountWithPrivateKey,
      webAuthnPublicKey: cred.publicKey,
    });
    console.log("tx", tx);
    await provider.provider.waitForTransaction(tx);

    Ui.toast.success("Connected Passkeys and Google account successfully");
    lib.queries.invalidateAll();
  }

  let extendSessionStart = $state<number | undefined>();
  async function recover() {
    assert(jwt, "no session");
    utils.assertConnected(acc);

    const recoverCred = await lib.webAuthn.getOrCreateCredential({
      name: "me recover",
    });

    let recTxHash: string | undefined;

    extendSessionStart = Date.now();
    try {
      recTxHash = await lib.eip7702.recover({
        jwt,
        address: acc.address,
        webAuthnPublicKey: recoverCred.publicKey,
      });
    } finally {
      extendSessionStart = undefined;
    }

    console.log("recTxHash", recTxHash);
    await provider.provider.waitForTransaction(recTxHash);

    Ui.toast.success("Recovered successfully");
    lib.queries.invalidateAll();
  }
</script>

<Ui.GapContainer class="container">
  <section>
    <div class="prose mb-2">
      <h2>{lib.APP_NAME}</h2>
    </div>
  </section>

  <Ui.Card.Root>
    <Ui.Card.Header>
      <Ui.Card.Title>Google account</Ui.Card.Title>
    </Ui.Card.Header>
    <Ui.Card.Content>
      {#if acc}
        <div>
          Address: {utils.shortAddress(acc.address)}
          <Ui.CopyButton
            text={acc.address}
            class="size-[1em]"
            iconClass="size-[1em]"
            variant="ghost"
          />
        </div>

        <div>
          Passkeys and Google connected:
          <Ui.Query query={$codeConnectedQuery}>
            {#snippet success(data)}
              {data}
            {/snippet}
          </Ui.Query>
        </div>
        <div>
          Balance: <Ui.Query query={$balanceQuery}>
            {#snippet success(data)}
              {ethers.formatEther(data)} ETH
            {/snippet}
          </Ui.Query>

          {#if $balanceQuery.data === 0n}
            <Ui.LoadingButton
              variant="default"
              size="sm"
              onclick={async () => {
                const tx = await relayer.sendTransaction({
                  to: acc.address,
                  value: ethers.parseEther("0.001"),
                });
                await tx.wait();
              }}
            >
              Top up
            </Ui.LoadingButton>
          {/if}
        </div>
        <div>Network: {chain.name}</div>

        <Ui.GapContainer class="gap-2">
          {#if !jwt}
            <Ui.LoadingButton
              variant="default"
              style="width: 100%;"
              onclick={async () => {
                const cred = await lib.webAuthn.getOrCreateCredential({
                  name: "me",
                });
                await lib.eip7702.requestJwt({
                  webAuthnPublicKey: cred.publicKey,
                });
              }}
            >
              Create passkeys and sign in with Google
            </Ui.LoadingButton>
          {:else if $codeConnectedQuery.data === false}
            <Ui.LoadingButton variant="default" onclick={connect}>
              Connect Passkeys and Google
              {#if $balanceQuery.data === 0n}
                <Ui.Badge variant="destructive" class="ml-2">
                  Top up your balance first
                </Ui.Badge>
              {/if}
            </Ui.LoadingButton>
          {:else if $credentialIsCorrectQuery.data === false}
            <Ui.LoadingButton variant="default" onclick={recover}>
              Recover
            </Ui.LoadingButton>
            {#if extendSessionStart}
              {@const estimatedDuration = ms("1.5 min")}
              <div>
                Remaining time: {formatDuration(
                  intervalToDuration({
                    start: now.value,
                    end: extendSessionStart + estimatedDuration,
                  }),
                )}
                <Ui.Progress
                  value={now.value - extendSessionStart}
                  max={estimatedDuration}
                />
              </div>
            {/if}
          {/if}
          <Ui.Button href="/how" variant="secondary">How it works</Ui.Button>
        </Ui.GapContainer>
      {:else}
        <Ui.GapContainer>
          <Ui.LoadingButton
            variant="default"
            onclick={async () => {
              const privateKey = generatePrivateKey();
              accStore.value = {
                type: "privateKey",
                privateKey,
                address: privateKeyToAddress(privateKey),
              };
            }}
          >
            Create account
          </Ui.LoadingButton>

          <Ui.GapContainer>
            <Ui.LoadingButton
              variant="default"
              onclick={async () => {
                const address = prompt("Enter the address you want to recover");
                if (address == null) {
                  return;
                }
                assert(isAddress(address), `Invalid address: ${address}`);
                accStore.value = {
                  type: "address",
                  address,
                };
              }}
            >
              Recover
            </Ui.LoadingButton>
          </Ui.GapContainer>
        </Ui.GapContainer>
      {/if}
    </Ui.Card.Content>
  </Ui.Card.Root>

  {#if acc && $codeConnectedQuery.data === true}
    <SendEthCard address={acc.address} />
  {/if}

  {#if acc}
    <Ui.LoadingButton
      variant="destructive"
      onclick={async () => {
        const result: boolean = await Ui.toast.confirm({
          confirmText: "Are you sure you want to forget this account?",
        });
        if (!result) {
          return;
        }
        accStore.value = undefined;
      }}
    >
      Forget account
    </Ui.LoadingButton>
  {/if}
</Ui.GapContainer>

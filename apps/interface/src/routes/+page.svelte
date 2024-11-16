<script lang="ts">
  import { lib } from "$lib";
  import { chain, provider } from "$lib/chain.js";
  import { now } from "$lib/now.svelte.js";
  import { Ui } from "@repo/ui";
  import { utils } from "@repo/utils";
  import { formatDuration, intervalToDuration } from "date-fns";
  import ms from "ms";
  import { assert } from "ts-essentials";
  import { privateKeyToAccount } from "viem/accounts";

  let { data } = $props();

  let jwt = $derived(data.session?.id_token);

  const acc = privateKeyToAccount(
    "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
  );

  async function connect() {
    assert(jwt, "no session");

    const cred = await lib.webAuthn.useOrCreateCredential({ name: "me" });
    const tx = await lib.eip7702.authorize({
      jwt,
      account: acc,
      webAuthnPublicKey: cred.publicKey,
    });
    console.log("tx", tx);
    await provider.provider.waitForTransaction(tx);
  }

  let extendSessionStart = $state<number | undefined>();
  async function recover() {
    assert(jwt, "no session");

    const recoverCred = await lib.webAuthn.useOrCreateCredential({
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

    await lib.eip7702.executeTx({
      credentialId: recoverCred.id,
      address: acc.address,
    });

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
      <div>
        Address: {utils.shortAddress(acc.address)}
        <Ui.CopyButton
          text={acc.address}
          class="size-[1em]"
          iconClass="size-[1em]"
          variant="ghost"
        />
      </div>
      <div>Network: {chain.name}</div>

      {#if !jwt}
        <Ui.GapContainer class="gap-2">
          <Ui.LoadingButton
            variant="default"
            style="width: 100%;"
            onclick={async () => {
              const cred = await lib.webAuthn.useOrCreateCredential({
                name: "me",
              });
              await lib.eip7702.requestJwt({
                webAuthnPublicKey: cred.publicKey,
              });
            }}
          >
            Sign in with Google
          </Ui.LoadingButton>
          <Ui.Button href="/how" variant="secondary">How it works</Ui.Button>
        </Ui.GapContainer>
      {:else}
        <Ui.GapContainer>
          <Ui.LoadingButton variant="default" onclick={connect}>
            Connect
          </Ui.LoadingButton>
          <Ui.GapContainer>
            <Ui.LoadingButton
              variant="default"
              onclick={async () => {
                await recover();
              }}
            >
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
          </Ui.GapContainer>
        </Ui.GapContainer>
      {/if}
    </Ui.Card.Content>
  </Ui.Card.Root>
  <!--
  <SendEthCard
    {jwt}
    {signer}
    disabled={!jwt ||
      !$jwtAccountInfo.data?.ownerInfo ||
      $jwtAccountInfo.data.ownerInfo === "expired"}
  /> -->
</Ui.GapContainer>

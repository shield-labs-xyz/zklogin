<script lang="ts">
  import { PUBLIC_AUTH_GOOGLE_ID } from "$env/static/public";
  import { getBundlerClient, lib, publicClient } from "$lib";
  import { provider } from "$lib/chain.js";
  import { LocalStore } from "$lib/localStorage.svelte.js";
  import { now } from "$lib/now.svelte.js";
  import SendEthCard from "$lib/SendEthCard.svelte";
  import { toJwtNonce } from "$lib/services/JwtAccountService.js";
  import { EXTEND_SESSION_SEARCH_PARAM } from "$lib/utils.js";
  import * as web2Auth from "@auth/sveltekit/client";
  import { Ui } from "@repo/ui";
  import { utils } from "@shield-labs/utils";
  import { zklogin } from "@shield-labs/zklogin";
  import { createQuery } from "@tanstack/svelte-query";
  import { formatDistance, formatDuration, intervalToDuration } from "date-fns";
  import { ethers } from "ethers";
  import ms from "ms";
  import { onMount } from "svelte";
  import { assert } from "ts-essentials";

  let { data } = $props();

  let jwt = $derived(data.session?.id_token);

  const signerPrivateKey = new LocalStore<string | undefined>(
    "signer-private-key",
    undefined,
  );
  if (!signerPrivateKey.value) {
    signerPrivateKey.value = ethers.Wallet.createRandom().privateKey;
  }

  let signer = $derived(new ethers.Wallet(signerPrivateKey.value, provider));

  let jwtAccountInfo = $derived(
    createQuery(
      {
        queryKey: ["jwtCurrentOwner", jwt, signer.address],
        queryFn: async () => {
          if (!jwt) {
            return null;
          }
          const account = await lib.jwtAccount.getAccount(jwt, signer);
          const ownerInfo = await lib.jwtAccount.currentOwner(account);
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

  let extendSessionStart = $state<number | undefined>();
  async function extendSession() {
    try {
      extendSessionStart = Date.now();
      await extendSessionInner();
    } finally {
      extendSessionStart = undefined;
    }
  }

  async function extendSessionInner() {
    console.log("extend session");

    const provider = new zklogin.GoogleProvider(PUBLIC_AUTH_GOOGLE_ID);
    const jwt = await provider.signInWithGoogle({
      nonce: await toJwtNonce(signer),
    });
    assert(jwt, "no session");

    // TODO: remove this
    await lib.zkLogin.publicKeyRegistry.requestPublicKeysUpdate(
      publicClient.chain.id,
    );

    const result = await lib.zkLogin.proveJwt(jwt, await toJwtNonce(signer));
    if (!result) {
      Ui.toast.log(
        "Sign in again please to link your wallet to your Google account",
      );
      await utils.sleep("2 sec");
      await signIn(signer, { extendSessionAfterLogin: true });
      return;
    }
    const { proof, input } = result;

    console.log("proof", proof);

    const tx = await lib.jwtAccount.setOwner(jwt, signer, {
      proof,
      jwtIat: input.jwt_iat,
      publicKeyHash: input.public_key_hash,
    });
    console.log("recovery tx", tx);
    await getBundlerClient(publicClient).waitForUserOperationReceipt({
      hash: tx,
    });
    Ui.toast.success("Session extended successfully");
    lib.queries.invalidateAll();
  }

  async function signIn(
    signer: ethers.Signer,
    { extendSessionAfterLogin = false } = {},
  ) {
    const nonce = await toJwtNonce(signer);
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
</script>

<Ui.GapContainer class="container">
  <section>
    <div class="prose mb-2">
      <h2>{lib.APP_NAME}</h2>
    </div>
  </section>

  <Ui.LoadingButton
    variant="default"
    onclick={extendSession}
    loading={extendSessionStart != null}
  >
    session
  </Ui.LoadingButton>
  {#if extendSessionStart}
    {@const estimatedDuration = ms("1.5 min")}
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
  {/if}

  <Ui.Card.Root>
    <Ui.Card.Header>
      <Ui.Card.Title>Google account</Ui.Card.Title>
    </Ui.Card.Header>
    <Ui.Card.Content>
      {#if !jwt}
        <Ui.GapContainer class="gap-2">
          <Ui.LoadingButton
            variant="default"
            style="width: 100%;"
            onclick={() => signIn(signer)}
          >
            Sign in with Google
          </Ui.LoadingButton>
          <Ui.Button href="/how" variant="secondary">How it works</Ui.Button>
        </Ui.GapContainer>
      {:else}
        <Ui.Query query={$jwtAccountInfo}>
          {#snippet pending()}
            <div>Loading...</div>
          {/snippet}
          {#snippet success(data)}
            {#if data}
              <Ui.GapContainer class="gap-2">
                <section>
                  <div>
                    Address: {utils.shortAddress(data.address)}
                    <Ui.CopyButton
                      text={data.address}
                      class="size-[1em]"
                      iconClass="size-[1em]"
                      variant="ghost"
                    />
                  </div>
                  <div>Network: {publicClient.chain.name}</div>
                  <div>
                    {#if data.ownerInfo == null}
                      No session
                    {:else if data.ownerInfo === "expired"}
                      Session expired
                    {:else}
                      Session expiration: in {formatDistance(
                        data.ownerInfo.expirationTimestamp * 1000,
                        now.value,
                      )}
                    {/if}
                  </div>
                </section>
                <Ui.LoadingButton
                  variant="default"
                  onclick={extendSession}
                  loading={extendSessionStart != null}
                >
                  {data.ownerInfo == null ? "Create" : "Extend"} session
                </Ui.LoadingButton>
                {#if extendSessionStart}
                  {@const estimatedDuration = ms("1.5 min")}
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
                {/if}
              </Ui.GapContainer>
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

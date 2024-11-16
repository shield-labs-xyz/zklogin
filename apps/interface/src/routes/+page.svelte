<script lang="ts">
  import { lib } from "$lib";
  import { chain, provider, publicKeyRegistry } from "$lib/chain.js";
  import { LocalStore } from "$lib/localStorage.svelte.js";
  import { now } from "$lib/now.svelte.js";
  import SendEthCard from "$lib/SendEthCard.svelte";
  import {
    authProviderId,
    encodedAddressAsJwtNonce,
    getPublicKeyHash,
    JWT_EXPIRATION_TIME,
    prepareJwt,
    proveJwt,
  } from "$lib/services/JwtAccountService.js";
  import { EXTEND_SESSION_SEARCH_PARAM } from "$lib/utils.js";
  import * as web2Auth from "@auth/sveltekit/client";
  import { Ui } from "@repo/ui";
  import { utils } from "@repo/utils";
  import { createQuery } from "@tanstack/svelte-query";
  import { formatDistance, formatDuration, intervalToDuration } from "date-fns";
  import { ethers } from "ethers";
  import ky from "ky";
  import { isEqual } from "lodash-es";
  import ms from "ms";
  import { onMount } from "svelte";
  import { assert } from "ts-essentials";
  import { slice } from "viem";
  import { privateKeyToAccount } from "viem/accounts";
  import { createCredential, parsePublicKey, sign } from "webauthn-p256";
  import { accountAbi } from "./abi.js";

  let { data } = $props();

  let jwt = $derived(data.session?.id_token);

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

  const relayer = new ethers.Wallet(
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    provider.provider,
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
    assert(jwt, "no session");
    const input = await prepareJwt(jwt);
    await storePublicKeyIfNotStored(input);
    const jwtNonceMatches = isEqual(
      encodedAddressAsJwtNonce((await signer.getAddress()).toLowerCase()),
      input.jwt_nonce,
    );
    const expirationMargin = Math.min(ms("20 min"), JWT_EXPIRATION_TIME / 2);
    const jwtExpired =
      input.jwt_iat + JWT_EXPIRATION_TIME <
      Math.floor((Date.now() - expirationMargin) / 1000);
    if (!jwtNonceMatches || jwtExpired) {
      Ui.toast.log(
        "Sign in again please to link your wallet to your Google account",
      );
      await utils.sleep("2 sec");
      await signIn(signer, { extendSessionAfterLogin: true });
      return;
    }

    await storePublicKeyIfNotStored(input);

    const acc = privateKeyToAccount(
      "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
    );
    // const proof = await proveJwt(input);
    // console.log("proof", proof);

    const cred = await createCredential({
      user: {
        name: "me",
      },
    });
    const tx = await lib.eip7702.authorize({
      jwt,
      account: acc,
      webauthnPublicKey: parsePublicKey(cred.publicKey),
    });
    console.log("tx", tx);
    await provider.provider.waitForTransaction(tx);

    const accContract = new ethers.Contract(
      acc.address,
      accountAbi,
      provider.provider,
    );
    const result = await accContract.hello!();
    console.log("result", result);

    // const tx = await lib.jwtAccount.setOwner(jwt, signer, {
    //   proof: ethers.hexlify(proof),
    //   jwtIat: input.jwt_iat,
    //   jwtNonce: await signer.getAddress(),
    //   publicKeyHash: input.public_key_hash,
    // });
    // console.log("recovery tx", tx);
    // await getBundlerClient(publicClient).waitForUserOperationReceipt({
    //   hash: tx,
    // });

    {
      // recover

      const recoverCred = await createCredential({
        user: {
          name: "me recover",
        },
      });
      const proof = await proveJwt(input);
      const recTx = await (accContract.connect(relayer) as any).recover!(
        {
          proof: ethers.hexlify(proof),
          jwtIat: input.jwt_iat,
          jwtNonce: await signer.getAddress(),
          publicKeyHash: input.public_key_hash,
        },
        parsePublicKey(recoverCred.publicKey),
      );
      console.log("recTx", recTx);
      await recTx.wait();
      await executeTx(recoverCred, accContract);
    }

    Ui.toast.success("Session extended successfully");
    lib.queries.invalidateAll();
    // const jwtAccount = await lib.jwtAccount.getAccount(jwt, signer.address);
    // const tx2 = await lib.coinbase.addOwner(jwtAccount, signer.address);
    // console.log("new owner tx", tx2);
  }

  async function executeTx(
    cred: Awaited<ReturnType<typeof createCredential>>,
    accContract: ethers.Contract,
  ) {
    const nonce = await accContract.nonce!();
    const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const value = ethers.parseEther("0.00000123");
    const data = "0x";
    const digest = ethers.AbiCoder.defaultAbiCoder().encode(
      ["uint256", "address", "bytes", "uint256"],
      [nonce, to, data, value],
    );
    const digestHash = ethers.keccak256(digest) as `0x${string}`;
    console.log("real digest", digestHash);
    console.log("digest", await accContract.getDigest!(to, data, value));

    console.log("real public key", await accContract.webauthnPublicKey!());
    const pubadsf = parsePublicKey(cred.publicKey);
    console.log("public key", {
      x: pubadsf.x,
      y: pubadsf.y,
    });

    const signature = await sign({ hash: digestHash, credentialId: cred.id });
    const r = slice(signature.signature, 0, 32);
    const s = slice(signature.signature, 32, 64);
    console.log("signature", signature.signature);
    console.log("r", r);
    console.log("s", s);

    console.log(
      "balance before",
      await provider.provider.getBalance(accContract),
    );

    const tx2 = await (accContract.connect(relayer) as any).execute!(
      to,
      data,
      value,
      { r, s },
      signature.webauthn,
    );
    console.log("tx2", tx2);
    await tx2.wait();
    console.log(
      "balance after",
      await provider.provider.getBalance(accContract),
    );
  }

  async function storePublicKeyIfNotStored(publicKey: {
    public_key_limbs: string[];
    public_key_redc_limbs: string[];
  }) {
    const publicKeyHash = await getPublicKeyHash(publicKey);
    const valid = await publicKeyRegistry.isPublicKeyHashValid(
      authProviderId,
      publicKeyHash,
    );
    if (valid) {
      console.log("public key is valid");
      return;
    }
    console.log("updating public key...");
    await Ui.toast.promise(
      utils.iife(async () => {
        const { hash } = await ky
          .post("/api/register-public-keys")
          .json<{ hash: string | null }>();
        if (hash) {
          await provider.provider.waitForTransaction(hash);
        }
      }),
      {
        loading: "Updating google public keys...",
        success: "Google public keys updated",
        error: (e) =>
          `Error updating google public keys: ${utils.errorToString(e)}`,
      },
    );
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
  //   assert(jwt, "no session");
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
      <h2>{lib.APP_NAME}</h2>
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
                  <div>Network: {chain.name}</div>
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

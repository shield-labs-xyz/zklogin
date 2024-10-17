<script lang="ts">
  import { lib } from "$lib";
  import ConnectWalletOr from "$lib/ConnectWalletOr.svelte";
  import { Ui } from "$lib/ui";
  import {
    base64UrlToBase64,
    base64UrlToBigInt,
    decodeJwt,
    splitJwt,
    zAddress,
  } from "$lib/utils";
  import * as web2Auth from "@auth/sveltekit/client";
  import {
    bnToLimbStrArray,
    bnToRedcLimbStrArray,
  } from "@mach-34/noir-bignum-paramgen";
  import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
  import { Noir } from "@noir-lang/noir_js";
  import circuit from "@repo/circuits/jwt_account";
  import { utils } from "@repo/utils";
  import { ethers } from "ethers";
  import ky from "ky";
  import { onMount } from "svelte";
  import { assert } from "ts-essentials";
  import { z } from "zod";

  let { data } = $props();

  onMount(async () => {
    console.log("session", data.session);

    if (!data.session?.id_token) {
      return;
    }
    console.log(decodeJwt(data.session.id_token));
  });

  async function prove() {
    if (!data.session?.id_token) {
      Ui.toast.error("Not logged in");
      return;
    }

    // Note: keep in sync with Noir
    const JWT_HEADER_MAX_LEN = 256;
    // Note: keep in sync with Noir
    const JWT_PAYLOAD_JSON_MAX_LEN = 768;
    // Note: keep in sync with Noir
    const JWT_PAYLOAD_MAX_LEN = Math.ceil(JWT_PAYLOAD_JSON_MAX_LEN / 3) * 4;
    // Note: keep in sync with Noir
    const JWT_SUB_MAX_LEN = 64;

    const jwt = data.session.id_token;
    const [headerBase64Url, payloadBase64Url, signatureBase64Url] =
      splitJwt(jwt);

    const noir = new Noir(circuit as any);
    const barretenberg = new BarretenbergBackend(circuit as any);
    console.time("generate witness");

    const header_and_payload = toBoundedVec(
      Array.from(ethers.toUtf8Bytes(`${headerBase64Url}.${payloadBase64Url}`)),
      JWT_HEADER_MAX_LEN + 1 + JWT_PAYLOAD_MAX_LEN,
    );
    const payload_json = utils.arrayPadEnd(
      // TODO: remove base64url dependency
      Array.from(ethers.decodeBase64(base64UrlToBase64(payloadBase64Url))),
      JWT_PAYLOAD_JSON_MAX_LEN,
      " ".charCodeAt(0),
    );
    const signature_limbs = bnToLimbStrArray(
      base64UrlToBigInt(signatureBase64Url),
    );
    const jwtDecoded = decodeJwt(jwt);
    const publicKeys = await getGooglePublicKeys();
    const publicKey = publicKeys.find(
      (key) => key.kid === jwtDecoded.header.kid,
    );
    assert(publicKey, "publicKey not found");
    const salt = 0;
    const { pedersenHash } = await import("@aztec/foundation/crypto");
    const account_id = pedersenHash([
      ...utils.arrayPadEnd(
        Array.from(ethers.toUtf8Bytes(jwtDecoded.payload.sub)),
        JWT_SUB_MAX_LEN,
        0,
      ),
      salt,
    ]).toString();
    const input = {
      header_and_payload,
      payload_json,
      signature_limbs,
      account_id,
      salt,
      public_key_limbs: publicKey.limbs.public_key_limbs,
      public_key_redc_limbs: publicKey.limbs.public_key_redc_limbs,
    };
    console.log(input);
    const { witness } = await noir.execute(input);
    console.timeEnd("generate witness");
    console.time("generate proof");
    await barretenberg.generateProof(witness);
    console.timeEnd("generate proof");
    return;
  }

  function toBoundedVec(arr: number[], maxLen: number) {
    const storage = utils.arrayPadEnd(arr, maxLen, 0);
    return { storage, len: arr.length };
  }

  async function getGooglePublicKeys() {
    const res = await ky
      .get("https://www.googleapis.com/oauth2/v3/certs")
      .json<{ keys: { n: string; kid: string }[] }>();
    const keys = res.keys.map((key) => {
      const publicKey = base64UrlToBigInt(key.n);
      const limbs = {
        public_key_limbs: bnToLimbStrArray(publicKey),
        public_key_redc_limbs: bnToRedcLimbStrArray(publicKey),
      };
      return { kid: key.kid, limbs };
    });
    return keys;
  }
</script>

<Ui.GapContainer>
  <section class="container">
    <div class="prose mb-2">
      <h2>Wallet</h2>
    </div>
  </section>

  <Ui.Card>
    <Ui.Card.Content>
      <Ui.LoadingButton
        variant="default"
        style="width: 100%;"
        onclick={async () => {
          await web2Auth.signIn();
        }}
      >
        Login with Google
      </Ui.LoadingButton>

      <Ui.LoadingButton onclick={prove}>Prove</Ui.LoadingButton>
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
            value: ethers.parseEther(data.amount),
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

  <Ui.Card>
    <Ui.Card.Header>
      <Ui.Card.Title>Add owner</Ui.Card.Title>
    </Ui.Card.Header>
    <Ui.Card.Content>
      <Ui.Form
        schema={z.object({
          owner: zAddress(),
        })}
        onsubmit={async (data) => {
          utils.assertConnected(lib.web3modal.account);
          const signer = await lib.web3modal.account.getSigner();
          console.log(await signer.getAddress());
          const abi = ["function addOwnerAddress(address owner)"];
          const contract = new ethers.Contract(
            await signer.getAddress(),
            abi,
            signer,
          );
          // unfortunately, this does not work. coinbase.com shows "something went wrong". Probably a guard against scammers
          const tx = await contract.addOwnerAddress!(data.owner);
        }}
      >
        {#snippet children(form, formData)}
          <Ui.Form.Field {form} name="owner">
            <Ui.Form.Control let:attrs>
              <Ui.Form.Label>Address</Ui.Form.Label>
              <Ui.Input {...attrs} bind:value={formData.owner} />
            </Ui.Form.Control>
            <Ui.Form.Description></Ui.Form.Description>
            <Ui.Form.FieldErrors />
          </Ui.Form.Field>

          <ConnectWalletOr class="w-full">
            <Ui.Form.SubmitButton variant="default">
              Add owner
            </Ui.Form.SubmitButton>
          </ConnectWalletOr>
        {/snippet}
      </Ui.Form>
    </Ui.Card.Content>
  </Ui.Card>
</Ui.GapContainer>

<script lang="ts">
  import { lib } from "$lib";
  import ConnectWalletOr from "$lib/ConnectWalletOr.svelte";
  import {
    prepareJwt,
    toJwtSmartAccount,
  } from "$lib/services/JwtAccountService.js";
  import { chain } from "$lib/services/Web3ModalService.svelte.js";
  import { Ui } from "$lib/ui";
  import { decodeJwt, zAddress } from "$lib/utils";
  import * as web2Auth from "@auth/sveltekit/client";
  import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
  import { Noir } from "@noir-lang/noir_js";
  import circuit from "@repo/circuits/target/jwt_account.json" with { type: "json" };
  import { utils } from "@repo/utils";
  import { ethers } from "ethers";
  import { onMount } from "svelte";
  import { assert } from "ts-essentials";
  import {
    bytesToHex,
    createPublicClient,
    createWalletClient,
    hexToBytes,
    http,
    parseEther,
    type PublicClient,
  } from "viem";
  import {
    createBundlerClient,
    createPaymasterClient,
  } from "viem/account-abstraction";
  import { privateKeyToAccount } from "viem/accounts";
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

  const temporaryOwnerAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";

  async function prove() {
    if (!jwt) {
      Ui.toast.error("Not logged in");
      return;
    }
    const input = await prepareJwt(jwt);

    const noir = new Noir(circuit as any);
    const barretenberg = new BarretenbergBackend(circuit as any);
    console.time("generate witness");
    const { witness } = await noir.execute(input);
    console.timeEnd("generate witness");
    console.time("generate proof");
    const { proof } = await barretenberg.generateProof(witness);
    console.timeEnd("generate proof");
    console.log("proof", bytesToHex(proof));
  }

  async function signIn() {
    const nonce = bytesToHex(hexToBytes(temporaryOwnerAddress)).slice(
      "0x".length,
    );
    await web2Auth.signIn("google", undefined, {
      nonce,
    });
  }

  async function createSmartAccount() {
    assert(jwt, "jwt not found");

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    const owner = privateKeyToAccount(
      "0x28a30f5bbd37a5da63f5429133c06f43358d54b0b22eff921b98f92d93a98737",
    );
    const walletClient = createWalletClient({
      account: owner,
      chain,
      transport: http(),
    });

    const paymasterClient = createPaymasterClient({
      transport: http(
        "https://api.pimlico.io/v2/84532/rpc?apikey=pim_NN7RHTfDreHNUP6RTrkg7p",
      ),
    });

    const bundlerClient = createBundlerClient({
      client: publicClient,
      paymaster: paymasterClient,
      transport: http(
        "https://api.pimlico.io/v2/84532/rpc?apikey=pim_NN7RHTfDreHNUP6RTrkg7p",
      ),
    });

    const account = await toJwtSmartAccount(
      walletClient,
      jwt,
      publicClient as PublicClient,
    );
    console.log("viem account", account);

    const tx = await bundlerClient.sendUserOperation({
      account,
      calls: [
        {
          to: owner.address,
          value: 0n,
        },
      ],
    });
    console.log("tx", tx);
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
      <Ui.LoadingButton variant="default" style="width: 100%;" onclick={signIn}>
        Login with Google
      </Ui.LoadingButton>

      <Ui.LoadingButton onclick={prove}>Prove</Ui.LoadingButton>

      <Ui.LoadingButton onclick={createSmartAccount}>
        Create my smart account
      </Ui.LoadingButton>
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

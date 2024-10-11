<script lang="ts">
  import { lib } from "$lib";
  import ConnectWalletOr from "$lib/ConnectWalletOr.svelte";
  import { Ui } from "$lib/ui";
  import { zAddress } from "$lib/utils";
  import { utils } from "@repo/utils";
  import { ethers } from "ethers";
  import { z } from "zod";
</script>

<Ui.GapContainer>
  <section class="container">
    <div class="prose mb-2">
      <h2>Wallet</h2>
    </div>
  </section>

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

<script lang="ts">
  import { lib } from "$lib";
  import { Ui } from "@repo/ui";
  import { ethers } from "ethers";
  import type { Address } from "viem";
  import { z } from "zod";
  import { zAddress } from "./utils";
  import { relayer } from "./chain";

  let {
    address,
  }: {
    address: Address;
  } = $props();
</script>

<Ui.Card.Root>
  <Ui.Card.Header>
    <Ui.Card.Title>Send ETH</Ui.Card.Title>
  </Ui.Card.Header>
  <Ui.Card.Content>
    <Ui.Form
      schema={z.object({
        recipient: zAddress(),
        amount: z.string(),
      })}
      initialValues={{
        recipient: relayer.address,
        amount: "0.00001",
      }}
      onsubmit={async (data) => {
        const cred = await lib.webAuthn.getCredential();
        const tx = await lib.eip7702.executeTx({
          credentialId: cred.id,
          address,
          to: data.recipient,
          value: ethers.parseEther(data.amount),
        });
        console.log("tx", tx);
        lib.queries.invalidateAll();
        Ui.toast.success("Transaction sent successfully");
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
</Ui.Card.Root>

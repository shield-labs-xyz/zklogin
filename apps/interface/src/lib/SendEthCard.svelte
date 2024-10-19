<script lang="ts">
  import { lib } from "$lib";
  import { createQuery } from "@tanstack/svelte-query";
  import { ethers } from "ethers";
  import { assert } from "ts-essentials";
  import type { Address } from "viem";
  import { z } from "zod";
  import { Ui } from "./ui";
  import { zAddress } from "./utils";
  import { ethersSignerToWalletClient, getBundlerClient } from "./viemClients";

  let {
    jwt,
    signer,
  }: {
    jwt: string;
    signer: ethers.Wallet;
  } = $props();

  let balanceQuery = $derived(
    createQuery(
      {
        queryKey: ["balance", signer.address],
        queryFn: async () => {
          const raw = await signer.provider!.getBalance(signer.address);
          return `${ethers.formatEther(raw)} ETH`;
        },
      },
      lib.queries.queryClient,
    ),
  );
</script>

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
</Ui.Card>

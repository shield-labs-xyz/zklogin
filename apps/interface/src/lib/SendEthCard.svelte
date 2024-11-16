<script lang="ts">
  import { lib } from "$lib";
  import { Ui } from "@repo/ui";
  import { createQuery } from "@tanstack/svelte-query";
  import { ethers } from "ethers";
  import { assert } from "ts-essentials";
  import { z } from "zod";
  import { zAddress } from "./utils";

  let {
    jwt,
    signer,
    disabled,
  }: {
    jwt: string | undefined;
    signer: ethers.Wallet;
    disabled: boolean;
  } = $props();

  let balanceQuery = $derived(
    createQuery(
      {
        queryKey: ["balance", jwt && ethers.id(jwt)],
        queryFn: async () => {
          let raw: bigint;
          if (!jwt) {
            raw = 0n;
          } else {
            throw new Error("not implemented");
            // const account = await lib.jwtAccount.getAccount(jwt, signer);
            // raw = await signer.provider!.getBalance(account.address);
          }
          return `${ethers.formatEther(raw)} ETH`;
        },
      },
      lib.queries.queryClient,
    ),
  );
</script>

<Ui.Card.Root>
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
        assert(jwt, "no session");
        throw new Error("not implemented");
        // const bundlerClient = getBundlerClient(
        //   await ethersSignerToWalletClient(signer),
        // );
        // const account = await lib.jwtAccount.getAccount(jwt, signer);
        // const tx = await bundlerClient.sendUserOperation({
        //   account,
        //   calls: [
        //     {
        //       to: data.recipient as Address,
        //       value: ethers.parseEther(data.amount),
        //     },
        //   ],
        // });
        // console.log("tx", tx);
        // Ui.toast.success("Transaction sent successfully");
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

        <Ui.Form.SubmitButton variant="default">
          {disabled ? "Create a session first" : "Send"}
        </Ui.Form.SubmitButton>
      {/snippet}
    </Ui.Form>
  </Ui.Card.Content>
</Ui.Card.Root>

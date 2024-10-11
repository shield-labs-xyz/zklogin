<script lang="ts">
  import { lib } from "$lib";
  import type { ComponentProps } from "svelte";
  import { Ui } from "./ui";

  let { children, ...props }: ComponentProps<Ui.Button> = $props();
</script>

{#if !lib.web3modal.account}
  <Ui.Button variant="default" {...props} onclick={() => lib.web3modal.open()}>
    Connect Wallet
  </Ui.Button>
{:else}
  {@render children?.()}
{/if}

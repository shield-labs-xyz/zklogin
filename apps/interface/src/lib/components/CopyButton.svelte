<script lang="ts">
  import { utils } from "@repo/utils";
  import Copy from "lucide-svelte/icons/copy";
  import CopyCheck from "lucide-svelte/icons/copy-check";
  import type { ComponentProps } from "svelte";
  import { Button } from "./ui";

  let {
    children,
    ...props
  }: ComponentProps<Button> & {
    text: string;
  } = $props();

  let statusCounter = $state(0);
</script>

<Button
  {...props}
  size={props.size ?? "icon"}
  on:click={async () => {
    await navigator.clipboard.writeText(props.text);
    statusCounter += 1;
    setTimeout(async () => {
      await utils.sleep("1 sec");
      statusCounter -= 1;
    });
  }}
>
  {#if statusCounter > 0}
    <CopyCheck />
  {:else}
    <Copy />
  {/if}
  {@render children?.()}
</Button>

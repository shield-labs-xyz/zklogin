<script lang="ts">
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
  size={props.size ?? (children ? "default" : "icon")}
  on:click={async () => {
    await navigator.clipboard.writeText(props.text);
    statusCounter++;
    setTimeout(() => {
      statusCounter--;
    }, 1000);
  }}
>
  {#if statusCounter > 0}
    <CopyCheck />
  {:else}
    <Copy />
  {/if}
  {@render children?.()}
</Button>

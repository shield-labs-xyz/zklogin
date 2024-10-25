<script lang="ts">
  import Copy from "lucide-svelte/icons/copy";
  import CopyCheck from "lucide-svelte/icons/copy-check";
  import type { ComponentProps } from "svelte";
  import { Button } from "./ui";

  let {
    children,
    text,
    iconClass,
    ...props
  }: ComponentProps<Button> & {
    text: string;
    iconClass?: string;
  } = $props();

  let statusCounter = $state(0);
</script>

<Button
  {...props}
  size={props.size ?? (children ? "default" : "icon")}
  on:click={async () => {
    await navigator.clipboard.writeText(text);
    statusCounter++;
    setTimeout(() => {
      statusCounter--;
    }, 1000);
  }}
>
  {#if statusCounter > 0}
    <CopyCheck class={iconClass} />
  {:else}
    <Copy class={iconClass} />
  {/if}
  {@render children?.()}
</Button>

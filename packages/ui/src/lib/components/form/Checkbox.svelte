<script lang="ts">
  import { cn } from "#lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ...props
  }: HTMLAttributes<HTMLInputElement> & {
    value: string;
  } = $props();
</script>

<input
  type="checkbox"
  {...props}
  class={cn(
    "peer box-content h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-primary text-current ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50",
  )}
/>

<script lang="ts">
  import { cn } from "#lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";
  let { children, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...props} class={cn("flex flex-col gap-6", props.class)}>
  {@render children?.()}
</div>

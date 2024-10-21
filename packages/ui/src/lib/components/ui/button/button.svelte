<script lang="ts">
  import { cn } from "#lib/utils.js";
  import { Button as ButtonPrimitive } from "bits-ui";
  import LoaderCircle from "lucide-svelte/icons/loader-circle";
  import { type Events, type Props, buttonVariants } from "./index.js";

  type $$Props = Props & {
    loading?: boolean;
  };
  type $$Events = Events;

  let className: $$Props["class"] = undefined;
  export let variant: $$Props["variant"] = "secondary";
  export let size: $$Props["size"] = "default";
  export let builders: $$Props["builders"] = [];
  export let loading: $$Props["loading"] = false;
  export { className as class };
</script>

<ButtonPrimitive.Root
  {builders}
  class={cn(buttonVariants({ variant, size, className }), "no-underline")}
  type="button"
  {...$$restProps}
  disabled={loading || $$restProps.disabled}
  on:click
  on:keydown
>
  {#if loading}
    <LoaderCircle class="mr-2 h-[1em] w-[1em] animate-spin" />
  {/if}
  <slot />
</ButtonPrimitive.Root>

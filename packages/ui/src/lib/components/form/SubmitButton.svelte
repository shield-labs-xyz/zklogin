<script lang="ts">
  import { cn } from "#lib/utils.js";
  import type { ComponentProps } from "svelte";
  import { getContext } from "svelte-typed-context";
  import { readable } from "svelte/store";
  import { Button } from "../ui/button";
  import { formContextKey } from "./types";

  let { ...props }: ComponentProps<Button> = $props();
  let props2 = {
    ...props,
    type: "submit" as any,
  };

  const form = getContext(formContextKey);
  const loading = $derived(form?.submitting ?? readable(false));
</script>

<Button {...props2} loading={$loading} class={cn("w-full", props2.class)}>
  {@render props.children?.()}
</Button>

<script lang="ts">
  import type { ComponentProps } from "svelte";
  import type { AsyncOrSync } from "ts-essentials";
  import { toast } from "./toast";
  import { Button } from "./ui/button";

  let {
    children,
    onclick,
    ...props
  }: ComponentProps<Button> & {
    onclick: () => AsyncOrSync<unknown>;
  } = $props();

  let loading = $state(false);
</script>

<Button
  {...props}
  loading={props.loading || loading}
  onclick={async () => {
    loading = true;
    try {
      await onclick();
    } catch (e) {
      toast.error(e);
      throw e;
    } finally {
      loading = false;
    }
  }}
>
  {@render children?.()}
</Button>

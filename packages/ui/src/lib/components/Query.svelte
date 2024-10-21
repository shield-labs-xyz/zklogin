<script lang="ts" generics="T, E">
  import { castArray } from "lodash-es";
  import type { Snippet } from "svelte";
  import type { ArrayOrSingle } from "ts-essentials";

  let {
    query,
    hide = [],
    error,
    pending,
    success,
  }: {
    query:
      | {
          status: "pending";
        }
      | {
          status: "error";
          error: E;
        }
      | {
          status: "success";
          data: T;
        };
    hide?: ArrayOrSingle<"pending" | "error">;
    error?: Snippet<[E]>;
    pending?: Snippet;
    success: Snippet<[T]>;
  } = $props();

  let hideArray = $derived(castArray(hide));
</script>

{#if query.status === "pending"}
  {#if !hideArray.includes("pending")}
    {#if pending}
      {@render pending()}
    {:else}
      Loading...
    {/if}
  {/if}
{:else if query.status === "error"}
  {#if !hideArray.includes("error")}
    {#if error}
      {@render error(query.error)}
    {:else}
      Error: {String(query.error)}
    {/if}
  {/if}
{:else if query.status === "success"}
  {@render success(query.data)}
{/if}

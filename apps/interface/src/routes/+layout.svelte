<script lang="ts">
  import "../app.css";

  import { lib } from "$lib";
  import { Ui } from "$lib/ui";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { onMount } from "svelte";
  import Header from "./Header.svelte";

  let { data, children } = $props();

  onMount(async () => {
    console.log("session", data);
  });
</script>

<QueryClientProvider client={lib.queries.queryClient}>
  <Header />

  {@render children()}

  <Ui.Toaster position="bottom-right" />
</QueryClientProvider>

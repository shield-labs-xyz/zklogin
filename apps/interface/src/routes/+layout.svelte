<script lang="ts">
  import "../app.css";

  import { lib } from "$lib";
  import { Ui } from "$lib/ui";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import Header from "./Header.svelte";

  let { children } = $props();
</script>

<QueryClientProvider client={lib.queries.queryClient}>
  <Header />

  {@render children()}

  <Ui.Toaster position="bottom-right" />
</QueryClientProvider>

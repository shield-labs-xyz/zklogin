<script lang="ts">
  import "../app.css";

  import { dev } from "$app/environment";
  import { lib } from "$lib";
  import { Ui } from "@repo/ui";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { inject } from "@vercel/analytics";
  import Header from "./Header.svelte";

  let { children } = $props();

  inject({ mode: dev ? "development" : "production" });
</script>

<QueryClientProvider client={lib.queries.queryClient}>
  <Header />

  {@render children()}

  <Ui.Toaster position="bottom-right" />
</QueryClientProvider>

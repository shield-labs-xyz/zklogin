<script lang="ts">
  import Menu from "lucide-svelte/icons/menu";

  import { page } from "$app/stores";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { route } from "$lib/ROUTES";
  import { cn } from "$lib/utils";

  function isActive(href: string) {
    if (href === "/") {
      return $page.url.pathname === "/";
    }
    return $page.url.pathname.startsWith(href);
  }
</script>

<header
  class="sticky top-0 mb-6 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
>
  <nav
    class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
  >
    {@render navbar()}
  </nav>
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <Button
        variant="outline"
        size="icon"
        class="shrink-0 md:hidden"
        builders={[builder]}
      >
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Button>
    </Sheet.Trigger>
    <Sheet.Content side="left">
      <nav class="grid gap-6 text-lg font-medium">
        {@render navbar()}
      </nav>
    </Sheet.Content>
  </Sheet.Root>
  <div
    class="flex w-full items-center gap-4 md:ml-auto md:w-auto md:gap-2 lg:gap-4"
  >
    <div class="grow"></div>
  </div>
</header>

{#snippet navbar()}
  <a
    href={route("/")}
    class="flex items-center gap-2 text-lg font-semibold md:text-base"
  >
    Wallet
  </a>
  {@render link({ text: "Home", href: route("/") })}
{/snippet}

{#snippet link({ text, href }: { text: string; href: string })}
  <a
    {href}
    class={cn(
      "transition-colors hover:text-foreground",
      isActive(href) ? "text-foreground" : "text-muted-foreground",
    )}
  >
    {text}
  </a>
{/snippet}

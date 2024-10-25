<script lang="ts">
  import { page } from "$app/stores";
  import { lib } from "$lib";
  import { signOut } from "@auth/sveltekit/client";
  import { Ui } from "@repo/ui";
  import Menu from "lucide-svelte/icons/menu";

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
  <Ui.Sheet.Root>
    <Ui.Sheet.Trigger asChild let:builder>
      <Ui.Button
        variant="outline"
        size="icon"
        class="shrink-0 md:hidden"
        builders={[builder]}
      >
        <Menu class="h-5 w-5" />
        <span class="sr-only">Toggle navigation menu</span>
      </Ui.Button>
    </Ui.Sheet.Trigger>
    <Ui.Sheet.Content side="left">
      <nav class="grid gap-6 text-lg font-medium">
        {@render navbar()}
      </nav>
    </Ui.Sheet.Content>
  </Ui.Sheet.Root>
  <div
    class="flex w-full items-center gap-4 md:ml-auto md:w-auto md:gap-2 lg:gap-4"
  >
    <div class="grow"></div>
    {#if $page.data.session}
      <Ui.Button onclick={() => signOut()}>Sign out</Ui.Button>
    {/if}
  </div>
</header>

{#snippet navbar()}
  <a
    href={"/"}
    class="flex items-center gap-2 text-lg font-semibold md:text-base"
  >
    {lib.APP_NAME}
  </a>
  {@render link({ text: "How it works", href: "/how" })}
{/snippet}

{#snippet link({ text, href }: { text: string; href: string })}
  <a
    {href}
    class={Ui.cn(
      "transition-colors hover:text-foreground",
      isActive(href) ? "text-foreground" : "text-muted-foreground",
    )}
  >
    {text}
  </a>
{/snippet}

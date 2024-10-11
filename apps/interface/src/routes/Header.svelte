<script lang="ts">
  import Menu from "lucide-svelte/icons/menu";

  import { page } from "$app/stores";
  import { lib } from "$lib";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import ConnectWalletOr from "$lib/ConnectWalletOr.svelte";
  import { route } from "$lib/ROUTES";
  import { Ui } from "$lib/ui";
  import { cn } from "$lib/utils";
  import { utils } from "@repo/utils";

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
    <ConnectWalletOr>
      {#if lib.web3modal.account}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button builders={[builder]} variant="ghost" class="rounded-full">
              <span class="mr-2">
                {utils.shortAddress(lib.web3modal.account.address)}
              </span>
              <Ui.UserAvatar address={lib.web3modal.account.address} />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Label class="flex items-center gap-2">
              {utils.shortAddress(lib.web3modal.account.address)}
              <Ui.CopyButton text={lib.web3modal.account.address} size="sm" />
            </DropdownMenu.Label>
            <!-- <DropdownMenu.Separator />
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Item>Support</DropdownMenu.Item> -->
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {/if}
    </ConnectWalletOr>
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

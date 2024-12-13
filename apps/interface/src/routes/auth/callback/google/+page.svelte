<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { lib } from "$lib";
  import { utils } from "@shield-labs/utils";

  if (browser) {
    utils.iife(async () => {
      await lib.authProvider.handleRedirect();
      goto("/");
    });
  }
</script>

<div>Processing authentication...</div>

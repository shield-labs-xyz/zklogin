<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const idToken = hashParams.get("id_token");
    const state = hashParams.get("state");
    const error = hashParams.get("error");

    if (idToken && state) {
      window.opener.postMessage(
        { type: "GOOGLE_SIGN_IN_SUCCESS", idToken, state },
        window.location.origin,
      );
    } else {
      window.opener.postMessage(
        { type: "GOOGLE_SIGN_IN_ERROR", error },
        window.location.origin,
      );
    }

    window.close();
  });
</script>

<div>Processing authentication...</div>

<script lang="ts">
  // @ts-ignore - no types for jazzicon
  import jazzicon from "@metamask/jazzicon";

  let { address, size = 20 }: { address: string; size?: number } = $props();

  let el: HTMLElement;
  $effect(() => {
    const seed = Number(BigInt(address) % BigInt(Number.MAX_SAFE_INTEGER));
    const icon = jazzicon(size, seed);
    el.innerHTML = "";
    el.appendChild(icon);
  });
</script>

<span bind:this={el} style="display: inline-block; transform: translateY(13%)"
></span>

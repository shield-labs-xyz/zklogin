export const now = $state({ value: Date.now() });

$effect.root(() => {
  $effect(() => {
    const interval: any = setInterval(() => {
      now.value = Date.now();
    }, 1000);
    return () => clearInterval(interval);
  });
});

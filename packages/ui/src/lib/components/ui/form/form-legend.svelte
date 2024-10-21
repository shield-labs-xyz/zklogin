<script lang="ts">
  import { cn } from "#lib/utils.js";
  import * as FormPrimitive from "formsnap";

  type $$Props = FormPrimitive.LegendProps;

  let className: $$Props["class"] = undefined;
  export { className as class };
</script>

<FormPrimitive.Legend
  {...$$restProps}
  class={cn(
    "text-sm font-medium leading-none data-[fs-error]:text-destructive",
    className,
  )}
  let:legendAttrs
>
  <slot {legendAttrs} />
</FormPrimitive.Legend>

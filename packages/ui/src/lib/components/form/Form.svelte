<script lang="ts" generics="T extends z.AnyZodObject">
  import { toRuneObject } from "#lib/utils.svelte.js";
  import { setContext } from "svelte-typed-context";
  import { defaults, superForm, superValidate } from "sveltekit-superforms";
  import { zod, zodClient } from "sveltekit-superforms/adapters";
  import type { Infer } from "sveltekit-superforms/client";
  import { z } from "zod";
  import { toast } from "../toast";
  import { formContextKey } from "./types";

  let {
    schema,
    onsubmit,
    children,
  }: {
    schema: T;
    onsubmit: (data: z.infer<T>) => Promise<void>;
    children: (
      form: ReturnType<typeof superForm<Infer<T>>>,
      formData: Infer<T>,
    ) => any;
  } = $props();

  let formElement: HTMLFormElement | undefined = $state();
  const form = superForm(defaults(zod(schema)), {
    validators: zodClient(schema),
    SPA: true,
    async onSubmit(input) {
      try {
        const result = await superValidate(input.formData, zod(schema));
        if (!result.valid) {
          throw new Error("Invalid form data");
        }
        const data = result.data;
        await onsubmit(data);
        // formElement?.reset();
      } catch (e) {
        toast.error(e);
        throw e;
      }
    },
  });

  const { form: formDataStore, enhance } = form;
  let formData = toRuneObject(formDataStore);
  setContext(formContextKey, form);
</script>

<form use:enhance bind:this={formElement}>
  {@render children(form, formData)}
</form>

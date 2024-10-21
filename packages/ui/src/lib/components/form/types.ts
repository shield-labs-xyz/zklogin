import type { InjectionKey } from "svelte-typed-context";
import type { SuperForm } from "sveltekit-superforms";

export const formContextKey: InjectionKey<SuperForm<any>> = Symbol("form");

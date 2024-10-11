import { get, type Writable } from "svelte/store";

export function toRuneObject<T extends {}>(store: Writable<T>): T {
  let value = $state(get(store));
  store.subscribe((s) => {
    value = s;
  });
  return new Proxy(value, {
    get(target, prop) {
      return Reflect.get(target, prop);
    },
    set(target, prop, value) {
      Reflect.set(target, prop, value);
      store.set(target);
      return true;
    },
  });
}

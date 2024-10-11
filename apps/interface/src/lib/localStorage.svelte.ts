import { browser } from "$app/environment";
import * as devalue from "devalue";

export class LocalStore<T> {
  value = $state<T>() as T;

  constructor(
    private key: string,
    defaultValue: T,
  ) {
    this.value = defaultValue;

    if (browser) {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          this.value = this.deserialize(item);
        } catch (e) {
          console.error(e);
        }
      }
    }

    $effect.root(() => {
      $effect(() => {
        localStorage.setItem(this.key, this.serialize(this.value));
      });
    });
  }

  serialize(value: T): string {
    return devalue.stringify(value);
  }

  deserialize(item: string): T {
    return devalue.parse(item);
  }
}

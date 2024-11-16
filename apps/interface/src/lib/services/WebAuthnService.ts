import { LocalStore } from "$lib/localStorage.svelte";
import {
  createCredential,
  type CreateCredentialReturnType,
} from "webauthn-p256";

export class WebAuthnService {
  #cred = new LocalStore<SerializedCredential | undefined>(
    "credential",
    undefined,
  );

  async useOrCreateCredential({ name }: { name: string }) {
    if (!this.#cred.value) {
      this.#cred.value = await this.#createCredential({ name });
    }
    return this.#cred.value;
  }

  async #createCredential({
    name,
  }: {
    name: string;
  }): Promise<SerializedCredential> {
    const cred = await createCredential({
      user: {
        name,
      },
    });
    return {
      id: cred.id,
      publicKey: cred.publicKey,
    };
  }
}

export type SerializedCredential = Pick<
  CreateCredentialReturnType,
  "id" | "publicKey"
>;

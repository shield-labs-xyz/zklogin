import type { Session } from "@auth/sveltekit";

export async function load(event) {
  const session = (await event.locals.auth()) as
    | (Session & { id_token?: string })
    | null;

  return {
    session,
  };
}
